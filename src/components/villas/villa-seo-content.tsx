import Link from "next/link";

const facts: Record<string, { title: string; description: string; planning: string; href: string; linkText: string }> = {
  "the-angle-house": {
    title: "Plan your stay at The Angle House in Kamshet, Lonavala",
    description: "The Angle House is a 3 BHK luxury villa with a private waterfall pool and a Jacuzzi, accommodating up to 12 guests. Stays start at ₹13,000 per night; dates and optional services affect the final quote.",
    planning: "Use the Kamshet property pin when planning Karla Caves, Ekvira Temple or other Lonavala attractions. Ask about the room allocation, pet policy, pool rules and meal charges. For celebrations, confirm visitor limits, music timings and decoration permissions before reserving.",
    href: "/areas/lonavala",
    linkText: "Explore all Luxury Villas in Lonavala with Private Pool →",
  },
  "canopy-crest": {
    title: "Plan a Khopoli group stay at Canopy Crest",
    description: "Canopy Crest is a 4 BHK luxury private pool villa in Khopoli with a maximum capacity of 16 guests. Stays start at ₹15,000 per night. Confirm the complete accommodation and meal quote for your dates.",
    planning: "For an Imagicaa visit, check the route from the actual villa pin and the park’s opening schedule. Allow time for check-in, meals and rest. Confirm bed allocation, pool supervision and any celebration or offsite arrangements with the team.",
    href: "/areas/khopoli",
    linkText: "Explore all Luxury Villas in Khopoli with Private Pool →",
  },
  "willow-peak": {
    title: "Choose one Willow Peak cottage or all three together",
    description: "Willow Peak in Kurwande, Lonavala has three A-frame cottages with private Jacuzzis. Each accommodates up to four guests. Base rates start at ₹4,999 per night per cottage; booking all three cottages for up to 12 guests requires a separate quote.",
    planning: "Compare Breeze, Crest and Heaven before choosing your cottage. Confirm the specific room and view, shared outdoor areas, meal options and any decoration charges. Review the final rate for your dates before payment.",
    href: "/areas/lonavala",
    linkText: "Explore all Luxury Villas in Lonavala with Private Pool →",
  },
  "casa-de-reva": {
    title: "Plan your hillside getaway at Casa De Reva, Panchgani",
    description: "Casa De Reva is a 4 BHK private pool villa in Kaswand, Panchgani with hillside valley views and manicured lawns, accommodating up to 14 guests.",
    planning: "Compare bedroom allocations, local sightseeing to Table Land and Mapro Garden, and customized chef meal packages for your family holiday.",
    href: "/areas/panchgani",
    linkText: "Explore all Luxury Villas in Panchgani with Private Pool →",
  },
};

export default function VillaSEOContent({ slug }: { slug: string }) {
  const fact = facts[slug.startsWith("willow-peak") ? "willow-peak" : slug];
  if (!fact) return null;
  return (
    <section className="mt-12 border-t border-slate-200 py-10 text-slate-600 leading-relaxed text-left">
      <h2 className="text-2xl font-heading font-bold text-[#1B3564] mb-4">{fact.title}</h2>
      <p className="mb-4">{fact.description}</p>
      <p className="mb-4">{fact.planning}</p>
      <div className="flex flex-wrap items-center gap-4 mt-4">
        <Link href={fact.href} className="font-bold text-[#1B3564] hover:text-[#DAA520] underline underline-offset-4 transition-colors">
          {fact.linkText}
        </Link>
      </div>
    </section>
  );
}
