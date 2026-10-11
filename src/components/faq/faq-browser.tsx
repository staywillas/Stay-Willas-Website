"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  X, 
  ChevronDown, 
  Sparkles, 
  MessageCircle, 
  Phone, 
  HelpCircle,
  Home,
  CheckCircle2,
  SlidersHorizontal,
  ChevronUp
} from "lucide-react";
import { FAQItem, FAQCategory } from "@/data/faqs";
import styles from "./faq-browser.module.css";
import { encodeWhatsAppMessage } from "@/lib/whatsapp";

interface FaqBrowserProps {
  items: FAQItem[];
  categories: FAQCategory[];
  initialCategory?: string;
}

export default function FaqBrowser({
  items,
  categories,
  initialCategory = "all",
}: FaqBrowserProps) {
  const [category, setCategory] = useState<string>(initialCategory);
  const [query, setQuery] = useState<string>("");
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(["willow-peak-explanation"]));

  // Filter items based on active category and search query
  const matches = useMemo(() => {
    const rawQuery = query.trim().toLowerCase();
    const searchTokens = rawQuery.split(/\s+/).filter(Boolean);

    return items.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      if (!matchesCategory) return false;

      if (!searchTokens.length) return true;

      const searchableText = `${item.question} ${item.answer} ${item.categoryLabel} ${item.tags.join(" ")}`.toLowerCase();
      return searchTokens.every((token) => searchableText.includes(token));
    });
  }, [items, category, query]);

  // Toggle single FAQ accordion item
  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand all / Collapse all helper
  const expandAll = () => {
    setOpenIds(new Set(matches.map((m) => m.id)));
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  // Helper to format text with simple markdown (bold, bullet lines, links)
  const renderFormattedAnswer = (text: string) => {
    const lines = text.split("\n");
    return (
      <div className={styles.answer}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-3" />;
          }

          // Bullet points
          if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
            const bulletContent = trimmed.slice(2);
            return (
              <ul key={idx}>
                <li>{parseInlineMarkdown(bulletContent)}</li>
              </ul>
            );
          }

          // Numbered lists (e.g. "1. ")
          if (/^\d+\.\s/.test(trimmed)) {
            return (
              <p key={idx} className="font-medium text-[#1B3564]">
                {parseInlineMarkdown(trimmed)}
              </p>
            );
          }

          return <p key={idx}>{parseInlineMarkdown(trimmed)}</p>;
        })}
      </div>
    );
  };

  // Helper for **bold** and [label](url) parsing
  const parseInlineMarkdown = (content: string) => {
    // Regex for bold **text** and link [text](url)
    const parts = content.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        return (
          <Link
            key={i}
            href={href}
            className="text-[#977111] hover:underline font-semibold"
          >
            {label}
          </Link>
        );
      }
      return part;
    });
  };

  // Is Willow Peak spotlight relevant? Show if category is "all" or "willow-peak", or if user searched willow peak
  const showWillowSpotlight =
    category === "all" ||
    category === "willow-peak" ||
    query.toLowerCase().includes("willow");

  return (
    <section className={styles.browser} aria-label="Stay Willas Frequently Asked Questions">
      {/* Search & Filter Controls */}
      <div className={styles.controls}>
        <div className={styles.search} role="search">
          <Search size={18} className="text-[#8c97a7] shrink-0" aria-hidden="true" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions by topic, e.g. 'Willow Peak', 'meals', 'pool', 'cancellation'..."
            aria-label="Search frequently asked questions"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear FAQ search"
              onClick={() => setQuery("")}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className={styles.categories} aria-label="Filter questions by category">
          {categories.map((cat) => {
            const isSelected = category === cat.id;
            const count =
              cat.id === "all"
                ? items.length
                : items.filter((i) => i.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setCategory(cat.id)}
              >
                <span>{count}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Willow Peak Modular Clarification Spotlight Box */}
      {showWillowSpotlight && !query && (
        <aside className={styles.spotlightCard} aria-label="Willow Peak Estate Configuration Guide">
          <div className={styles.spotlightHeader}>
            <span className={styles.spotlightBadge}>
              <Sparkles size={12} /> Clarification Spotlight
            </span>
            <h2 className={styles.spotlightTitle}>
              Understanding Willow Peak: 3 Private Cottages &amp; 1 Entire Estate
            </h2>
            <p className={styles.spotlightDesc}>
              A frequent guest question is: <em>&ldquo;Are there 4 separate properties at Willow Peak? How does booking work?&rdquo;</em> Here is the exact estate breakdown:
            </p>
          </div>

          <div className={styles.spotlightGrid}>
            <div className={styles.spotlightCol}>
              <span>Cottage 1</span>
              <strong>Breeze (Cottage A)</strong>
              <p>1-Bedroom Duplex A-frame with private in-room Jacuzzi &amp; valley deck. Accommodates up to 4 guests.</p>
            </div>
            <div className={styles.spotlightCol}>
              <span>Cottage 2</span>
              <strong>Crest (Cottage B)</strong>
              <p>1-Bedroom Duplex A-frame with private in-room Jacuzzi &amp; valley deck. Accommodates up to 4 guests.</p>
            </div>
            <div className={styles.spotlightCol}>
              <span>Cottage 3</span>
              <strong>Heaven (Cottage C)</strong>
              <p>1-Bedroom Duplex A-frame with private in-room Jacuzzi &amp; valley deck. Accommodates up to 4 guests.</p>
            </div>
            <div className={`${styles.spotlightCol} ${styles.spotlightEstate}`}>
              <span>Listing 4 (Exclusive)</span>
              <strong>Willow Peak Entire Estate</strong>
              <p>Book all 3 cottages together exclusively for large families/groups (up to 16 guests) with private lawns &amp; gazebo.</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
            <span>✨ Note: Willow Peak features private indoor Jacuzzis, not swimming pools. For a swimming pool villa, explore <Link href="/villa/the-angle-house" className="underline text-[#DAA520]">The Angle House</Link> or <Link href="/villa/canopy-crest" className="underline text-[#DAA520]">Canopy Crest</Link>.</span>
            <Link href="/villa/willow-peak" className="font-semibold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">
              Explore Willow Peak Page &rarr;
            </Link>
          </div>
        </aside>
      )}

      {/* Results Bar */}
      <div className={styles.resultsBar}>
        <p role="status" aria-live="polite">
          Showing <strong>{matches.length}</strong> {matches.length === 1 ? "question" : "questions"}
          {category !== "all" && ` in ${categories.find((c) => c.id === category)?.label}`}
          {query && ` matching "${query}"`}
        </p>

        <div className={styles.resultsActions}>
          {matches.length > 0 && (
            <>
              <button type="button" onClick={expandAll} className={styles.textBtn}>
                Expand all
              </button>
              <span className="text-slate-300">|</span>
              <button type="button" onClick={collapseAll} className={styles.textBtn}>
                Collapse all
              </button>
            </>
          )}

          {(query || category !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className={`${styles.textBtn} ml-2 text-[#977111]`}
            >
              Reset filters <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Accordion Questions List */}
      {matches.length > 0 ? (
        <div className={styles.list}>
          {matches.map((item) => {
            const isOpen = openIds.has(item.id);
            return (
              <article
                key={item.id}
                className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}
              >
                <button
                  type="button"
                  className={styles.trigger}
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <div className={styles.triggerContent}>
                    <span className={styles.categoryTag}>{item.categoryLabel}</span>
                    <h3 className={styles.question}>{item.question}</h3>
                  </div>
                  <div className={styles.iconWrap} aria-hidden="true">
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    className={styles.answerWrapper}
                  >
                    {renderFormattedAnswer(item.answer)}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className={styles.empty}>
          <h2>No matching questions found</h2>
          <p>
            We couldn&apos;t find an answer matching &ldquo;{query}&rdquo;. Our local villa concierge is online and can answer your specific question directly.
          </p>
          <div className={styles.emptyActions}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Show All Questions
            </button>
            <a
              href={`https://wa.me/919619042310?text=${encodeWhatsAppMessage(`Hi Stay Willas Concierge! 🏡 I was browsing your FAQ page and have a question: ${query}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              <MessageCircle size={15} /> Ask Concierge on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Bottom Concierge Help Card */}
      <aside className={styles.conciergeCard} aria-label="Still need assistance">
        <div className="w-12 h-12 rounded-full bg-[#1B3564]/10 flex items-center justify-center text-[#1B3564]">
          <HelpCircle size={24} />
        </div>
        <div>
          <h3>Still have questions about your stay?</h3>
          <p className="mt-2">
            Every celebration and getaway is unique. Chat with our dedicated villa concierge for instant dates availability, chef menu planning, or bespoke arrangements.
          </p>
        </div>
        <div className={styles.conciergeActions}>
          <a
            href={`https://wa.me/919619042310?text=${encodeWhatsAppMessage("Hi Stay Willas! 🏡 I have a few questions before booking our villa stay.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-md transition-transform hover:scale-105"
          >
            <MessageCircle size={16} /> WhatsApp Concierge (+91 96190 42310)
          </a>
          <a
            href="tel:+919619042310"
            className="inline-flex items-center gap-2 bg-[#1B3564] hover:bg-[#0f2341] text-white px-6 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-md transition-transform hover:scale-105"
          >
            <Phone size={16} /> Call +91 96190 42310
          </a>
        </div>
      </aside>
    </section>
  );
}
