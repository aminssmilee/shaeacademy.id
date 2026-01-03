<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendAdminOtpJob;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;

class AdminAuthController extends Controller
{
    /**
     * STEP 1: LOGIN (EMAIL + PASSWORD + reCAPTCHA)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'           => 'required|email',
            'password'        => 'required',
            'recaptcha_token' => 'required',
        ]);

        // 🔐 Verify reCAPTCHA
        $verify = Http::asForm()->post(
            'https://www.google.com/recaptcha/api/siteverify',
            [
                'secret'   => config('services.recaptcha.secret'),
                'response' => $request->recaptcha_token,
            ]
        );

        if (!($verify['success'] ?? false)) {
            return response()->json(['message' => 'reCAPTCHA tidak valid'], 422);
        }

        // 🔑 Check credential
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Email atau password salah'], 401);
        }

        $user = Auth::user();

        // 🚫 Admin only
        if ($user->role !== 'admin') {
            Auth::logout();
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // ⛔ Rate limit OTP
        if (RateLimiter::tooManyAttempts("admin-otp:{$user->id}", 3)) {
            return response()->json([
                'message' => 'Terlalu banyak permintaan OTP, coba lagi nanti'
            ], 429);
        }

        RateLimiter::hit("admin-otp:{$user->id}", 300);

        // 🔢 Generate OTP
        $otp = (string) random_int(100000, 999999);

        Cache::put("admin_otp_{$user->id}", $otp, now()->addMinutes(5));

        SendAdminOtpJob::dispatch($user, $otp);

        return response()->json([
            'message' => 'OTP dikirim ke email',
            'user_id' => $user->id,
        ]);
    }

    /**
     * STEP 2: VERIFY OTP → RETURN TOKEN
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|digits:6',
        ]);

        $cachedOtp = Cache::get("admin_otp_{$request->user_id}");

        if (!$cachedOtp || $cachedOtp !== $request->otp) {
            return response()->json(['message' => 'OTP salah'], 422);
        }

        Cache::forget("admin_otp_{$request->user_id}");

        $user = User::findOrFail($request->user_id);

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 🔑 INI YANG KEMARIN HILANG
        $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * RESEND OTP
     */
    public function resendOtp(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        if (RateLimiter::tooManyAttempts("resend-otp:{$request->user_id}", 1)) {
            return response()->json([
                'message' => 'Tunggu 60 detik sebelum kirim ulang OTP'
            ], 429);
        }

        RateLimiter::hit("resend-otp:{$request->user_id}", 60);

        $user = User::findOrFail($request->user_id);

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $otp = (string) random_int(100000, 999999);

        Cache::put("admin_otp_{$user->id}", $otp, now()->addMinutes(5));

        SendAdminOtpJob::dispatch($user, $otp);

        return response()->json([
            'message' => 'OTP berhasil dikirim ulang',
        ]);
    }

    /**
     * GET ADMIN PROFILE (TOKEN BASED)
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * LOGOUT (REVOKE TOKEN)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }
}
