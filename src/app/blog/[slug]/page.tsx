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

  return {
    title: blog.metaTitle,
    description: blog.description,
    keywords: blog.keywords,
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.metaTitle,
      description: blog.description,
      images: [{ url: blog.image }],
      type: "article",
      publishedTime: new Date(blog.date).toISOString(),
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

  const schemaToInject = faqList.length > 0 ? [articleSchema, {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList
  }] : [articleSchema];

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-primary selection:text-white">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaToInject) }}
      />

      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/blog" className="flex items-center gap-2 text-text-primary/40 hover:text-accent-primary transition-colors text-xs uppercase tracking-widest font-bold">
            <ChevronLeft size={16} />
            Back to Articles
          </Link>
        </div>

        {/* Article Meta */}
        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-6 select-none">
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-[#DAA520]" />
            {blog.date}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/30" />
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-[#DAA520]" />
            {blog.readTime}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#DAA520]/30" />
          <span className="flex items-center gap-1">
            <BookOpen size={12} className="text-[#DAA520]" />
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
        <article className="prose max-w-none text-left mb-20 font-sans">
          <p className="text-slate-700 text-lg md:text-xl leading-relaxed italic border-l-4 border-[#DAA520] pl-6 mb-10 font-light">
            {blog.intro}
          </p>

          {blog.sections.map((section, idx) => (
            <div key={idx} className="my-10">
              <h2 className="text-2xl md:text-3xl font-heading text-[#1B3564] font-bold mb-4">
                {section.heading}
              </h2>
              {section.paragraphs.map((para, pIdx) => (
                <p 
                  key={pIdx} 
                  className="text-slate-800 text-sm sm:text-base leading-relaxed font-light mb-6"
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}
              
              {section.list && section.list.length > 0 && (
                <ul className="list-disc list-inside space-y-3 bg-[#FAF8F5] p-6 rounded-2xl border border-[#DAA520]/15 my-6 text-slate-800 text-sm font-light">
                  {section.list.map((item, lIdx) => (
                    <li key={lIdx} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="border-t border-[#DAA520]/25 pt-10 mt-12">
            <h3 className="text-xl font-heading text-[#1B3564] font-bold mb-4">Conclusion</h3>
            <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-light">
              {blog.conclusion}
            </p>
          </div>
        </article>

        {/* Recommendation Cards */}
        {otherBlogs.length > 0 && (
          <div className="border-t border-[#DAA520]/20 pt-16 mt-20 select-none">
            <h3 className="text-2xl font-heading text-[#1B3564] font-bold mb-8 text-center italic">Recommended Reads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
              {otherBlogs.map((item) => (
                <div key={item.slug} className="bg-white border border-[#DAA520]/15 rounded-3xl p-6 text-left shadow-sm flex flex-col justify-between group max-w-sm">
                  <div>
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 bg-slate-50">
                      <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-heading font-bold text-sm md:text-base text-[#1B3564] mb-2 leading-snug group-hover:text-accent-primary transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <Link href={`/blog/${item.slug}`} className="text-xs font-bold text-[#DAA520] hover:text-[#1B3564] transition-colors mt-4 flex items-center gap-1 uppercase tracking-wider">
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
