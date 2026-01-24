import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function AdminBannerEdit() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const bannerId = searchParams.get("id")

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("shae-muslim")
  const [order, setOrder] = useState(1)
  const [isActive, setIsActive] = useState(true)
  const [newImage, setNewImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!bannerId) {
      toast.error("ID banner tidak ditemukan")
      navigate("/admin/banners")
      return
    }

    async function fetchBanner() {
      try {
        const token = localStorage.getItem("admin_token")
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/banners/${bannerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Gagal mengambil data banner")
        const json = await res.json()
        const data = json.data

        setTitle(data.title ?? "")
        setCategory(data.category)
        setOrder(data.order)
        setIsActive(Boolean(data.is_active))
        setPreview(data.image)
      } catch (err) {
        console.error(err)
        toast.error(err.message)
        navigate("/admin/banners")
      } finally {
        setLoading(false)
      }
    }

    fetchBanner()
  }, [bannerId, navigate])

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) return toast.error("File harus gambar")
    if (file.size > 4 * 1024 * 1024) return toast.error("Maks 4MB")
    setNewImage(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!bannerId) return
    setSaving(true)
    try {
      const token = localStorage.getItem("admin_token")
      const formData = new FormData()
      formData.append("_method", "PUT")
      formData.append("title", title)
      formData.append("category", category)
      formData.append("order", String(order))
      formData.append("is_active", isActive ? "1" : "0")
      if (newImage) formData.append("image", newImage)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/banners/${bannerId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) throw new Error("Gagal menyimpan banner")
      toast.success("Banner berhasil diperbarui")
      navigate("/admin/banners")
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Memuat banner...</p>

  return (
    <Card className="max-w-xl py-5 mx-auto">
      <CardHeader>
        <CardTitle>Edit Banner</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* IMAGE */}
          <div className="space-y-2">
            <Label>Gambar Banner</Label>
            <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 hover:bg-muted/30">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview Banner"
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Klik untuk ganti banner</p>
                </>
              )}
              <Input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          {/* CATEGORY */}
          <div className="space-y-1">
            <Label>Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shae-academy">Shae Academy</SelectItem>
                <SelectItem value="shae-muslim">Shae Muslim</SelectItem>
                <SelectItem value="shae-life">Shae Life</SelectItem>
                <SelectItem value="shae-kreasi">Shae Kreasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ORDER */}
          <div className="space-y-1">
            <Label>Urutan Banner</Label>
            <Input type="number" min={1} value={order} onChange={(e) => setOrder(Number(e.target.value))} />
            <p className="text-xs text-muted-foreground">Angka kecil tampil lebih dulu</p>
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

          {/* ACTION */}
          <Button type="submit" className="w-full" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Perubahan
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
