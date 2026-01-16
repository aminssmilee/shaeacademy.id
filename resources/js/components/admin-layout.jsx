import React, { useEffect, useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar"

import { Home, Image, BookOpen } from "lucide-react"
import { NavUser } from "@/components/nav-user"
import api from "@/lib/api"
import logo from "/public/img/academy.png"

export default function AdminLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    api
      .get("/api/admin/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("admin_token")
        navigate("/admin/login")
      })
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    try {
      await api.post("/api/admin/logout")
    } catch (_) {}
    localStorage.removeItem("admin_token")
    navigate("/admin/login")
  }

  if (loading) {
    return <p className="p-6">Checking session...</p>
  }

  /* ================= SIDEBAR DATA ================= */
  const data = {
    user: {
      name: user?.name,
      email: user?.email,
      avatar: "/avatars/shadcn.jpg",
    },
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-6 py-4 border-b">
              <img src={logo} className="h-10 w-full object-contain" />
            </div>

            <SidebarContent className="flex-1 py-5 px-2">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    <SidebarMenuItem>
                      <NavLink to="/admin" end>
                        {({ isActive }) => (
                          <SidebarMenuButton isActive={isActive}>
                            <Home className="h-4 w-4" />
                            <span>Dashboard</span>
                          </SidebarMenuButton>
                        )}
                      </NavLink>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <NavLink to="/admin/banners">
                        {({ isActive }) => (
                          <SidebarMenuButton isActive={isActive}>
                            <Image className="h-4 w-4" />
                            <span>Banner</span>
                          </SidebarMenuButton>
                        )}
                      </NavLink>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <NavLink to="/admin/classes">
                        {({ isActive }) => (
                          <SidebarMenuButton isActive={isActive}>
                            <BookOpen className="h-4 w-4" />
                            <span>Kelas</span>
                          </SidebarMenuButton>
                        )}
                      </NavLink>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <NavUser user={data.user} onLogout={handleLogout} />
            </SidebarFooter>
          </div>
        </Sidebar>

        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b px-6">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-gray-50">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
