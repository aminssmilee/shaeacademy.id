import HeroBannerSkeleton from "./hero-banner-skeleton"
import FilterBarSkeleton from "./filter-skeleton"
import ClassCardSkeleton from "./card-skeleton"

export default function CategoryPageSkeleton() {
  return (
    <>
      <HeroBannerSkeleton />

      <main className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
        <FilterBarSkeleton />
        <ClassCardSkeleton count={9} />
      </main>
    </>
  )
}
