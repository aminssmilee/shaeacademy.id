<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendAdminOtpJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Http;

class AdminAuthController extends Controller
{
    public function showLoginForm()
    {
        return inertia('Admin/AdminLogin'); // pakai Inertia
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'recaptcha_token' => 'required',
        ]);

        // verifikasi reCAPTCHA
        $verify = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('services.recaptcha.secret'),
            'response' => $request->recaptcha_token,
        ]);

        if (!($verify['success'] ?? false)) {
            return back()->withErrors(['recaptcha_token' => 'reCAPTCHA tidak valid'])->withInput();
        }

        // rate limit login
        $key = 'login_attempt:' . strtolower($request->email);
        if (RateLimiter::tooManyAttempts($key, 5)) {
            return back()->withErrors(['email' => 'Terlalu banyak percobaan login, tunggu beberapa menit'])->withInput();
        }

        if (!Auth::attempt($request->only('email','password'))) {
            RateLimiter::hit($key, 60*5);
            return back()->withErrors(['email' => 'Email atau password salah'])->withInput();
        }
        RateLimiter::clear($key);

        $user = Auth::user();

        if ($user->role !== 'admin') {
            Auth::logout();
            return back()->withErrors(['email' => 'Unauthorized'])->withInput();
        }

        // generate OTP
        $otp = random_int(100000, 999999);
        Cache::put("admin_otp_{$user->id}", $otp, now()->addMinutes(5));

        // dispatch job kirim OTP
        SendAdminOtpJob::dispatch($user, $otp);

        // simpan user id di session untuk OTP
        session(['otp_user_id' => $user->id]);

        return redirect()->route('admin.otp')->with('success', 'OTP sudah dikirim ke email');
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('admin.login');
    }
}
