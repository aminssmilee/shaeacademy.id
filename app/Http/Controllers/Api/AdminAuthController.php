<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendAdminOtpJob;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'recaptcha_token' => 'required',
        ]);

        // 1️⃣ Verify reCAPTCHA
        $verify = Http::asForm()->post(
            'https://www.google.com/recaptcha/api/siteverify',
            [
                'secret' => config('services.recaptcha.secret'),
                'response' => $request->recaptcha_token,
            ]
        );

        if (!($verify['success'] ?? false)) {
            return response()->json(['message' => 'reCAPTCHA invalid'], 422);
        }

        // 2️⃣ Login credential
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Login gagal'], 401);
        }

        $user = Auth::user();

        // 3️⃣ Role check
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 4️⃣ Generate OTP
        $otp = random_int(100000, 999999);

        Cache::put(
            'admin_otp_' . $user->id,
            $otp,
            now()->addMinutes(5)
        );

        // 5️⃣ Dispatch OTP Queue
        SendAdminOtpJob::dispatch($user, $otp);

        return response()->json([
            'message' => 'OTP dikirim',
            'user_id' => $user->id,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|digits:6',
        ]);

        // 🔍 Ambil OTP dari cache
        $cachedOtp = Cache::get('admin_otp_' . $request->user_id);

        if (!$cachedOtp || $cachedOtp != $request->otp) {
            return response()->json(['message' => 'OTP salah atau kadaluarsa'], 422);
        }

        Cache::forget('admin_otp_' . $request->user_id);

        $user = User::findOrFail($request->user_id);

        // 🔐 Buat token Sanctum
        $token = $user->createToken('admin-token')->plainTextToken;

        // 🔐 Set httpOnly cookie
        $cookie = cookie(
            'admin_token',
            $token,
            60 * 24,
            '/',
            'localhost',   // 🔴 WAJIB
            false,         // 🔴 http (local)
            true,          // httpOnly
            false,
            'Lax'
        );


        // ✅ RESPONSE FINAL
        return response()->json([
            'message' => 'Login berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
            ],
        ])->withCookie($cookie);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            // 🔥 HAPUS SEMUA TOKEN USER (AMAN UNTUK COOKIE AUTH)
            $user->tokens()->delete();
        }

        // 🔥 HAPUS COOKIE admin_token
        $cookie = cookie(
            'admin_token',
            null,
            -1,
            '/',
            'localhost',
            false,
            true,
            false,
            'Lax'
        );

        return response()->json([
            'message' => 'Logout berhasil',
        ])->withCookie($cookie);
    }
}
