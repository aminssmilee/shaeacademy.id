import React from "react"
import LoginForm from "../../components/login-form"
import logo from "/public/img/academy.png"

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* Logo */}
        <img
          src={logo}
          alt="SHAE Academy"
          className="h-16 w-auto object-contain md:h-16" // responsive: mobile 24, desktop 32
        />
        {/* Form Login */}
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
