<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class AdminOtpMail extends Mailable
{
    public function __construct(public int $otp) {}

    public function build()
    {
        return $this->subject('Kode OTP Login Admin')
            ->view('emails.admin-otp')
            ->with(['otp' => $this->otp]);
    }
}
