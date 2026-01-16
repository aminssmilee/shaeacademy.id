import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

// Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Upload, Loader2 } from "lucide-react"

export default function AdminBannerCreate() {
  const navigate = useNavigate()

  const [category, setCategory] = useState("")
  const [order, setOrder] = useState(1)
  const [isActive, setIsActive] = useState(true)

  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /* ================= FILE UPLOAD ================= */
  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar")
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("Ukuran maksimal 4MB")
      return
    }

    setImage(file)
    setPreview(URL.createObjectURL(file))
    setError(null)
  }

  /* ================= SUBMIT ================= */
  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!image || !category) {
      setError("Gambar dan kategori wajib diisi")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("admin_token")
      if (!token) throw new Error("Token admin tidak ditemukan")

      const formData = new FormData()
      formData.append("category", category)
      formData.append("order", String(order))
      formData.append("is_active", isActive ? "1" : "0")
      formData.append("image", image)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/banners`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Gagal menyimpan banner")
      }

      toast.success("Banner berhasil disimpan!")
      navigate("/admin/banners")
    } catch (err) {
      console.error(err)
      setError(err.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Tambah Banner</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* IMAGE */}
          <div className="space-y-2">
            <Label>Gambar Banner</Label>
            <label
              htmlFor="image"
              className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 hover:bg-muted/30"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview Banner"
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Klik untuk upload banner (JPG / PNG / WebP)
                  </p>
                </>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* CATEGORY */}
          <div className="space-y-1">
            <Label>Kategori</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shae-muslim">Shae Muslim</SelectItem>
                <SelectItem value="shae-life">Shae Life</SelectItem>
                <SelectItem value="shae-professional">Shae Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ORDER */}
          <div className="space-y-1">
            <Label>Urutan Banner</Label>
            <Input
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Angka kecil akan tampil lebih dulu
            </p>
          </div>

          {/* ACTIVE */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Aktifkan Banner</p>
              <p className="text-xs text-muted-foreground">
                Banner aktif akan tampil di halaman publik
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          {/* SUBMIT */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Banner
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
