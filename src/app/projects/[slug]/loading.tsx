export default function ProjectLoading() {
  return (
    <main className="min-h-screen bg-[#030303] px-4 py-8">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-10 w-36 rounded-full bg-white/6" />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="space-y-5">
            <div className="h-7 w-48 rounded-full bg-white/6" />
            <div className="h-18 w-full max-w-2xl rounded-2xl bg-white/8" />
            <div className="h-24 w-full max-w-xl rounded-2xl bg-white/6" />
          </div>
          <div className="h-96 rounded-[1.75rem] bg-white/6" />
        </div>
      </div>
    </main>
  );
}
