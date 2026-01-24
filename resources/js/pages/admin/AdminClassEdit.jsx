"use client"

import React, { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { toast } from "sonner"

import { TOPICS_BY_CATEGORY } from "@/topics/index"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function EditClass() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [topic, setTopic] = useState("")
  const [link, setLink] = useState("")
  const [posterUrl, setPosterUrl] = useState("")
  const [newPoster, setNewPoster] = useState(null)
  const [error, setError] = useState(null)

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!id) {
      toast.error("ID kelas tidak ditemukan")
      navigate("/admin/classes")
      return
    }
    fetchClass(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchClass(classId) {
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) throw new Error("Token admin tidak ditemukan")

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/classes/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Gagal ambil data kelas")

      const json = await res.json()
      const data = json.data

      setTitle(data.title)
      setPrice(String(data.price))
      setCategory(data.category)
      setTopic(data.topic)
      setLink(data.external_link ?? "")
      setPosterUrl(
        data.poster?.startsWith("http")
          ? data.poster
          : `${import.meta.env.VITE_API_URL}/storage/${data.poster}`
      )
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Gagal mengambil data kelas")
    } finally {
      setLoading(false)
    }
  }

  /* ================= SUBMIT ================= */
  async function handleSubmit(e) {
    e.preventDefault()
    if (!id) return
    setSaving(true)
    setError(null)

    try {
      const token = localStorage.getItem("admin_token")
      if (!token) throw new Error("Token admin tidak ditemukan")

      const formData = new FormData()
      formData.append("_method", "PUT")
      formData.append("title", title)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("topic", topic)
      formData.append("external_link", link)
      if (newPoster) formData.append("poster", newPoster)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/classes/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Gagal update kelas")
      }

      toast.success("Kelas berhasil diperbarui")
      navigate("/admin/classes")
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Gagal menyimpan perubahan")
      setError(err.message || "Terjadi kesalahan")
    } finally {
      setSaving(false)
    }
  }

  function formatRupiah(value) {
    const number = value.replace(/\D/g, "")
    return number ? "Rp " + new Intl.NumberFormat("id-ID").format(Number(number)) : ""
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>

  return (
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Edit Kelas</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && <div className="text-sm text-destructive">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Judul */}
          <div>
            <Label>Judul</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {/* Harga */}
          <div>
            <Label>Harga</Label>
            <Input
              value={price}
              placeholder="0"
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
              required
            />
            <div className="text-sm text-muted-foreground mt-1">{formatRupiah(price)}</div>
          </div>

          {/* Program */}
          <div>
            <Label>Program</Label>
            <Select value={category} onValueChange={(val) => { setCategory(val); setTopic(""); }} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shae-muslim">Shae Muslim</SelectItem>
                <SelectItem value="shae-life">Shae Life</SelectItem>
                <SelectItem value="shae-kreasi">Shae Kreasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topik */}
          {category && (
            <div>
              <Label>Topik</Label>
              <Select value={topic} onValueChange={setTopic} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih topik" />
                </SelectTrigger>
                <SelectContent>
                  {TOPICS_BY_CATEGORY[category]?.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Link Eksternal */}
          <div>
            <Label>Link Eksternal</Label>
            <Input value={link} onChange={(e) => setLink(e.target.value)} />
          </div>

          {/* Poster */}
          <div className="space-y-2">
            <Label>Poster</Label>
            {(newPoster || posterUrl) && (
              <img
                src={newPoster ? URL.createObjectURL(newPoster) : posterUrl}
                alt="Poster Preview"
                className="w-full h-48 object-cover rounded border mb-2"
              />
            )}
            <Input type="file" accept="image/*" onChange={(e) => setNewPoster(e.target.files?.[0] ?? null)} />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full py-2" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
