import Navbar from "../components/layout/navbar"
import HeroBanner from "../components/home/hero-banner"
import BenefitsSection from "../components/home/BenefitsSection"
import CategorySection from "../components/home/category-section"
import Footer from "../components/layout/footer"

export default function HomePage() {
    return (
        <div className="">
            <Navbar />
            <HeroBanner />
            <BenefitsSection />
            <CategorySection />
            <Footer />
        </div>
    )
}

