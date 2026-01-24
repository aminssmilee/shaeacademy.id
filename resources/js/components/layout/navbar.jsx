"use client"

import React, { useEffect, useState } from "react"
import { Menu, X, Home, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"

// LOGO
import shaeAcademy from "/public/img/shaeacademy.webp"
import shaeMuslim from "/public/img/ShaeMuslim.webp"
import shaeLife from "/public/img/ShaeLife.webp"
import shaeKreasi from "/public/img/ShaeKreasi.webp"

/* ================= LOGO MAP ================= */
const logoMap = [
  { match: "/shaemuslim", logo: shaeMuslim, alt: "Shae Muslim" },
  { match: "/shaelife", logo: shaeLife, alt: "Shae Life" },
  { match: "/shaekreasi", logo: shaeKreasi, alt: "Shae Kreasi" },
]

/* ================= LOGIN MAP ================= */
const loginMap = [
  { match: "/shaemuslim", url: "https://shaemuslim.myr.id/portal" },
  { match: "/shaelife", url: "https://shaelife.myr.id/portal" },
  { match: "/shaekreasi", url: "https://shaeprofesional.myr.id/portal" },
]

/* ================= MENU ================= */
const menuItems = [
  { label: "Home", href: "/" },
  { label: "Ibadah", href: "/shaemuslim" },
  { label: "Kehidupan", href: "/shaelife" },
  { label: "Pekerjaan", href: "/shaekreasi" },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  /* ===== LOGO DINAMIS ===== */
  const currentLogo =
    logoMap.find((i) => pathname.startsWith(i.match)) || {
      logo: shaeAcademy,
      alt: "Shae Academy",
    }

  /* ===== LOGIN DINAMIS ===== */
  const loginTarget = loginMap.find((i) =>
    pathname.startsWith(i.match)
  )?.url
  const showLogin = Boolean(loginTarget)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
  }, [open])

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      {/* ================= MOBILE HEADER ================= */}
      <div
        className={`md:hidden flex items-center px-4 h-16 ${showLogin ? "justify-between" : "gap-4"
          }`}
      >
        <button onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>

        <Link
          to="/"
          className="flex items-center justify-center w-[160px] h-[48px]"
        >
          <img
            src={currentLogo.logo}
            alt={currentLogo.alt}
            className="h-full w-auto object-contain"
            fetchPriority="high"
            width="160"
            height="48"
          />
        </Link>

        {showLogin && (
          <div className="flex gap-3 text-sm">
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" /> Home
            </Link>
            <a
              href={loginTarget}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <LogIn className="h-4 w-4" /> Login
            </a>
          </div>
        )}
      </div>

      {/* ================= DESKTOP HEADER ================= */}
      <div className="hidden md:flex container mx-auto h-20 items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center justify-center w-[160px] h-[48px]"
        >
          <img
            src={currentLogo.logo}
            alt={currentLogo.alt}
            className="h-full w-auto object-contain"
            fetchPriority="high"
            width="160"
            height="48"
          />
        </Link>

        <nav className="flex items-center gap-6">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm font-medium ${isActive
                  ? "underline underline-offset-4"
                  : "text-gray-700 hover:text-black"
                  }`}
              >
                {item.label}
              </Link>
            )
          })}

          {showLogin && (
            <Button asChild size="sm">
              <a
                href={loginTarget}
                target="_blank"
                rel="noopener noreferrer"
              >
                Login
              </a>
            </Button>
          )}
        </nav>
      </div>

      {/* ================= BACKDROP ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ================= DRAWER ================= */}
      <aside
        className={`fixed top-0 right-0 h-full w-[85%] bg-white md:hidden
        transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between h-16 px-4 border-b items-center">
          <div className="flex items-center justify-center w-[160px] h-[48px]">
            <img
              src={currentLogo.logo}
              alt={currentLogo.alt}
              className="h-full w-auto object-contain"
              loading="lazy"
              decoding="async"
              width="160"
              height="48"
            />
          </div>

          <button onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block px-4 py-3 rounded-lg hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </header>
  )
}
