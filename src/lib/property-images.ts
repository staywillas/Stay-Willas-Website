// Versioned URLs cover database image paths without changing any records.
const WILLOW_GRADE_VERSION = "graded-v1";

export function resolvePropertyImage(source: string): string {
  if (!WILLOW_GRADE_VERSION) return source;
  let path = source;
  if (source.startsWith("http")) {
    const url = new URL(source);
    if (!["staywillas.com", "www.staywillas.com", "localhost", "127.0.0.1"].includes(url.hostname)) return source;
    path = url.pathname;
  }
  path = decodeURIComponent(path.split(/[?#]/)[0]);
  if (path === "/images/sitelinks/willow-peak-chalets.webp") {
    return `/assets/villas/willow-peak/${WILLOW_GRADE_VERSION}/chalets-night.webp`;
  }
  const match = path.match(/^\/assets\/villas\/willow-peak\/(?:wp-(\d+)|gallery-(\d+)|(main))\.webp$/);
  if (!match) return source;
  const index = match[3] ? 1 : Number(match[1] || match[2]);
  if (index < 1 || index > 10) return source;
  return `/assets/villas/willow-peak/${WILLOW_GRADE_VERSION}/wp-${String(index).padStart(2, "0")}.webp`;
}
