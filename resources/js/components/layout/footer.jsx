import { Instagram, MessageCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

import shaeAcademy from "/public/img/academy.png";
import shaeMuslim from "/public/img/muslim.png";
import shaeLife from "/public/img/life.png";
import shaeProfessional from "/public/img/profesionall.png";

const footerMap = [
    {
        match: "/shaemuslim",
        bgColor: "#eec527",
        text: "text-yellow-900",
        muted: "text-yellow-800",
        logo: shaeMuslim,
        title: "Shae Muslim",
        description:
            "Platform non-profit pembelajaran Islam dari dasar sesuai Al-Qur’an dan Sunnah",
        instagram: "https://www.instagram.com/shaemuslim_id/",
        whatsapp: "https://wa.me/6285175325622",
    },
    {
        match: "/shaelife",
        bgColor: "#cb8230",
        text: "text-orange-50",
        muted: "text-orange-100",
        logo: shaeLife,
        title: "Shae Life",
        description:
            "Platform non-profit pembelajaran ilmu kehidupan di setiap tahapan sesuai nilai Islam",
        instagram: "https://www.instagram.com/shaelife_id/",
        whatsapp: "https://wa.me/6285175325622",
    },
    {
        match: "/shaeprofesional",
        bgColor: "#667d4e",
        text: "text-green-50",
        muted: "text-green-100",
        logo: shaeProfessional,
        title: "Shae Professional",
        description:
            "Platform non-profit pembelajaran skill kerja secara profesional sesuai syariat",
        instagram: "https://www.instagram.com/shaeprofesional_id/",
        whatsapp: "https://wa.me/6285175325622",
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
                "Platform non-profit pengembangan kualitas pemuda muslim secara holistik",
            instagram: "https://www.instagram.com/shaeacademy/",
            whatsapp: "https://wa.me/6285175325622",
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
                        <div className="w-[220px]">
                            <img
                                src={current.logo}
                                alt={current.title}
                                className="w-full h-auto object-contain"
                                loading="lazy"
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
