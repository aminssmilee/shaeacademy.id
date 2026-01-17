type GridSkeletonProps = {
  count?: number
}

export default function GridSkeleton({ count = 9 }: GridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-[320px] rounded-2xl border bg-muted animate-pulse overflow-hidden"
        >
          <div className="h-[65%] bg-muted-foreground/10" />
          <div className="space-y-3 p-4">
            {/* <div className="h-4 w-3/4 rounded bg-muted-foreground/10" /> */}
            {/* <div className="h-4 w-3/4 rounded bg-muted-foreground/10" /> */}
            <div className="h-4 w-3/4 rounded bg-muted-foreground/10" />
            <div className="h-4 w-1/2 rounded bg-muted-foreground/10" />
            <div className="mt-6 h-5 w-1/3 rounded bg-muted-foreground/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
