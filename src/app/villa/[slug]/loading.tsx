export default function VillaDetailLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading villa details"
      className="min-h-screen bg-[#f5f2ea] text-[#1b3564]"
    >
      <p role="status" className="sr-only">
        Loading villa details…
      </p>

      <div className="mx-auto w-[88%] max-w-[1200px] pt-28 md:pt-32">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-4 w-32 rounded-full bg-[#dedacf] motion-safe:animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-20 rounded-full bg-[#dedacf] motion-safe:animate-pulse" />
            <div className="h-10 w-20 rounded-full bg-[#dedacf] motion-safe:animate-pulse" />
          </div>
        </div>

        <div className="mb-7 grid gap-5 md:grid-cols-[1fr_290px] md:items-end">
          <div className="space-y-4">
            <div className="h-3 w-52 rounded-full bg-[#dedacf] motion-safe:animate-pulse" />
            <div className="h-14 w-3/4 max-w-xl rounded-xl bg-[#dedacf] motion-safe:animate-pulse" />
            <div className="h-4 w-56 rounded-full bg-[#dedacf] motion-safe:animate-pulse" />
          </div>
          <div className="hidden space-y-3 md:block">
            <div className="h-4 w-full rounded-full bg-[#dedacf] motion-safe:animate-pulse" />
            <div className="h-4 w-4/5 rounded-full bg-[#dedacf] motion-safe:animate-pulse" />
          </div>
        </div>

        <div className="grid gap-2 overflow-hidden rounded-2xl md:h-[430px] md:grid-cols-[1.85fr_1fr] md:grid-rows-2">
          <div className="aspect-[1.2] bg-[#e6e0d4] motion-safe:animate-pulse md:row-span-2 md:aspect-auto" />
          <div className="hidden bg-[#e6e0d4] motion-safe:animate-pulse md:block" />
          <div className="hidden bg-[#e6e0d4] motion-safe:animate-pulse md:block" />
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 border-b border-[#dedacf] py-6 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-28 rounded-full bg-[#dedacf] motion-safe:animate-pulse" />
              <div className="h-3 w-20 rounded-full bg-[#dedacf] motion-safe:animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
