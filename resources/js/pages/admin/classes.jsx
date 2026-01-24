import React, { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TOPICS_BY_CATEGORY } from "@/topics/index" // pastikan path benar

export default function AdminClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [category, setCategory] = useState("all")
  const [topic, setTopic] = useState("all")

  useEffect(() => {
    fetchClasses()
  }, [])

  async function fetchClasses() {
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) throw new Error("Token admin tidak ditemukan")

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Gagal mengambil data kelas")

      const json = await res.json()
      setClasses(json.data ?? [])
    } catch (err) {
      console.error(err)
      toast.error("Gagal mengambil data kelas")
    } finally {
      setLoading(false)
    }
  }

  function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  function labelCategory(cat) {
    switch (cat) {
      case "shae-muslim":
        return "Shae Muslim"
      case "shae-life":
        return "Shae Life"
      case "shae-kreasi":
        return "Shae Kreasi"
      default:
        return cat
    }
  }

  function resolvePosterUrl(poster) {
    if (!poster) return "/placeholder.png"
    if (poster.startsWith("http")) return poster
    return `${import.meta.env.VITE_API_URL}/storage/${poster}`
  }

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const categoryMatch = category === "all" || item.category === category
      const topicMatch = topic === "all" || item.topic === topic
      return categoryMatch && topicMatch
    })
  }, [classes, category, topic])

  async function handleDelete(id) {
    setDeleteLoading(true)
    try {
      const token = localStorage.getItem("admin_token")
      if (!token) throw new Error("Token admin tidak ditemukan")

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/classes/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!res.ok) throw new Error("Gagal menghapus kelas")

      setClasses((prev) => prev.filter((c) => c.id !== id))
      toast.success("Kelas berhasil dihapus!")
    } catch (err) {
      console.error(err)
      toast.error("Gagal menghapus kelas")
    } finally {
      setDeleteLoading(false)
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Daftar Kelas</h1>
        <Button asChild>
          <Link to="/admin/classes/create">
            <Plus className="mr-2 h-4 w-4" /> Tambah Kelas
          </Link>
        </Button>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-3">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setTopic("all")
          }}
          className="h-9 rounded-md border px-3 text-sm"
        >
          <option value="all">Shae Category</option>
          <option value="shae-muslim">Shae Muslim</option>
          <option value="shae-life">Shae Life</option>
          <option value="shae-kreasi">Shae Kreasi</option>
        </select>

        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={category === "all"}
          className="h-9 rounded-md border px-3 text-sm disabled:opacity-50"
        >
          <option value="all">Topic</option>
          {category !== "all" &&
            TOPICS_BY_CATEGORY[category].map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
        </select>
      </div>

      {/* TABLE */}
      <Card>
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[90px]">Poster</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading &&
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="h-12 w-20 rounded-md bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <div className="h-8 w-8 rounded bg-gray-200 animate-pulse" />
                        <div className="h-8 w-8 rounded bg-gray-200 animate-pulse" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredClasses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Tidak ada kelas
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredClasses.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <img
                        src={resolvePosterUrl(item.poster)}
                        alt={item.title}
                        className="h-12 w-20 rounded-md object-cover border"
                        loading="lazy"
                      />
                    </TableCell>

                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{formatRupiah(item.price)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{labelCategory(item.category)}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.external_link ? (
                        <a
                          href={item.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline text-sm"
                        >
                          Buka
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/admin/classes/edit/${item.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Dialog
                        open={deletingId === item.id}
                        onOpenChange={(open) => {
                          if (!open) setDeletingId(null)
                        }}
                      >
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setDeletingId(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Konfirmasi Hapus</DialogTitle>
                            <DialogDescription>
                              Apakah Anda yakin ingin menghapus kelas{" "}
                              <strong>{item.title}</strong>? Aksi ini tidak dapat dikembalikan.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="space-x-2">
                            <Button variant="outline" onClick={() => setDeletingId(null)}>
                              Batal
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(item.id)}
                              disabled={deleteLoading}
                            >
                              {deleteLoading ? "Menghapus..." : "Hapus"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
