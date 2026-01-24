import React, { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"

// Fallback
import fallbackBanner from "/public/img/5.png"

export default function HeroBanner() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/api/public/banners/shae-academy")
        const data = res.data.data
        if (data && Array.isArray(data)) {
          setBanners(data)
        }
      } catch (error) {
        console.error("Gagal mengambil banner:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  if (loading) {
    return (
      <section className="relative bg-white">
        <div className="container mx-auto">
          <Skeleton className="w-full rounded-2xl aspect-[3780/1323]" />
        </div>
      </section>
    )
  }

  // Jika tidak ada banner dari API, pakai fallback
  const list = banners.length > 0
    ? banners
    : [{ id: "default", image: fallbackBanner, title: "Shae Academy" }]

  return (
    <section className="relative bg-white group">
      <div className="container mx-auto">
        <div className="relative w-full overflow-hidden rounded-2xl aspect-[3780/1323]">
          {/* SLIDER WRAPPER */}
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {list.map((item, idx) => (
              <div key={item.id || idx} className="min-w-full h-full relative">
                <img
                  src={item.image}
                  alt={item.title || "Banner"}
                  className="w-full h-full object-cover"
                  fetchPriority={idx === 0 ? "high" : "auto"}
                />
              </div>
            ))}
          </div>

          {/* DOTS NAVIGATION (Hanya jika > 1 banner) */}
          {list.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {list.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === index
                    ? "bg-white w-2"
                    : "bg-white/50 w-2 hover:bg-white/80"
                    }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
