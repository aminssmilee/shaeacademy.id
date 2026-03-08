import React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Image, BookOpen, Clock } from "lucide-react"

export function SectionCards({
  totalClasses = 0,
  activeClasses = 0,
  totalBanners = 0,
  lastUpdate
}) {
  const formattedDate = lastUpdate
    ? new Date(lastUpdate).toLocaleDateString("id-ID")
    : "-"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-0 lg:px-0">

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

      {/* Active Classes */}
      <Card>
        <CardHeader>
          <CardDescription>Active Classes</CardDescription>
          <CardTitle className="text-2xl font-semibold">{activeClasses}</CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-green-500" />
          <span>Kelas yang terpublish</span>
        </CardFooter>
      </Card>

      {/* Total Banner */}
      <Card>
        <CardHeader>
          <CardDescription>Total Banners</CardDescription>
          <CardTitle className="text-2xl font-semibold">{totalBanners}</CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center gap-2 text-sm">
          <Image className="h-4 w-4 text-blue-500" />
          <span>Jumlah banner aktif</span>
        </CardFooter>
      </Card>

      {/* Last Update */}
      <Card>
        <CardHeader>
          <CardDescription>Last Update</CardDescription>
          <CardTitle className="text-xl font-semibold">{formattedDate}</CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-orange-500" />
          <span>Pembaruan terakhir</span>
        </CardFooter>
      </Card>

    </div>
  )
}
