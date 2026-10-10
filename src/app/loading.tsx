export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="min-h-[40vh] flex items-center justify-center gap-3 bg-bg-primary px-6 py-16 text-[#1B3564]">
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#DAA520]" />
      <p className="text-sm font-medium">Loading your Stay Willas page…</p>
    </div>
  );
}
