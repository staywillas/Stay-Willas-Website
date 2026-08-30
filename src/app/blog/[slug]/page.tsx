import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { blogsData } from "@/data/blogs";
import { ChevronLeft, Calendar, Clock, BookOpen, Share2, HelpCircle } from "lucide-react";

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

  // Structured Data Schema for Search Engines (JSON-LD BlogPosting & FAQPage)
  const faqList = blog.sections
    .filter(s => s.list && s.list.length > 0)
    .map(s => ({
      "@type": "Question",
      "name": `What should I consider for ${s.heading.toLowerCase()}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": s.paragraphs.join(" ") + " " + s.list?.join(", ")
      }
    }));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.description,
    "image": `https://www.staywillas.com${blog.image}`,
    "datePublished": new Date(blog.date).toISOString(),
    "dateModified": new Date(blog.date).toISOString(),
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
    ...(faqList.length > 0 ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqList
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
        <article className="max-w-none text-left mb-20 font-sans">
          <div 
            className="text-slate-800 text-xl md:text-2xl leading-[1.8] italic border-l-4 border-[#DAA520] pl-6 md:pl-8 mb-12 font-normal bg-[#FAF8F5]/90 p-6 md:p-8 rounded-r-3xl border border-[#DAA520]/20 shadow-sm"
            dangerouslySetInnerHTML={{ __html: blog.intro }}
          />

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
