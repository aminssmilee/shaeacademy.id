"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function PaginationSection({ page, lastPage, onChange }) {
  if (lastPage <= 1) return null

  function getPages() {
    const pages = []

    if (page > 2) pages.push(1)
    if (page > 3) pages.push("...")

    for (let p = page - 1; p <= page + 1; p++) {
      if (p > 0 && p <= lastPage) pages.push(p)
    }

    if (page < lastPage - 2) pages.push("...")
    if (page < lastPage - 1) pages.push(lastPage)

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {/* PREVIOUS */}
      <Button
        variant="ghost"
        size="sm"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {/* PAGES */}
      {getPages().map((item, i) =>
        item === "..." ? (
          <span key={i} className="px-2 text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <Button
            key={item}
            size="sm"
            variant={item === page ? "outline" : "ghost"}
            className={
              item === page ? "pointer-events-none border-primary font-medium" : ""
            }
            onClick={() => onChange(item)}
          >
            {item}
          </Button>
        )
      )}

      {/* NEXT */}
      <Button
        variant="ghost"
        size="sm"
        disabled={page === lastPage}
        onClick={() => onChange(page + 1)}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
