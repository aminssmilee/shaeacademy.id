<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminOtpVerified
{
  public function handle(Request $request, Closure $next)
  {
    // session flag setelah OTP sukses
    if (!$request->session()->get('admin_otp_verified')) {
      return response()->json(['message' => 'OTP required'], 401);
    }

    return $next($request);
  }
}
