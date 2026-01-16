import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import b1 from "/public/benefit/b1.jpeg"
import b2 from "/public/benefit/b3.jpeg"
import b3 from "/public/benefit/b4.jpeg"
import b4 from "/public/benefit/b2.webp"
import b5 from "/public/benefit/br.jpeg"

export default function BenefitsSection() {
  const benefits = [
    { icon: b1, title: "Berbasis nilai islam, sains, dan best practice" },
    { icon: b2, title: "Dibimbing pengajar profesional lintas bidang" },
    { icon: b3, title: "Fokus pada pemahaman dan tindakan nyata" },
    { icon: b4, title: "Fasilitas belajar lengkap, suportif, dan terstruktur" },
    { icon: b5, title: "Akses selamanya, kapan saja, dimana saja" },
  ]

  return (
    <section className="bg-white rounded-b-2xl pt-1">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 pb-6 sm:py-10">
        <div className="grid grid-cols-5 gap-1 sm:gap-4">
          {benefits.map((item) => (
            <Popover key={item.title}>
              <PopoverTrigger asChild>
                <div
                  className="
                    flex flex-col items-center
                    gap-1 sm:gap-2
                    rounded-xl
                    py-2 sm:py-4
                    transition
                    hover:bg-gray-50
                    cursor-pointer
                  "
                >
                  {/* ICON BULAT */}
                  <div
                    className="
    flex items-center justify-center
    h-10 w-10 sm:h-14 sm:w-14
    rounded-full
    bg-white
    ring-1 ring-primary/20
    overflow-hidden
  "
                  >
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-3/4 h-3/4 object-contain rounded-full"
                      loading="lazy"
                    />
                  </div>


                  {/* TEXT */}
                  <span
                    className="
                      text-[9px] sm:text-xs
                      font-medium
                      text-gray-800
                      text-center
                      leading-tight
                      line-clamp-2
                    "
                  >
                    {item.title}
                  </span>
                </div>
              </PopoverTrigger>

              {/* POPOVER MOBILE */}
              <PopoverContent
                side="top"
                align="center"
                className="sm:hidden w-44 text-[10px] text-center"
              >
                {item.title}
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
    </section>
  )
}
