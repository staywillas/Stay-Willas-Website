import Image from "next/image";
import Link from "next/link";
import GuideLinks from "@/components/blog/guide-links";

const stays = [
  { name: "The Angle House", location: "Kamshet, Lonavala", href: "/villa/the-angle-house", region: "/areas/lonavala", image: "/assets/villas/the-angle-house/gallery-11.webp", detail: "A 3 BHK private pool villa with a Jacuzzi for up to 12 guests. Stays start at ₹13,000 per night." },
  { name: "Canopy Crest", location: "Khopoli", href: "/villa/canopy-crest", region: "/areas/khopoli", image: "/assets/villas/canopy-crest/IMG-20260607-WA0007.jpg", detail: "A 4 BHK private pool villa for a maximum of 16 guests. Stays start at ₹15,000 per night. Check the property pin when planning an Imagicaa visit." },
  { name: "Willow Peak", location: "Kurwande, Lonavala", href: "/villa/willow-peak", region: "/areas/lonavala", image: "/assets/villas/willow-peak/gallery-1.webp", detail: "Three A-frame cottages with private Jacuzzis, each for up to four guests. Base rates start at ₹4,999 per night per cottage; ask for a separate quote to book the full estate." },
  { name: "Casa De Reva", location: "Kaswand, Panchgani", href: "/villa/casa-de-reva", region: "/areas/panchgani", image: "/assets/villas/terra-cotta-villa/IMG-20260901-WA0061.jpg", detail: "A 4 BHK private pool villa for a Panchgani getaway. Stays start at ₹16,000 per night. Check dates, guest limits and the final quote on the listing." },
];

const faqs = [
  { question: "Which stay suits our group size?", answer: "The Angle House accommodates up to 12 guests and Canopy Crest has a maximum of 16. A Willow Peak cottage accommodates up to four guests; all three cottages together accommodate up to 12. Check sleeping arrangements and confirm any daytime visitors before booking." },
  { question: "Can I book a cottage from ₹4,999?", answer: "Willow Peak base pricing starts at ₹4,999 per night for one cottage with a private Jacuzzi. This is an accommodation starting rate. Your dates, taxes, food and optional extras can change the total; review the final quote before payment." },
  { question: "How long is the drive from Mumbai or Pune?", answer: "Travel time depends on your starting point, the villa’s exact locality, traffic and weather. Use each listing’s map pin to check the current route. The Angle House is in Kamshet; Willow Peak is in Kurwande; Canopy Crest is in Khopoli." },
  { question: "Are meals, pets and celebrations included?", answer: "Ask the team about meal packages, pet rules, decorations, music timings and event permissions for your chosen property. Confirm charges and any restrictions in the quote." },
];

export default function SEOContent() {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-8 bg-[#FAF8F5] text-[#1B3564]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-heading font-bold mb-4">Choose a pool villa or Jacuzzi cottage for your weekend</h2>
        <p className="max-w-3xl text-slate-600 leading-relaxed mb-8">Compare our stays in Lonavala, Khopoli and Panchgani by location, guest count and booking unit. Starting rates are per night; check your dates and the complete quote before reserving.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stays.map(stay => (
            <article key={stay.href} className="rounded-2xl overflow-hidden bg-white border border-slate-200">
              <Link href={stay.href} className="relative block aspect-[4/3]">
                <Image src={stay.image} alt={stay.name + " in " + stay.location} fill loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px" className="object-cover" />
              </Link>
              <div className="p-5">
                <h3 className="text-xl font-heading font-bold"><Link href={stay.href}>{stay.name}</Link></h3>
                <Link href={stay.region} className="block mt-1 text-sm underline underline-offset-4">{stay.location}</Link>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{stay.detail}</p>
                <Link href={stay.href} className="inline-block mt-4 font-semibold underline underline-offset-4">See the stay and dates</Link>
              </div>
            </article>
          ))}
        </div>
        <GuideLinks title="Compare destinations, prices and weekend plans" slugs={["lonavala-vs-khandala-villa-comparison", "khopoli-vs-lonavala-villa-comparison", "3-bhk-4-bhk-villa-in-lonavala-with-private-pool-price-guide", "best-villas-near-imagica-khopoli-with-private-pool"]} />
        <h2 className="text-2xl font-heading font-bold mt-10 mb-5">Before you book</h2>
        <div className="grid gap-3">
          {faqs.map(faq => (
            <details key={faq.question} className="rounded-xl border border-slate-200 bg-white p-5">
              <summary className="font-semibold cursor-pointer">{faq.question}</summary>
              <p className="mt-3 text-slate-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
