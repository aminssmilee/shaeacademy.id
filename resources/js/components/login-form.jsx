import { useState, useRef } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"

export default function AdminLogin() {
  const recaptchaRef = useRef(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState(null)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Email dan password wajib diisi")
      return
    }

    if (!recaptchaToken) {
      setError("Silakan verifikasi reCAPTCHA")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          recaptcha_token: recaptchaToken,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Login gagal")
      }

      // simpan user id untuk OTP
      sessionStorage.setItem("otp_user_id", String(data.user_id))

      recaptchaRef.current?.reset()
      setRecaptchaToken(null)

      // redirect ke halaman OTP
      window.location.href = "/admin/otp"
    } catch (err) {
      setError(err.message)
      recaptchaRef.current?.reset()
      setRecaptchaToken(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-muted-foreground">
            Dashboard Admin
          </p>
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <FieldDescription>Khusus admin</FieldDescription>
        </Field>

        <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setRecaptchaToken(token)}
            onExpired={() => setRecaptchaToken(null)}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Mengirim OTP..." : "Masuk"}
        </Button>
      </FieldGroup>
    </form>
  )
}
