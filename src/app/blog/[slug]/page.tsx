import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { blogsData } from "@/data/blogs";
import { ChevronLeft, Calendar, Clock, BookOpen, Share2, HelpCircle, Sparkles, ArrowRight, BedDouble, Users, Waves, Flame, MapPin } from "lucide-react";
import { prisma } from "@/lib/db";
import BlogHorizontalMarquee from "@/components/blog/blog-horizontal-marquee";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogsData.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const blog = blogsData.find((b) => b.slug === slug);

  if (!blog) {
    return {
      title: "Requested Blog Article Was Not Found | Stay Willas",
    };
  }

  const ogImageUrl = blog.image.startsWith("http") ? blog.image : `https://www.staywillas.com${blog.image}`;

  return {
    title: blog.metaTitle,
    description: blog.description,
    keywords: blog.keywords,
    alternates: {
      canonical: `https://www.staywillas.com/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.metaTitle,
      description: blog.description,
      url: `https://www.staywillas.com/blog/${blog.slug}`,
      images: [{ url: ogImageUrl }],
      type: "article",
      publishedTime: new Date(blog.date).toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: blog.metaTitle,
      description: blog.description,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const blog = blogsData.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  const otherBlogs = blogsData.filter((b) => b.slug !== slug).slice(0, 2);

  let relatedVilla = null;
  let featuredVillas: Array<{
    name: string;
    slug: string;
    images: string[];
    location: string;
    price: number;
    bedrooms: number;
    guests: number;
  }> = [];

  if (blog.featuredVillaSlugs && blog.featuredVillaSlugs.length > 0) {
    const fetched = await prisma.villa.findMany({
      where: { slug: { in: blog.featuredVillaSlugs } },
      select: { name: true, slug: true, images: true, location: true, price: true, bedrooms: true, guests: true }
    });
    featuredVillas = blog.featuredVillaSlugs
      .map(s => fetched.find(v => v.slug === s))
      .filter((v): v is NonNullable<typeof v> => Boolean(v));
  } else if ((blog as any).relatedVillaSlug) {
    relatedVilla = await prisma.villa.findUnique({
      where: { slug: (blog as any).relatedVillaSlug },
      select: { name: true, slug: true, images: true, location: true }
    });
  }

  // Extract genuine FAQ items for Google Rich Results & AI Search
  const genuineFaqs: Array<{ "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }> = [];
  
  blog.sections.forEach((section) => {
    const isFaqHeading = /faq|frequently\s+asked/i.test(section.heading);
    if (section.list && section.list.length > 0) {
      section.list.forEach((item) => {
        const qIndex = item.indexOf("?");
        if (qIndex !== -1 && (isFaqHeading || qIndex < 140)) {
          const question = item.slice(0, qIndex + 1).trim();
          const answer = item.slice(qIndex + 1).trim();
          if (question.length > 10 && answer.length > 10) {
            genuineFaqs.push({
              "@type": "Question",
              name: question,
              acceptedAnswer: {
                "@type": "Answer",
                text: answer,
              },
            });
          }
        }
      });
    }
  });

  const isKhopoli = /khopoli/i.test(blog.title + " " + blog.slug);
  const isLonavala = /lonavala/i.test(blog.title + " " + blog.slug);
  const blogAboutEntity = isKhopoli
    ? {
        "@type": "Place",
        name: "Khopoli, Maharashtra",
        sameAs: "https://www.wikidata.org/wiki/Q2248559",
      }
    : isLonavala
    ? {
        "@type": "Place",
        name: "Lonavala, Maharashtra",
        sameAs: "https://www.wikidata.org/wiki/Q1140889",
      }
    : {
        "@type": "Place",
        name: "Maharashtra, India",
        sameAs: "https://www.wikidata.org/wiki/Q1191",
      };

  const articleWordCount = (
    blog.intro + " " + 
    blog.sections.map(s => s.paragraphs.join(" ") + " " + (s.list?.join(" ") || "")).join(" ") + " " + 
    blog.conclusion
  ).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.description,
    "image": `https://www.staywillas.com${blog.image}`,
    "datePublished": new Date(blog.date).toISOString(),
    "dateModified": new Date(blog.date).toISOString(),
    "inLanguage": "en-IN",
    "wordCount": articleWordCount,
    "about": blogAboutEntity,
    "author": {
      "@type": "Organization",
      "name": "Stay Willas",
      "url": "https://www.staywillas.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Stay Willas",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.staywillas.com/icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.staywillas.com/blog/${blog.slug}`
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.staywillas.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.staywillas.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `https://www.staywillas.com/blog/${blog.slug}`
      }
    ]
  };

  const schemaToInject = [
    articleSchema,
    breadcrumbSchema,
    ...(genuineFaqs.length > 0 ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": genuineFaqs
    }] : [])
  ];

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-primary selection:text-white">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaToInject) }}
      />

      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/blog" className="flex items-center gap-2 text-text-primary/60 hover:text-accent-primary transition-colors text-xs sm:text-sm uppercase tracking-widest font-bold">
            <ChevronLeft size={18} />
            Back to Articles
          </Link>
        </div>

        {/* Article Meta */}
        <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider mb-6 select-none">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#DAA520]" />
            {blog.date}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/40" />
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#DAA520]" />
            {blog.readTime}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/40" />
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-[#DAA520]" />
            Guide
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading text-[#1B3564] mb-8 font-bold leading-tight">
          {blog.title}
        </h1>

        {/* Feature Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl mb-12 border border-[#DAA520]/15">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Content */}
        <article className="max-w-none text-left mb-20 font-sans clearfix">
          
          {/* Related Villa Widget - Floats Right */}
          {relatedVilla && (
            <div className="hidden md:block float-right ml-8 mb-8 w-72 bg-white rounded-2xl shadow-xl border border-[#DAA520]/20 overflow-hidden relative z-10 sticky top-32">
              <div className="h-40 relative w-full">
                <Image
                  src={relatedVilla.images[0] || "/images/hero-villa.webp"}
                  alt={relatedVilla.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#1B3564] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Featured Stay
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-[#1B3564] mb-1 leading-tight">{relatedVilla.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{relatedVilla.location}</p>
                <Link 
                  href={`/villa/${relatedVilla.slug}`}
                  className="block w-full text-center bg-[#DAA520] hover:bg-[#C5951C] text-white font-bold py-2.5 rounded-lg text-sm uppercase tracking-wider transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          )}

          {/* Mobile Related Villa Widget */}
          {relatedVilla && (
            <div className="md:hidden w-full bg-white rounded-2xl shadow-md border border-[#DAA520]/20 overflow-hidden mb-8 flex items-center p-3 gap-4">
              <div className="h-20 w-24 relative rounded-xl overflow-hidden shrink-0">
                <Image
                  src={relatedVilla.images[0] || "/images/hero-villa.webp"}
                  alt={relatedVilla.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-sm font-bold text-[#1B3564] leading-tight mb-1">{relatedVilla.name}</h3>
                <Link 
                  href={`/villa/${relatedVilla.slug}`}
                  className="inline-block bg-[#DAA520] text-white font-bold py-1.5 px-4 rounded-md text-xs uppercase tracking-wider"
                >
                  Book Now
                </Link>
              </div>
            </div>
          )}

          <div 
            className="text-slate-800 text-xl md:text-2xl leading-[1.8] italic border-l-4 border-[#DAA520] pl-6 md:pl-8 mb-12 font-normal bg-[#FAF8F5]/90 p-6 md:p-8 rounded-r-3xl border border-[#DAA520]/20 shadow-sm"
            dangerouslySetInnerHTML={{ __html: blog.intro }}
          />

          {/* High-Impact Horizontal Image Marquee */}
          {blog.showMarquee && (
            <BlogHorizontalMarquee />
          )}

          {/* Dual Featured Villas Showcase */}
          {featuredVillas.length > 1 && (
            <div className="my-14 bg-gradient-to-br from-[#FAF8F5] via-white to-[#FAF8F5] rounded-3xl p-6 sm:p-8 md:p-10 border border-[#DAA520]/30 shadow-xl">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 bg-[#DAA520]/15 border border-[#DAA520]/40 rounded-full px-4 py-1.5 mb-3 shadow-sm">
                  <Sparkles size={14} className="text-[#B8860B] animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8860B]">
                    Signature Lonavala Villas
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-[#1B3564] tracking-tight">
                  Featured Lonavala Villa Stays
                </h3>
                <p className="text-slate-600 text-sm mt-2 font-normal">
                  Reserve directly with Stay Willas to unlock guaranteed best tariffs, zero platform commissions, and personalized concierge coordination.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredVillas.map((villa) => {
                  const isAngleHouse = villa.slug === "the-angle-house";
                  const displayName = isAngleHouse
                    ? "The Angle House"
                    : villa.slug.includes("willow-peak") && villa.name.includes("(")
                    ? "Willow Peak"
                    : villa.name;
                  const startingPrice = isAngleHouse ? villa.price : 4999;

                  return (
                    <div 
                      key={villa.slug}
                      className="bg-white rounded-2xl sm:rounded-3xl border border-[#DAA520]/25 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
                    >
                      <div>
                        {/* Image Banner */}
                        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
                          <Image
                            src={
                              isAngleHouse
                                ? "/assets/villas/the-angle-house/gallery-11.webp"
                                : "/assets/villas/willow-peak/gallery-1.webp"
                            }
                            alt={displayName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          
                          {/* Badge */}
                          <div className="absolute top-4 left-4">
                            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md border shadow-md flex items-center gap-1.5 ${
                              isAngleHouse
                                ? "bg-[#1B3564]/90 text-[#F3C065] border-[#DAA520]/50"
                                : "bg-[#064E3B]/90 text-[#34D399] border-[#10B981]/50"
                            }`}>
                              {isAngleHouse ? <Waves size={12} /> : <Flame size={12} />}
                              {isAngleHouse ? "Architectural Glass & Waterfall Pool" : "Alpine A-Frame Chalets & Jacuzzi"}
                            </span>
                          </div>

                          {/* Price Tag & Villa Name in Official Brand Green */}
                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                            <div className="pr-2">
                              <h4 
                                style={{ color: "#6B9E1D" }}
                                className="font-heading text-2xl sm:text-3xl font-black leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] !text-[#6B9E1D] tracking-tight"
                              >
                                {displayName}
                              </h4>
                              <p className="text-xs text-slate-100 font-medium flex items-center gap-1.5 mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                                <MapPin size={13} className="text-[#6B9E1D] shrink-0" />
                                <span>{villa.location}</span>
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] uppercase tracking-wider text-slate-200 block font-semibold drop-shadow-sm">Starting from</span>
                              <span className="text-xl sm:text-2xl font-black text-[#F3C065] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                                ₹{startingPrice?.toLocaleString("en-IN")}
                              </span>
                              <span className="text-[10px] text-slate-200 font-medium drop-shadow-sm"> / night</span>
                            </div>
                          </div>
                        </div>

                        {/* Specs & Highlights */}
                        <div className="p-5 sm:p-6">
                          <div className="grid grid-cols-2 gap-3 pb-4 mb-4 border-b border-slate-100 text-xs text-slate-700">
                            <div className="flex items-center gap-2 font-medium">
                              <BedDouble size={16} className="text-[#DAA520] shrink-0" />
                              <span>{isAngleHouse ? "3 BHK Glass Villa" : "3 Standalone Chalets"}</span>
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                              <Users size={16} className="text-[#DAA520] shrink-0" />
                              <span>{isAngleHouse ? "Sleeps up to 12 Guests" : "2 to 12 Guests"}</span>
                            </div>
                          </div>

                          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 mb-6">
                            {isAngleHouse ? (
                              <>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#DAA520] font-bold">✓</span>
                                  <span>Private cascading waterfall pool with underwater mood lighting</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#DAA520] font-bold">✓</span>
                                  <span>Master suite with in-room hydrotherapy jacuzzi overlooking mountain vistas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#DAA520] font-bold">✓</span>
                                  <span>100% pet-friendly sprawling turf lawn with secure boundary fencing</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#DAA520] font-bold">✓</span>
                                  <span>Dedicated private chef serving fresh Maharashtrian & Jain menus</span>
                                </li>
                              </>
                            ) : (
                              <>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#10B981] font-bold">✓</span>
                                  <span>En-suite heated bubble jacuzzi in every chalet with mountain mist views</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#10B981] font-bold">✓</span>
                                  <span>Authentic pine wood A-frame architecture with modern climate control</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#10B981] font-bold">✓</span>
                                  <span>Manicured central lawn with open-sky bonfire pit & live BBQ grill setup</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-[#10B981] font-bold">✓</span>
                                  <span>Secluded Kurwande clifftop setting near Lion's Point & Tiger's Leap</span>
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 pt-0">
                        <Link
                          href={`/villa/${villa.slug}`}
                          className="w-full flex items-center justify-center gap-2 bg-[#1B3564] hover:bg-[#6B9E1D] text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-md group-hover:shadow-lg"
                        >
                          <span>Explore {displayName}</span>
                          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {blog.sections.map((section, idx) => (
            <div key={idx} className="my-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading text-[#1B3564] font-bold mb-6 mt-10 leading-snug">
                {section.heading}
              </h2>
              {section.paragraphs.map((para, pIdx) => (
                <p 
                  key={pIdx} 
                  className="text-slate-800 text-lg md:text-xl lg:text-[1.2rem] leading-[1.85] font-normal mb-6 tracking-normal"
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}
              
              {section.list && section.list.length > 0 && (
                <ul className="list-disc list-inside space-y-4 bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#DAA520]/25 my-8 text-slate-800 text-base md:text-lg lg:text-xl font-normal leading-relaxed shadow-sm">
                  {section.list.map((item, lIdx) => (
                    <li key={lIdx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="border-t border-[#DAA520]/25 pt-10 mt-16 bg-[#FAF8F5]/50 p-6 sm:p-8 rounded-3xl border border-[#DAA520]/15">
            <h3 className="text-2xl md:text-3xl font-heading text-[#1B3564] font-bold mb-4">Conclusion</h3>
            <p className="text-slate-800 text-lg md:text-xl lg:text-[1.2rem] leading-[1.85] font-normal">
              {blog.conclusion}
            </p>
          </div>
        </article>

        {/* Villa Homeowner Partner Callout Banner */}
        <div className="my-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1B3564] via-[#152A50] to-[#0A162B] text-white border border-[#DAA520]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#DAA520]/10 rounded-full blur-[90px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <span className="text-[#DAA520] font-black uppercase text-[10px] tracking-[0.25em] block mb-2">
                For Villa &amp; Estate Owners
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white leading-tight">
                Own a Luxury Villa in Maharashtra? <br className="hidden sm:block" />
                <span className="italic text-[#DAA520] font-serif font-light">Partner With Stay Willas</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Turn your private holiday home into a high-yielding luxury asset. We manage marketing, verified family guests, swimming pool care, and 24/7 on-site maintenance with full owner stay flexibility.
              </p>
            </div>
            <Link
              href="/partner"
              className="bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] rounded-full px-8 py-4 text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 border border-white/20"
            >
              PARTNER WITH US &rarr;
            </Link>
          </div>
        </div>

        {/* Recommendation Cards */}
        {otherBlogs.length > 0 && (
          <div className="border-t border-[#DAA520]/20 pt-16 mt-20">
            <h3 className="text-2xl md:text-3xl font-heading text-[#1B3564] font-bold mb-8 text-center italic">Recommended Reads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
              {otherBlogs.map((item) => (
                <div key={item.slug} className="bg-white border border-[#DAA520]/15 rounded-3xl p-6 text-left shadow-sm flex flex-col justify-between group max-w-md w-full">
                  <div>
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 bg-slate-50">
                      <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-heading font-bold text-base md:text-lg text-[#1B3564] mb-2 leading-snug group-hover:text-accent-primary transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <Link href={`/blog/${item.slug}`} className="text-xs sm:text-sm font-bold text-[#DAA520] hover:text-[#1B3564] transition-colors mt-4 flex items-center gap-1 uppercase tracking-wider">
                    Read Article →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
