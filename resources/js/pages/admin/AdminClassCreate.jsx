"use client"

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"

import { TOPICS_BY_CATEGORY } from "@/topics/index"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function CreateClass() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [topic, setTopic] = useState("")
  const [link, setLink] = useState("")
  const [posterUrl, setPosterUrl] = useState("")
  const [newPoster, setNewPoster] = useState(null)
  const [saving, setSaving] = useState(false)

  function formatRupiah(value) {
    const number = value.replace(/\D/g, "")
    return number ? "Rp " + new Intl.NumberFormat("id-ID").format(Number(number)) : ""
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) throw new Error("Token admin tidak ditemukan")

      const formData = new FormData()
      formData.append("title", title)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("topic", topic)
      formData.append("external_link", link)
      if (newPoster) formData.append("poster", newPoster)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/classes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Gagal membuat kelas")
      }

      toast.success("Kelas berhasil dibuat")
      navigate("/admin/classes")
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Gagal menyimpan kelas")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Tambah Kelas Baru</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
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
              placeholder="0"
              value={price}
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
          <div className="flex justify-end space-x-2">
            <Link to="/admin/classes">
              <Button variant="outline">Batal</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
