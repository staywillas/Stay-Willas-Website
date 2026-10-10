import Link from "next/link";
import { blogsData } from "@/data/blogs";

export default function GuideLinks({ slugs, title = "Plan your stay" }: { slugs: string[]; title?: string }) {
  const guides = slugs.map(slug => blogsData.find(blog => blog.slug === slug)).filter(blog => Boolean(blog));
  return (
    <section className="my-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8" aria-label={title}>
      <h2 className="mb-4 text-2xl font-heading font-bold text-[#1B3564]">{title}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {guides.map(guide => guide && (
          <li key={guide.slug}>
            <Link href={`/blog/${guide.slug}`} className="block rounded-lg p-2 font-medium text-[#1B3564] underline underline-offset-4 hover:text-[#785c12]">
              {guide.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
