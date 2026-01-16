import React, { useEffect, useState } from "react";
import { Menu, X, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

// LOGO
import shaeAcademy from "/public/img/academy.png";
import shaeMuslim from "/public/img/muslim.png";
import shaeLife from "/public/img/life.png";
import shaeProfessional from "/public/img/profesionall.png";

/* ================= LOGO MAP ================= */
const logoMap = [
  { match: "/shaemuslim", logo: shaeMuslim, alt: "Shae Muslim" },
  { match: "/shaelife", logo: shaeLife, alt: "Shae Life" },
  { match: "/shaeprofesional", logo: shaeProfessional, alt: "Shae Profesional" },
];

/* ================= LOGIN MAP ================= */
const loginMap = [
  { match: "/shaemuslim", url: "https://shaemuslim.myr.id/portal" },
  { match: "/shaelife", url: "https://shaelife.myr.id/portal" },
  { match: "/shaeprofesional", url: "https://shaeprofesional.myr.id/portal" },
];

/* ================= MENU ================= */
const menuItems = [
  { label: "Home", href: "/" },
  { label: "Ibadah", href: "/shaemuslim/" },
  { label: "Kehidupan", href: "/shaelife/" },
  { label: "Pekerjaan", href: "/shaeprofesional/" },
];

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [open, setOpen] = useState(false);

  /* ===== LOGO DINAMIS ===== */
  const currentLogo =
    logoMap.find((i) => pathname.startsWith(i.match)) || {
      logo: shaeAcademy,
      alt: "Shae Academy",
    };

  /* ===== LOGIN DINAMIS ===== */
  const loginTarget = loginMap.find((i) => pathname.startsWith(i.match))?.url;
  const showLogin = Boolean(loginTarget);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      {/* ================= MOBILE ================= */}
      <div className="md:hidden flex items-center justify-between px-4 h-16">
        <button onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>

        <Link to="/" className="w-32">
          <img
            src={currentLogo.logo}
            alt={currentLogo.alt}
            className="w-full h-auto object-contain"
          />
        </Link>

        {showLogin ? (
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
        ) : (
          <div className="w-[72px]" />
        )}
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex container mx-auto h-20 items-center justify-between px-6">
        <Link to="/" className="w-[150px]">
          <img
            src={currentLogo.logo}
            alt={currentLogo.alt}
            className="w-full h-auto object-contain"
          />
        </Link>

        <nav className="flex items-center gap-6">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm font-medium ${
                  isActive
                    ? "underline underline-offset-4"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {showLogin && (
            <Button asChild size="sm">
              <a href={loginTarget} target="_blank" rel="noopener noreferrer">
                Login
              </a>
            </Button>
          )}
        </nav>
      </div>

      {/* ================= DRAWER ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-[85%] bg-white md:hidden
        transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between h-16 px-4 border-b items-center">
          <img
            src={currentLogo.logo}
            alt={currentLogo.alt}
            className="h-8 object-contain"
          />
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
  );
}
