"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function FilterSkeleton() {
  return (
    <div className="space-y-4">
      {/* ===== MOBILE ===== */}
      <div className="flex items-center gap-2 md:hidden">
        {/* search */}
        <Skeleton className="h-10 flex-1 rounded-lg" />
        {/* filter button */}
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden md:flex md:items-center md:justify-between gap-4">
        {/* search */}
        <Skeleton className="h-10 w-full max-w-sm rounded-lg" />

        <div className="flex items-center gap-4">
          {/* tabs */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>

          {/* sort */}
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
