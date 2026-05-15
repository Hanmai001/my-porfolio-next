"use client";

export function WorkScreenSkeleton() {
  return (
    <div aria-hidden className="flex h-full flex-col gap-3 p-5">
      {/* Fake nav bar */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 rounded bg-white/10" />
        <div className="h-2 flex-1 rounded bg-white/5" />
        <div className="h-2 w-8 rounded bg-white/10" />
      </div>
      {/* Fake content rows */}
      <div className="mt-2 flex flex-col gap-2">
        <div className="h-6 w-40 rounded bg-white/8" />
        <div className="h-2 w-full rounded bg-white/5" />
        <div className="h-2 w-4/5 rounded bg-white/5" />
      </div>
      {/* Fake table/grid */}
      <div className="mt-1 grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 rounded bg-white/5" />
        ))}
      </div>
      {/* Fake status row */}
      <div className="mt-auto flex items-center gap-2">
        <div className="size-2 rounded-full bg-white/20" />
        <div className="h-2 w-20 rounded bg-white/8" />
      </div>
    </div>
  );
}
