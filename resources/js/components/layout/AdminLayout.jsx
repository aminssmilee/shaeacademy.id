import React from "react"
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

import { Home, Image, BookOpen, LogOut } from "lucide-react"
import { NavUser } from "@/components/nav-user"
import logo from "/public/img/academy.png" // ganti sesuai path gambar

export default function AdminLayout({ user }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    navigate("/admin/login")
  }

  // Data sidebar
  const data = {
    user: {
      name: user?.name || "Salis Ahmad",
      email: user?.email || "salis@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-4 border-b">
              <img
                src={logo}
                alt="SHAE Logo"
                className="h-10 w-full object-contain rounded"
              />
            </div>

            {/* Navigation */}
            <SidebarContent className="flex-1 py-5 px-2 ">
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

            {/* User Info */}
            <SidebarFooter>
              <NavUser user={data.user} onLogout={handleLogout} />
            </SidebarFooter>
          </div>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-14 items-center gap-4 border-b bg-white px-6">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6 bg-gray-50">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
