import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")

    if (!token) {
      navigate("/admin/login")
      return
    }

    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (!res.ok) throw new Error("Unauthorized")
        return res.json()
      }),
      fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats")
        return res.json()
      })
    ])
      .then(([adminData, statsData]) => {
        setAdmin(adminData)
        setStats(statsData)
      })
      .catch((err) => {
        console.error(err)
        if (err.message === "Unauthorized") {
          localStorage.removeItem("admin_token")
          navigate("/admin/login")
        }
      })
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return (
      <div className="space-y-6">
        {/* HEADER SKELETON */}
        <div>
          <div className="h-8 w-64 rounded-md bg-gray-200 animate-pulse mb-2"></div>
          <div className="h-4 w-48 rounded-md bg-gray-200 animate-pulse"></div>
        </div>

        {/* STATS SKELETON */}
        <div className="h-6 w-32 rounded-md bg-gray-200 animate-pulse mt-8"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-4 shadow-sm animate-pulse">
              <div className="h-4 w-24 rounded bg-gray-200 mb-2"></div>
              <div className="h-6 w-16 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>

        {/* ADMIN INFO SKELETON */}
        <div className="h-6 w-32 rounded-md bg-gray-200 animate-pulse mt-8"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-4 shadow-sm animate-pulse">
              <div className="h-4 w-24 rounded bg-gray-200 mb-2"></div>
              <div className="h-6 w-40 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Selamat datang kembali 👋, {admin?.name}
        </p>
      </div>

      {/* DASHBOARD STATS CARD */}
      <h2 className="text-lg font-semibold mt-8">Statistik</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Kelas" value={stats?.totalClasses ?? 0} />
        <Card title="Kelas Aktif" value={stats?.activeClasses ?? 0} />
        <Card title="Total Banner" value={stats?.activeBanners ?? 0} />
        <Card title="Update Terakhir" value={stats?.lastUpdate ? new Date(stats.lastUpdate).toLocaleDateString("id-ID") : "-"} />
      </div>

      {/* ADMIN INFO CARD */}
      <h2 className="text-lg font-semibold mt-8">Profil Admin</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Nama Admin" value={admin?.name} />
        <Card title="Email" value={admin?.email} />
        <Card title="Role" value={admin?.role ?? "Admin"} />
      </div>

      {/* ACTION */}
      <div>
        <button
          onClick={() => {
            localStorage.removeItem("admin_token")
            navigate("/admin/login")
          }}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

/* ========================= */
/* CARD COMPONENT */
/* ========================= */
function Card({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  )
}
