import "../css/app.css"
import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner" // <-- import Sonner

import HomePage from "./pages/Home"
import CategoryPage from "./pages/CategoryPage"
import AdminLogin from "./pages/admin/login"
import AdminOTPPage from "./pages/admin/otp"
import AdminLayout from "./components/layout/AdminLayout"
import AdminBanners from "./pages/admin/banners"
import AdminClasses from "./pages/admin/classes"
import AdminProtectedRoute from "./routes/AdminProtectedRoute"
// import AdminDashboard from "./components/layout/AdminLayout" // konten dashboard
import AdminDashboard from "./pages/dashboard" // konten dashboard
import AdminBannerCreate from "./pages/admin/AdminBannerCreate"
import AdminBannerEdit from "./pages/admin/AdminBannerEdit"
import AdminClassEdit from "./pages/admin/AdminClassEdit"
import AdminClassCreate from "./pages/admin/AdminClassCreate"

const root = document.getElementById("root")

createRoot(root).render(
  <React.StrictMode>
    {/* ================= SONNER TOASTER ================= */}
    <Toaster richColors position="top-center" />

    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shaemuslim" element={<CategoryPage category="muslim" />} />
        <Route path="/shaelife" element={<CategoryPage category="life" />} />
        <Route path="/shaeprofesional" element={<CategoryPage category="profesional" />} />

        {/* ================= ADMIN AUTH ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/otp" element={<AdminOTPPage />} />

        {/* ================= ADMIN PROTECTED ================= */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminLayout user={{ name: "Salis Ahmad", email: "salis@example.com" }} />
            </AdminProtectedRoute>
          }
        >
          {/* Nested Routes */}
          <Route index element={<AdminDashboard />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="banners/create" element={<AdminBannerCreate />} />
          <Route path="banners/edit" element={<AdminBannerEdit />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="classes/create" element={<AdminClassCreate />} />
          <Route path="classes/edit/:id" element={<AdminClassEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
