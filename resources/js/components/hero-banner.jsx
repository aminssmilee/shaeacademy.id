"use client"

import React, { useEffect, useState } from "react"

export default function HeroBanner({ category = "muslim" }) {
  const [banners, setBanners] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const categoryMap = {
    muslim: "shae-muslim",
    life: "shae-life",
    profesional: "shae-professional",
  }
  const apiCategory = categoryMap[category] ?? category

  useEffect(() => {
    async function fetchBanners() {
      try {
        setLoading(true)
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/public/banners/${apiCategory}`
        )
        const json = await res.json()

        if (Array.isArray(json)) {
          setBanners(json)
        } else if (Array.isArray(json.data)) {
          setBanners(json.data)
        } else {
          setBanners([])
        }
        setActiveIndex(0)
      } catch (err) {
        console.error("Gagal fetch banners:", err)
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [apiCategory])

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [banners])

  if (loading || banners.length === 0) return null

  return (
    <section className="relative bg-white mb-6">
      <div className="container mx-auto">
        <div className="relative w-full overflow-hidden rounded-2xl aspect-[3780/1323]">
          <div
            className="flex h-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="w-full shrink-0 h-full">
                <img
                  src={banner.image}
                  alt={`Banner ${banner.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === activeIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
