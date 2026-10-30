import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/footer";
import FaqBrowser from "@/components/faq/faq-browser";
import { FAQS_DATA, FAQ_CATEGORIES } from "@/data/faqs";
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/schema";
import { ArrowUpRight, HelpCircle } from "lucide-react";

export const revalidate = 86400; // 24 hours edge cache

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Stay Willas Luxury Villas",
  description: "Find clear, genuine answers about Stay Willas luxury villas, Willow Peak villa configurations, private pool hygiene, food & chef services, check-in timings, and 0% booking fees.",
  keywords: [
    "stay willas faq",
    "willow peak properties explained",
    "private pool villas maharashtra faq",
    "the angle house lonavala questions",
    "canopy crest khopoli faq",
    "villa chef services maharashtra",
    "stay willas cancellation policy"
  ],
  alternates: {
    canonical: "https://www.staywillas.com/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | Stay Willas Luxury Villas",
    description: "Find clear, genuine answers about Stay Willas luxury villas, Willow Peak villa configurations, private pool hygiene, food & chef services, check-in timings, and 0% booking fees.",
    url: "https://www.staywillas.com/faq",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.webp",
        width: 1200,
        height: 630,
        alt: "Stay Willas Frequently Asked Questions",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | Stay Willas Luxury Villas",
    description: "Find clear, genuine answers about Stay Willas luxury villas, Willow Peak villa configurations, private pool hygiene, food & chef services, check-in timings, and 0% booking fees.",
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

export default async function FaqPage() {
  // Schema.org FAQPage Structured Data
  const faqPageSchema = {
    "@type": "FAQPage",
    "@id": `${BASE_URL}/faq#faqpage`,
    mainEntity: FAQS_DATA.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/\*\*/g, ""),
      },
    })),
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      faqPageSchema,
      generateBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Frequently Asked Questions", url: "/faq" },
      ]),
    ],
  };

  return (
    <main className="min-h-screen bg-bg-primary text-[#1B3564]">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero Header */}
      <header className="max-w-3xl mx-auto px-5 pt-32 sm:pt-40 pb-8 sm:pb-12 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#977111]">
          Stay Willas Concierge &amp; Help Center
        </span>
        <h1 className="mt-4 mb-4 text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight">
          Everything you need to know
          <br />
          <span className="font-serif italic font-normal text-[#977111]">
            before your stay.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
          Clear, genuine answers about our villa layouts, Willow Peak villa options, private pool care, chef menus, and booking policies.
        </p>
      </header>

      {/* Owner Banner Quick Link */}
      <aside
        className="max-w-[1100px] mx-4 sm:mx-6 xl:mx-auto mb-8 rounded-2xl border border-[#D1C7B3] bg-[#EBE5D6] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        aria-label="For villa homeowners"
      >
        <div className="flex items-start gap-3">
          <HelpCircle size={22} className="text-[#977111] shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-base">
              Own a private villa in Maharashtra?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Learn how our turnkey property care, pool hygiene, and 0% booking fee partnership works.
            </p>
          </div>
        </div>
        <Link
          href="/partner"
          className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-full bg-[#1B3564] text-white text-xs font-semibold shrink-0 hover:bg-[#0f2341] transition-colors"
        >
          Partner with Stay Willas <ArrowUpRight size={15} />
        </Link>
      </aside>

      {/* Interactive FAQ Browser */}
      <FaqBrowser
        items={FAQS_DATA}
        categories={FAQ_CATEGORIES}
      />

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
