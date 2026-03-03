import React from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ComingSoon() {
    return (
        <>
            <Navbar />

            <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-gray-50">
                <div className="max-w-md space-y-6">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                        Coming Soon!
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Akan Segera Hadir!
                    </p>

                    <div className="pt-4">
                        <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-6 text-base font-medium transition-transform hover:scale-105 active:scale-95">
                            <Link to="/" className="flex items-center gap-2">
                                <ArrowLeft className="w-5 h-5" />
                                Kembali ke Beranda
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
