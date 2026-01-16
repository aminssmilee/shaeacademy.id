"use client"

import { useEffect, useState } from "react"
import axios from "axios"

import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalBanners: 0,
    chartData: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Ambil data dashboard dari API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("admin_token")
        const res = await axios.get("http://localhost:8000/api/admin/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setStats({
          totalClasses: res.data.totalClasses,
          totalBanners: res.data.activeBanners,
          chartData: res.data.chartData,
        })
      } catch (err) {
        console.error("Gagal fetch dashboard:", err)
        setError("Gagal load data")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <p className="p-4">Loading dashboard...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* ------------------ Stats Cards ------------------ */}
      <SectionCards
        totalClasses={stats.totalClasses}
        totalBanners={stats.totalBanners}
      />

      {/* ------------------ Chart Area ------------------ */}
      <ChartAreaInteractive chartData={stats.chartData} />

      {/* ------------------ Data Table (opsional) ------------------ */}
      {/* <DataTable
        title="Recent Items"
        columns={[
          { header: "ID", accessor: "id" },
          { header: "Name", accessor: "name" },
          { header: "Type", accessor: "type" },
          { header: "Created At", accessor: "created_at" },
        ]}
        fetchUrl="http://localhost:8000/api/admin/classes"
        authToken={localStorage.getItem("admin_token")}
      /> */}
    </div>
  )
}
