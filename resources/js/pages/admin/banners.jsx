import React, { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"

import api from "@/lib/api"

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
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deletingBanner, setDeletingBanner] = useState(null)
  const [category, setCategory] = useState("all")

  /* ================= FETCH BANNERS ================= */
  useEffect(() => {
    fetchBanners()
  }, [])

  async function fetchBanners() {
    try {
      const res = await api.get("/api/admin/banners")
      setBanners(res.data.data ?? [])
    } catch (err) {
      console.error(err)
      toast.error("Gagal mengambil banner")
    } finally {
      setLoading(false)
    }
  }

  /* ================= DELETE BANNER ================= */
  async function handleDelete(banner) {
    setDeleteLoading(true)
    try {
      await api.delete(`/api/admin/banners/${banner.id}`)

      setBanners((prev) => prev.filter((b) => b.id !== banner.id))
      toast.success("Banner berhasil dihapus!")
    } catch (err) {
      console.error(err)
      toast.error("Gagal menghapus banner")
    } finally {
      setDeleteLoading(false)
      setDeletingBanner(null)
    }
  }

  /* ================= HELPERS ================= */
  function labelCategory(cat) {
    switch (cat) {
      case "shae-muslim":
        return "Shae Muslim"
      case "shae-life":
        return "Shae Life"
      case "shae-kreasi":
        return "Shae Kreasi"
      case "shae-academy":
        return "Shae Academy"
      default:
        return cat
    }
  }

  function resolveImageUrl(image) {
    if (!image) return "/placeholder.png"
    if (image.startsWith("http")) return image
    return `${import.meta.env.VITE_API_URL}/storage/${image}`
  }

  /* ================= FILTER ================= */
  const filteredBanners = useMemo(() => {
    if (category === "all") return banners
    return banners.filter((b) => b.category === category)
  }, [banners, category])

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Banner</h1>
        <Button asChild>
          <Link to="/admin/banners/create">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Banner
          </Link>
        </Button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 rounded-md border px-3 text-sm"
        >
          <option value="all">Semua Kategori</option>
          <option value="shae-academy">Shae Academy</option>
          <option value="shae-muslim">Shae Muslim</option>
          <option value="shae-life">Shae Life</option>
          <option value="shae-profesional">Shae Profesional</option>
        </select>
      </div>

      {/* TABLE */}
      <Card>
        <CardContent className="p-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Preview</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Urutan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading &&
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="h-12 w-24 rounded-md bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-10 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))}

              {!loading && filteredBanners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Tidak ada banner
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredBanners.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.title}
                        className="h-12 w-24 rounded-md object-cover border"
                        loading="lazy"
                      />
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {labelCategory(item.category)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">#{item.order}</Badge>
                    </TableCell>

                    <TableCell>
                      <Switch checked={item.is_active} disabled />
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/admin/banners/edit?id=${item.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setDeletingBanner(item)}
                        disabled={deleteLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DELETE DIALOG */}
      {deletingBanner && (
        <Dialog
          open={!!deletingBanner}
          onOpenChange={(open) => !open && setDeletingBanner(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Hapus Banner</DialogTitle>
            </DialogHeader>

            <p className="py-2">
              Apakah Anda yakin ingin menghapus banner{" "}
              <b>{labelCategory(deletingBanner.category)}</b>?
            </p>

            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeletingBanner(null)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deletingBanner)}
                disabled={deleteLoading}
              >
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
