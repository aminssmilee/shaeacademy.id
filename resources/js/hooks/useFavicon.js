import { useEffect } from "react"

export default function useFavicon(category = "") {
  const faviconMap = {
    muslim: "/favicon/logo sm bunder.png",
    life: "/favicon/logo sl bunder.png",
    profesional: "/favicon/Logo Mockup SP.png",
    default: "/favicon/Logo sq shae 2026.png",
  }

  useEffect(() => {
    const link =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link")

    link.rel = "icon"
    link.href = faviconMap[category] || faviconMap.default

    document.head.appendChild(link)
  }, [category])
}
