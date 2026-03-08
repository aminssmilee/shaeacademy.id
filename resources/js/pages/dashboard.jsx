"use client"

import { useEffect, useState } from "react"
import axios from "axios"

import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    totalBanners: 0,
    lastUpdate: null,
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
        if (!token) throw new Error("Token admin tidak ditemukan")

        // gunakan env variable
        const API_URL = import.meta.env.VITE_API_URL

        const res = await axios.get(`${API_URL}/api/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setStats({
          totalClasses: res.data.totalClasses,
          activeClasses: res.data.activeClasses,
          totalBanners: res.data.activeBanners,
          lastUpdate: res.data.lastUpdate,
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

  if (loading) {
    return (
      <div className="space-y-6 px-4 lg:px-6">
        {/* SKELETON CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-6 shadow-sm animate-pulse">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-4 w-4 rounded-full bg-gray-200"></div>
              </div>
              <div className="h-8 w-16 rounded bg-gray-200 mt-2"></div>
              <div className="h-3 w-32 rounded bg-gray-200 mt-2"></div>
            </div>
          ))}
        </div>

        {/* SKELETON CHART */}
        <div className="rounded-xl border bg-white shadow-sm mt-6 animate-pulse">
          <div className="p-6 pb-2">
            <div className="h-6 w-40 rounded bg-gray-200 mb-2"></div>
            <div className="h-4 w-48 rounded bg-gray-200"></div>
          </div>
          <div className="p-6 pt-4">
            <div className="h-[250px] w-full rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    )
  }
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <SectionCards
        totalClasses={stats.totalClasses}
        activeClasses={stats.activeClasses}
        totalBanners={stats.totalBanners}
        lastUpdate={stats.lastUpdate}
      />

      <ChartAreaInteractive chartData={stats.chartData} />

      {/* Uncomment kalau mau pakai DataTable */}
      {/* <DataTable
        title="Recent Items"
        columns={[
          { header: "ID", accessor: "id" },
          { header: "Name", accessor: "name" },
          { header: "Type", accessor: "type" },
          { header: "Created At", accessor: "created_at" },
        ]}
        fetchUrl={`${import.meta.env.VITE_API_URL}/admin/classes`}
        authToken={localStorage.getItem("admin_token")}
      /> */}
    </div>
  )
}
