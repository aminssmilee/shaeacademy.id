import OTPForm from "@/components/otp-form"

export default function AdminOTPPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow">
        <OTPForm />
      </div>
    </div>
  )
}
