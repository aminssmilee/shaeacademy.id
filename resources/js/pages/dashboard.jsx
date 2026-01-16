"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalBanners: 0,
    chartData: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get("/api/admin/dashboard-stats")
      .then((res) => {
        setStats({
          totalClasses: res.data.totalClasses,
          totalBanners: res.data.activeBanners,
          chartData: res.data.chartData,
        })
      })
      .catch((err) => {
        console.error("Gagal fetch dashboard:", err)
        setError("Gagal load data dashboard")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-4">Loading dashboard...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <SectionCards
        totalClasses={stats.totalClasses}
        totalBanners={stats.totalBanners}
      />

      <ChartAreaInteractive chartData={stats.chartData} />
    </div>
  )
}
