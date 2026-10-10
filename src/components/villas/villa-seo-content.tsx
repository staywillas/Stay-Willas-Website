import Link from "next/link";

const facts: Record<string, { title: string; description: string; planning: string; href: string }> = {
  "the-angle-house": { title: "Plan your stay at The Angle House in Kamshet, Lonavala", description: "The Angle House is a 3 BHK villa with a private waterfall pool and a Jacuzzi, accommodating up to 12 guests. Stays start at ₹13,000 per night; dates and optional services affect the final quote.", planning: "Use the Kamshet property pin when planning Karla Caves, Ekvira Temple or other Lonavala attractions. Ask about the room allocation, pet policy, pool rules and meal charges. For celebrations, confirm visitor limits, music timings and decoration permissions before reserving.", href: "/areas/lonavala" },
  "canopy-crest": { title: "Plan a Khopoli group stay at Canopy Crest", description: "Canopy Crest is a 4 BHK private pool villa in Khopoli with a maximum capacity of 16 guests. Stays start at ₹15,000 per night. Confirm the complete accommodation and meal quote for your dates.", planning: "For an Imagicaa visit, check the route from the actual villa pin and the park’s opening schedule. Allow time for check-in, meals and rest. Confirm bed allocation, pool supervision and any celebration or offsite arrangements with the team.", href: "/areas/khopoli" },
  "willow-peak": { title: "Choose one Willow Peak cottage or the full estate", description: "Willow Peak in Kurwande, Lonavala has three A-frame cottages with private Jacuzzis. Each accommodates up to four guests. Base rates start at ₹4,999 per night per cottage; the full three-cottage estate for up to 12 guests requires a separate quote.", planning: "Compare Breeze, Crest and Heaven before choosing your cottage. Confirm the specific room and view, shared outdoor areas, meal options and any decoration charges. Review the final rate for your dates before payment.", href: "/areas/lonavala" },
};

export default function VillaSEOContent({ slug }: { slug: string }) {
  const fact = facts[slug.startsWith("willow-peak") ? "willow-peak" : slug];
  if (!fact) return null;
  return <section className="mt-12 border-t border-slate-200 py-10 text-slate-600 leading-relaxed">
    <h2 className="text-2xl font-heading font-bold text-[#1B3564] mb-4">{fact.title}</h2>
    <p className="mb-4">{fact.description}</p><p className="mb-4">{fact.planning}</p>
    <Link href={fact.href} className="font-semibold text-[#1B3564] underline underline-offset-4">Compare stays in this destination</Link>
  </section>;
}
