import React from "react";

import saemuslim from "/public/banner/muslim.webp";
import saelife from "/public/banner/life.webp";
import saeprofessional from "/public/banner/kreasi.webp";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Jika pakai React Router
// import { Link } from "react-router-dom";

const categories = [
  {
    key: "shaemuslim",
    title: "Shae Muslim",
    description: "Belajar Islam dari dasar sesuai Al-Qur’an dan Sunnah",
    image: saemuslim,
    cta: "Upgrade Kualitas Ibadahmu Sekarang",
    accent: "from-[#eec527]/25",
    button: "bg-[#eec527] hover:bg-[#d6b320]",
  },
  {
    key: "shaelife",
    title: "Shae Life",
    description: "Belajar ilmu kehidupan di setiap tahapan sesuai nilai Islam",
    image: saelife,
    cta: "Upgrade Kualitas Kehidupanmu Sekarang",
    accent: "from-[#cb8230]/25",
    button: "bg-[#cb8230] hover:bg-[#b8742b]",
  },
  {
    key: "shaeprofesional",
    title: "Shae Profesional",
    description: "Belajar dunia kerja dalam berbagai bidang sesuai prinsip syariah",
    image: saeprofessional,
    cta: "Upgrade Kualitas Pekerjaanmu Sekarang",
    accent: "from-[#667d4e]/25",
    button: "bg-[#667d4e] hover:bg-[#5a6f45]",
  },
  // {
  //   key: "shaetalk",
  //   title: "Shae Talk",
  //   description: "Belajar inspirasi skill dan usaha secara kreatif sesuai prinsip kebermanfaatan",
  //   image: saeprofessional,
  //   cta: "Upgrade Kualitas Pekerjaanmu Sekarang",
  //   accent: "from-[#667d4e]/25",
  //   button: "bg-[#667d4e] hover:bg-[#5a6f45]",
  // },
];

export default function CategorySection() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 pb-16">
        {/* HEADING */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            Pilih Jalur Pengembanganmu
          </h2>
        </div>

        {/* CARDS */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {categories.map((item) => (
            <Card
              key={item.key}
              className="group overflow-hidden rounded-2xl border
              transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* IMAGE */}
              <div className="relative w-full h-32 sm:h-36 md:h-40 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="160"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${item.accent} to-transparent`}
                />
              </div>

              {/* CONTENT */}
              <CardContent className="space-y-2 px-6 pt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>

              {/* CTA */}
              <CardFooter className="px-6 pb-6">
                {/* Ganti Link Next.js dengan <a> biasa */}
                <Button asChild className={`w-full text-white ${item.button}`}>
                  <a href={`/${item.key}`}>{item.cta}</a>
                  {/* Jika pakai React Router:
                    <Link to={`/${item.key}/`}>{item.cta}</Link>
                  */}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
