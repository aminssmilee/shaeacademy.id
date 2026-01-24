import { useEffect } from "react"

export default function useFavicon(category = "") {
  const configMap = {
    muslim: {
      icon: "/favicon/logo sm bunder.png",
      themeColor: "#eec527", // Kuning Shae Muslim
    },
    life: {
      icon: "/favicon/logo sl bunder.png",
      themeColor: "#cb8230", // Orange Shae Life
    },
    kreasi: {
      icon: "/favicon/Logo Mockup SP.png",
      themeColor: "#667d4e", // Hijau Shae Kreasi
    },
    default: {
      icon: "/favicon/Logo sq shae 2026.png",
      themeColor: "#ffffff", // Putih Standard
    },
  }

  useEffect(() => {
    const config = configMap[category] || configMap.default

    // 1. Update Standard Favicon (Desktop/Tab)
    const linkIcon =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link")
    linkIcon.rel = "icon"
    linkIcon.href = config.icon
    document.head.appendChild(linkIcon)

    // 2. Update Apple Touch Icon (iOS Home Screen)
    const linkApple =
      document.querySelector("link[rel='apple-touch-icon']") ||
      document.createElement("link")
    linkApple.rel = "apple-touch-icon"
    linkApple.href = config.icon // Sebaiknya pakai versi resolusi tinggi jika ada
    document.head.appendChild(linkApple)

    // 3. Update Theme Color (Mobile Browser Bar Color)
    const metaTheme =
      document.querySelector("meta[name='theme-color']") ||
      document.createElement("meta")
    metaTheme.name = "theme-color"
    metaTheme.content = config.themeColor
    document.head.appendChild(metaTheme)

  }, [category])
}
