"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function HeroBannerSkeleton() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container mx-auto grid min-h-[55vh] items-center gap-12 px-6 py-16 md:grid-cols-2">
        
        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-2/3" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-5/6 max-w-md" />
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center">
          <Skeleton className="h-[320px] w-[320px] rounded-xl" />

          {/* floating accents (placeholder) */}
          <Skeleton className="absolute -left-6 top-20 h-12 w-12 rounded-xl" />
          <Skeleton className="absolute right-4 bottom-16 h-12 w-12 rounded-xl" />
          <Skeleton className="absolute right-20 top-10 h-12 w-12 rounded-xl" />
        </div>
      </div>

      {/* gradient bawah tetap ada */}
    </section>
  )
}
