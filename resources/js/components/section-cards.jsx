import React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Image, BookOpen } from "lucide-react"

export function SectionCards({ totalBanners = 0, totalClasses = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-0 lg:px-0">
      
      {/* Total Banner */}
      <Card>
        <CardHeader>
          <CardDescription>Total Banners</CardDescription>
          <CardTitle className="text-2xl font-semibold">{totalBanners}</CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center gap-2 text-sm">
          <Image className="h-4 w-4" />
          <span>Jumlah banner aktif</span>
        </CardFooter>
      </Card>

      {/* Total Classes */}
      <Card>
        <CardHeader>
          <CardDescription>Total Classes</CardDescription>
          <CardTitle className="text-2xl font-semibold">{totalClasses}</CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4" />
          <span>Jumlah kelas tersedia</span>
        </CardFooter>
      </Card>

    </div>
  )
}
