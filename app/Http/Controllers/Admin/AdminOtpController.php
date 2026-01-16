<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class AdminOtpController extends Controller
{
    public function showOtpForm()
    {
        // pastikan ada user_id di session
        if (!session('otp_user_id')) {
            return redirect()->route('admin.login');
        }

        return inertia('Admin/AdminOtp'); // halaman OTP Inertia
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|digits:6',
        ]);

        $userId = session('otp_user_id');
        $cachedOtp = Cache::get("admin_otp_{$userId}");

        if (!$cachedOtp || $cachedOtp != $request->otp) {
            return back()->withErrors(['otp' => 'OTP salah atau expired']);
        }

        // OTP valid → login user
        Auth::loginUsingId($userId);

        // hapus cache & session
        Cache::forget("admin_otp_{$userId}");
        $request->session()->forget('otp_user_id');

        return redirect()->route('admin.dashboard');
    }
}
