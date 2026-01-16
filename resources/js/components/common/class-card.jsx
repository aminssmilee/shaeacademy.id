"use client"

import { useState } from "react"
import ImageSkeleton from "./skeleton/ImageSkeleton"

export default function ClassCard({
  title,
  price,
  category,
  poster,
  external_link,
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <a
      href={external_link}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-xl border bg-white transition hover:shadow"
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {!loaded && <ImageSkeleton />}

        <img
          src={poster}
          alt={title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`
            absolute inset-0 h-full w-full object-contain
            transition-all duration-500
            ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"}
          `}
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-1">
        <h3 className="line-clamp-2 text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{category}</p>
        <p className="text-sm font-bold">
          Rp {price.toLocaleString("id-ID")}
        </p>
      </div>
    </a>
  )
}
