import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/footer";
import BlogBrowser from "@/components/blog/blog-browser";
import { blogsData } from "@/data/blogs";
import { getGuideTopic } from "@/data/guide-navigation";
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/schema";
import { ArrowUpRight, House } from "lucide-react";

export const revalidate = 60; // Instant TTFB via ISR cache

export const metadata: Metadata = {
  title: "Stay Willas Blog | Luxury Villa Guides & Staycation Tips",
  description: "Explore the Stay Willas blog for luxury villa guides, weekend staycation tips, and travel ideas near Mumbai and Pune. Read our latest articles.",
  keywords: ["stay willas blog"],
  alternates: {
    canonical: "https://www.staywillas.com/blog",
  },
  openGraph: {
    title: "Stay Willas Blog | Luxury Villa Guides & Staycation Tips",
    description: "Explore the Stay Willas blog for luxury villa guides, weekend staycation tips, and travel ideas near Mumbai and Pune. Read our latest articles.",
    url: "https://www.staywillas.com/blog",
    images: [
      {
        url: "https://www.staywillas.com/images/hero-villa.webp",
        width: 1200,
        height: 630,
        alt: "Stay Willas Blog",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stay Willas Blog | Luxury Villa Guides & Staycation Tips",
    description: "Explore the Stay Willas blog for luxury villa guides, weekend staycation tips, and travel ideas near Mumbai and Pune. Read our latest articles.",
    images: ["https://www.staywillas.com/images/hero-villa.webp"],
  },
};

export default async function BlogIndexPage({ searchParams }: {searchParams:Promise<{topic?:string}>}) {
  const query = await searchParams;
  const topics = [
    {id:"choosing",label:"Planning & prices"}, {id:"khopoli",label:"Khopoli & Imagica"},
    {id:"couples",label:"Couples & cottages"}, {id:"family",label:"Family & pets"},
    {id:"local",label:"Things to do"}, {id:"experiences",label:"Food & workations"},
    {id:"seasonal",label:"Weekend trips"}, {id:"panchgani",label:"Panchgani"},
    {id:"owners",label:"Villa owners"},
  ];
  const initialTopic = topics.some(topic => topic.id === query.topic) ? query.topic : "all";
  const guides = [...blogsData].sort((a,b) => new Date(b.updatedAt || b.date).getTime() - new Date(a.updatedAt || a.date).getTime()).map(blog => ({
    slug:blog.slug,title:blog.title,description:blog.description,image:blog.image,readTime:`${Math.max(1,Math.ceil((blog.intro+" "+blog.sections.map(section=>section.paragraphs.join(" ")+" "+(section.list?.join(" ")||"")).join(" ")+" "+blog.conclusion).replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean).length/200))} min read`,topic:getGuideTopic(blog.slug)?.id || "other",
  }));
  const schema = {"@context":"https://schema.org","@graph":[
    {"@type":"CollectionPage","@id":BASE_URL+"/blog#webpage",url:BASE_URL+"/blog",name:"Stay Willas travel guides"},
    generateBreadcrumbSchema([{name:"Home",url:"/"},{name:"Travel guides",url:"/blog"}]),
  ]};
  return <main className="min-h-screen bg-bg-primary text-[#1B3564]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <header className="max-w-3xl mx-auto px-5 pt-32 sm:pt-40 pb-8 sm:pb-12 text-center">
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#977111]">The Stay Willas journal</span>
      <h1 className="mt-4 mb-4 text-4xl sm:text-5xl font-heading font-bold leading-tight">A little help planning<br /><span className="font-serif italic font-normal text-[#977111]">your next escape.</span></h1>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">Choose a topic or search for a destination. Find practical guides to villas, weekend trips, celebrations and cottage stays.</p>
    </header>
    <aside className="max-w-[1152px] mx-4 sm:mx-6 xl:mx-auto mb-6 rounded-2xl border border-[#D1C7B3] bg-[#EBE5D6] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" aria-label="For villa owners">
      <div className="flex items-start gap-3"><House size={23} className="text-[#977111] shrink-0 mt-1" /><div><h2 className="font-semibold text-base">Own a villa? Let’s welcome guests together.</h2><p className="text-xs sm:text-sm text-slate-600 mt-1">See how a Stay Willas partnership could work for your home.</p></div></div>
      <Link href="/blog/partner-with-stay-willas-villa-owner-guide" className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-3 rounded-full bg-[#1B3564] text-white text-xs font-semibold shrink-0">Read the owner guide <ArrowUpRight size={16} /></Link>
    </aside>
    <BlogBrowser key={initialTopic || "all"} guides={guides} topics={topics} initialTopic={initialTopic} />
    <Footer />
  </main>;
}
