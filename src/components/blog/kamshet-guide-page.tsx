import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronLeft, Clock3, MapPin } from "lucide-react";
import Footer from "@/components/layout/footer";
import type { BlogPost } from "@/data/blogs";
import KamshetAngleHouseCarousel from "./kamshet-angle-house-carousel";
import styles from "./kamshet-guide.module.css";

interface KamshetGuidePageProps {
  blog: BlogPost;
  articleWordCount: number;
  relatedGuides: BlogPost[];
  schemaJson: string;
}

function sectionId(heading: string, index: number) {
  const slug = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `guide-${index}-${slug}`;
}

function renderParagraph(text: string, key: number) {
  return <p key={key} className={styles.paragraph} dangerouslySetInnerHTML={{ __html: text }} />;
}

function renderDayPlan(paragraphs: string[]) {
  return (
    <div className={styles.dayPlan}>
      {paragraphs.map((paragraph, index) => {
        const separator = paragraph.indexOf(":");
        const title = separator > 0 ? paragraph.slice(0, separator) : `Plan ${index + 1}`;
        const detail = separator > 0 ? paragraph.slice(separator + 1).trim() : paragraph;
        return (
          <details className={styles.dayItem} key={title} open={index === 0}>
            <summary>
              <span className={styles.dayIndex}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.dayTitle}>{title}</span>
              <span className={styles.dayToggle} aria-hidden="true">+</span>
            </summary>
            <p>{detail}</p>
          </details>
        );
      })}
    </div>
  );
}

function renderFaqs(items: string[]) {
  return (
    <div className={styles.faqList}>
      {items.map((item) => {
        const separator = item.indexOf("?");
        const question = separator >= 0 ? item.slice(0, separator + 1) : item;
        const answer = separator >= 0 ? item.slice(separator + 1).trim() : "";
        return (
          <details className={styles.faqItem} key={question}>
            <summary>{question}</summary>
            {answer && <p>{answer}</p>}
          </details>
        );
      })}
    </div>
  );
}

export default function KamshetGuidePage({
  blog,
  articleWordCount,
  relatedGuides,
  schemaJson,
}: KamshetGuidePageProps) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <Link href="/blog" className={styles.backLink}>
              <ChevronLeft size={16} aria-hidden="true" />
              Travel guides
            </Link>
            <p className={styles.locationLabel}><MapPin size={14} aria-hidden="true" /> Kamshet, Maharashtra</p>
            <h1>Villa in Kamshet<em>A slower weekend guide.</em></h1>
            <p className={styles.heroLead} dangerouslySetInnerHTML={{ __html: blog.intro }} />
            <Link href="/villa/the-angle-house" className={styles.heroAction}>
              Check the villa and dates <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <div className={styles.heroMeta}>
              <span><CalendarDays size={15} aria-hidden="true" /> {blog.date}</span>
              <span><Clock3 size={15} aria-hidden="true" /> {Math.max(1, Math.ceil(articleWordCount / 200))} min read</span>
            </div>
          </div>
          <KamshetAngleHouseCarousel />
        </header>

        <div className={styles.factStrip} aria-label="The Angle House at a glance">
          <p><strong>3</strong><span>bedrooms</span></p>
          <p><strong>12</strong><span>guests listed</span></p>
          <p><strong>Private</strong><span>pool and master-suite Jacuzzi</span></p>
        </div>

        <div className={styles.articleLayout}>
          <aside className={styles.contents} aria-label="On this page">
            <p className={styles.contentsTitle}>In this guide</p>
            <nav>
              {blog.sections.map((section, index) => (
                <a href={`#${sectionId(section.heading, index)}`} key={section.heading}>{section.heading}</a>
              ))}
              <a href="#guide-conclusion">A few final notes</a>
            </nav>
          </aside>

          <article className={styles.article}>
            <p className={styles.articleByline}>
              A practical guide from <Link href="/about">Stay Willas</Link>
              {blog.updatedAt && <> · Updated <time dateTime={blog.updatedAt}>{new Date(blog.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })}</time></>}
            </p>

            {blog.sections.map((section, index) => {
              const id = sectionId(section.heading, index);
              const isPlan = section.heading.startsWith("A flexible two-day");
              const isFaq = /frequently asked questions/i.test(section.heading);
              return (
                <section className={styles.articleSection} id={id} key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map(renderParagraph)}
                  {isPlan && renderDayPlan(section.paragraphs)}
                  {section.list && section.list.length > 0 && (
                    isFaq
                      ? renderFaqs(section.list)
                      : <ul className={styles.checklist}>{section.list.map((item) => <li key={item}>{item}</li>)}</ul>
                  )}
                </section>
              );
            })}

            <section className={styles.conclusion} id="guide-conclusion">
              <h2>A few final notes</h2>
              <p dangerouslySetInnerHTML={{ __html: blog.conclusion }} />
            </section>
          </article>
        </div>

        {relatedGuides.length > 0 && (
          <nav className={styles.related} aria-label="More local travel guides">
            <h2>Keep planning your weekend</h2>
            <div className={styles.relatedLinks}>
              {relatedGuides.map((guide) => (
                <Link href={`/blog/${guide.slug}`} key={guide.slug}>
                  <span>{guide.title}</span><ArrowRight size={17} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </nav>
        )}
      </main>
      <Footer />
    </>
  );
}
