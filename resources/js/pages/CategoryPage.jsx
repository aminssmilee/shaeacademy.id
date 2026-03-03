"use client"

import React, { useEffect, useState } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import HeroBanner from "@/components/hero-banner"
import ClassCard from "@/components/common/class-card"
import { TOPICS_BY_CATEGORY } from "@/topics"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import useFavicon from "@/hooks/useFavicon"

// ================= CATEGORY MAPPING =================
// Map kategori front-end ke kategori yang sesuai di API Laravel
const apiCategoryMap = {
  muslim: "shae-muslim",
  life: "shae-life",
  kreasi: "shae-kreasi",
  talk: "shae-talk",
}

// Fungsi untuk mengambil label topic dari TOPICS_BY_CATEGORY
function topicLabel(topicValue, category) {
  if (topicValue === "all") return "Semua"
  const categoryTopics = TOPICS_BY_CATEGORY[category] || []
  const found = categoryTopics.find((t) => t.value === topicValue)
  return found ? found.label : topicValue
}

export default function CategoryPage({ category }) {
  useFavicon(category)
  const [classes, setClasses] = useState([])
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("termurah")
  const [topic, setTopic] = useState("all")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const apiCategory = apiCategoryMap[category] || "shae-muslim"

  // Ambil daftar topic sesuai category
  const topics = TOPICS_BY_CATEGORY[apiCategory] || [{ label: "Semua", value: "all" }]

  /* ================= FETCH CLASSES ================= */
  const fetchClasses = async (pageNumber = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append("page", pageNumber)
      if (search) params.append("search", search)
      if (sort === "termurah") params.append("sort", "price_asc")
      if (sort === "termahal") params.append("sort", "price_desc")
      if (topic !== "all") params.append("topic", topic)

      const res = await fetch(
        `/api/public/classes/category/${apiCategory}?${params.toString()}`
      )
      if (!res.ok) throw new Error("Gagal load kelas")

      const json = await res.json()
      setClasses(json.data || [])
      setPage(json.current_page || 1)
      setLastPage(json.last_page || 1)
    } catch (err) {
      console.error("Gagal fetch classes:", err)
      setClasses([])
      setPage(1)
      setLastPage(1)
    } finally {
      setLoading(false)
    }
  }

  // Fetch ketika mount atau kategori/search/sort/topic/page berubah
  useEffect(() => {
    fetchClasses(page)
  }, [category, search, sort, topic, page])

  /* ================= HANDLE PAGINATION ================= */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) setPage(newPage)
  }

  return (
    <>
      <Navbar />
      <HeroBanner category={category} />

      <main className="container mx-auto px-2 sm:px-6 pb-10 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* <h2 className="text-xl font-bold capitalize">
            Kategori: {topicLabel(topic, apiCategory)}
          </h2> */}

          {/* Desktop: search + sort + topic */}
          <div className="hidden sm:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
            {/* Kiri: Search */}
            <input
              type="text"
              placeholder="Cari kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 h-10 rounded-md border px-3 text-sm outline-none"
            />

            {/* Tengah: Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-md border px-3 text-sm ml-2"
            >
              <option value="termurah">Harga Termurah</option>
              <option value="termahal">Harga Termahal</option>
            </select>

            {/* Bawah atau kanan: Topics */}
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 sm:ml-2">
              {topics.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTopic(t.value)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition ${topic === t.value
                    ? "bg-black text-white"   // aktif hitam
                    : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile: search + icon filter */}
          <div className="flex sm:hidden items-center gap-2">
            <input
              type="text"
              placeholder="Cari kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 h-9 rounded-md border px-3 text-sm outline-none"
            />

            {/* Mobile Filter Drawer */}
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <button className="h-9 w-9 flex items-center justify-center rounded-md border">
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </SheetTrigger>

              <SheetContent side="bottom" className="rounded-t-2xl p-5 space-y-4">
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value)
                    setMobileFilterOpen(false)
                  }}
                  className="h-10 w-full rounded-lg border px-3 text-sm"
                >
                  <option value="termurah">Harga Termurah</option>
                  <option value="termahal">Harga Termahal</option>
                </select>

                <div className="flex flex-wrap gap-2 mt-2">
                  {topics.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => {
                        setTopic(t.value)
                        setMobileFilterOpen(false)
                      }}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition ${topic === t.value
                        ? "bg-black text-white"   // aktif hitam
                        : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* LIST KELAS */}
        {loading ? (
          <p className="text-sm text-gray-500">Memuat kelas...</p>
        ) : classes.length === 0 ? (
          <p className="text-sm text-gray-500">Kelas tidak ditemukan</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {classes.map((item) => (
              <ClassCard key={item.id} {...item} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {lastPage > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              {page} / {lastPage}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === lastPage}
              className="px-3 py-1 rounded-md border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
