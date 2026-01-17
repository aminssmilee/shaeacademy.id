import React from "react";

// Jika pakai Vite, import gambar langsung
import banner from "/public/img/5.png";

export default function HeroBanner() {
  return (
    <section className="relative bg-white">
      <div className="container mx-auto">
        {/* BANNER */}
        <div className="relative w-full overflow-hidden rounded-2xl aspect-[3780/1323]">
          <img
            src={banner}
            alt="Shae Academy Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* SOFT GRADIENT */}
      {/* <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-b from-transparent to-red-50" /> */}
    </section>
  );
}
