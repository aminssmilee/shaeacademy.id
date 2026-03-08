import { Instagram, MessageCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

import shaeAcademy from "/public/img/shaeacademy.webp"
import shaeMuslim from "/public/img/ShaeMuslim.webp"
import shaeLife from "/public/img/ShaeLife.webp"
import shaeProfesional from "/public/img/ShaeProfesional.png"

const footerMap = [
    {
        match: "/shaemuslim",
        bgColor: "#eec527",
        text: "text-yellow-900",
        muted: "text-yellow-800",
        logo: shaeMuslim,
        title: "Shae Muslim",
        description:
            "Platform belajar Islam dari dasar sesuai Al-Qur’an dan Sunnah",
        instagram: "https://www.instagram.com/shaemuslim_id/",
        whatsapp: "https://wa.me/6285168603299",
    },
    {
        match: "/shaelife",
        bgColor: "#cb8230",
        text: "text-orange-50",
        muted: "text-orange-100",
        logo: shaeLife,
        title: "Shae Life",
        description:
            "Platform belajar ilmu kehidupan di setiap tahapan sesuai nilai Islam",
        instagram: "https://www.instagram.com/shaelife_id/",
        whatsapp: "https://wa.me/6285168603299",
    },
    {
        match: "/shaeprofesional",
        bgColor: "#667d4e",
        text: "text-green-50",
        muted: "text-green-100",
        logo: shaeProfesional,
        title: "Shae Profesional",
        description:
            "Platform belajar dunia kerja dalam berbagai bidang sesuai prinsip syariah",
        instagram: "https://www.instagram.com/shaeprofesional_id/",
        whatsapp: "https://wa.me/6285168603299",
    },
    {
        match: "/shaetalk",
        bgColor: "",
        text: "",
        muted: "",
        logo: "Coming Soon",
        title: "",
        description:
            "",
        instagram: "",
        whatsapp: "",
    },
];


export default function Footer() {
    const pathname = window.location.pathname

    const current =
        footerMap.find((item) => pathname.startsWith(item.match)) || {
            bgColor: "#c62527",
            text: "text-red-50",
            muted: "text-red-100",
            logo: shaeAcademy,
            title: "Shae Academy",
            tagline: "Shalih, Tentram, Penuh Manfaat",
            description:
                "Platform pengembangan kualitas pemuda muslim secara holistik",
            instagram: "https://www.instagram.com/shaeacademy/",
            whatsapp: "https://wa.me/6285168603299",
        };

    return (
        <footer
            style={{ backgroundColor: current.bgColor }}
            className={current.text}
        >
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* TOP */}
                <div className="grid gap-12 md:grid-cols-5 items-start">
                    {/* BRAND */}
                    <div className="md:col-span-3 space-y-5">
                        <div className="w-[220px] h-[64px] flex items-center">
                            <img
                                src={current.logo}
                                alt={current.title}
                                className="h-full w-auto object-contain"
                                loading="lazy"
                                width="220"
                                height="64"
                                decoding="async"
                            />
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-semibold tracking-wide">
                                {current.tagline}
                            </p>
                            <p
                                className={`max-w-md text-sm leading-relaxed ${current.muted}`}
                            >
                                {current.description}
                            </p>
                        </div>
                    </div>

                    {/* CONTACT */}
                    <div className="md:col-span-2 space-y-5 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wide">
                            Ada Pertanyaan?
                        </p>

                        <p className={`text-sm ${current.muted}`}>Hubungi Shamin :</p>

                        <div className="flex flex-wrap gap-3 justify-center">
                            <Button
                                asChild
                                size="sm"
                                className="bg-white text-black hover:bg-white/90 flex items-center gap-2"
                            >
                                <a href={current.whatsapp} target="_blank" rel="noopener">
                                    <MessageCircle className="h-4 w-4" />
                                    WhatsApp
                                </a>
                            </Button>

                            <Button
                                asChild
                                size="sm"
                                className="bg-white text-black hover:bg-white/90 flex items-center gap-2"
                            >
                                <a href={current.instagram} target="_blank" rel="noopener">
                                    <Instagram className="h-4 w-4" />
                                    Instagram
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* DIVIDER */}
                <Separator className="my-12 bg-white/30" />

                {/* BOTTOM */}
                <div className={`text-center text-sm ${current.muted}`}>
                    © {new Date().getFullYear()}{" "}
                    <span className="font-medium">shaeacademy</span>. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
