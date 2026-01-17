import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")

    if (!token) {
      navigate("/admin/login")
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized")
        return res.json()
      })
      .then((data) => setAdmin(data))
      .catch(() => {
        localStorage.removeItem("admin_token")
        navigate("/admin/login")
      })
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">Memuat dashboard...</p>
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Selamat datang kembali 👋
        </p>
      </div>

      {/* INFO CARD */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Nama Admin" value={admin.name} />
        <Card title="Email" value={admin.email} />
        <Card title="Role" value={admin.role ?? "Admin"} />
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
