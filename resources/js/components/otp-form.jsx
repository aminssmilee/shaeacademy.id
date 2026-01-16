import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function OTPForm() {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const [userId, setUserId] = useState(null)
  const [ready, setReady] = useState(false)

  /* ===== GUARD PAGE ===== */
  useEffect(() => {
    const uid = sessionStorage.getItem("otp_user_id")
    if (!uid) {
      window.location.href = "/admin/login"
      return
    }
    setUserId(uid)
    setReady(true)
  }, [])

  /* ===== VERIFY OTP ===== */
  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (otp.length !== 6) {
      setError("Kode OTP harus 6 digit")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          otp,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Verifikasi OTP gagal")
      }

      if (!data.token) {
        throw new Error("Token tidak valid")
      }

      /* 🔐 SIMPAN TOKEN */
      localStorage.setItem("admin_token", data.token)

      /* 🧹 BERSIHKAN FLOW */
      sessionStorage.removeItem("otp_user_id")

      /* ✅ REDIRECT */
      window.location.href = "/admin"
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ===== RESEND OTP ===== */
  async function handleResend() {
    if (!userId || cooldown > 0) return

    setResending(true)
    setError(null)

    try {
      const res = await fetch("/api/admin/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Gagal kirim OTP")

      setCooldown(60)
    } catch (err) {
      setError(err.message)
    } finally {
      setResending(false)
    }
  }

  /* ===== COOLDOWN TIMER ===== */
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  if (!ready) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Verifikasi OTP</h1>
          <p className="text-sm text-muted-foreground">
            Masukkan 6 digit kode dari email admin
          </p>
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive text-center">
            {error}
          </p>
        )}

        <Field>
          <FieldLabel className="sr-only">OTP</FieldLabel>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              inputMode="numeric"
              autoFocus
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <FieldDescription className="text-center">
            Kode berlaku <b>5 menit</b>
          </FieldDescription>
        </Field>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Memverifikasi..." : "Verifikasi"}
        </Button>

        <FieldDescription className="text-center">
          Tidak menerima kode?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="font-medium underline disabled:opacity-50"
          >
            {cooldown > 0
              ? `Kirim ulang (${cooldown}s)`
              : resending
              ? "Mengirim..."
              : "Kirim ulang"}
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
