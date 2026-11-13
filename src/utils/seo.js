import { resources } from "../i18n/resources.js";
import { services } from "../data/services.js";
import { projects } from "../data/projects.js";
export const SITE_URL = (
  import.meta.env?.VITE_SITE_URL || "https://jreaslab-global.vercel.app"
).replace(/\/$/, "");
export function publicPaths() {
  return ["ar", "en"].flatMap((lang) =>
    [
      "",
      "/services",
      ...services.map((s) => `/services/${s.slug}`),
      "/work",
      ...projects.map((p) => `/work/${p.slug}`),
      "/about",
      "/contact",
    ].map((p) => `/${lang}${p}`),
  );
}
export function getMeta(pathname) {
  const clean = pathname.replace(/\/$/, "") || "/ar";
  const segments = clean.split("/").filter(Boolean),
    lang = segments[0] === "en" ? "en" : "ar",
    r = resources[lang].translation;
  const page = segments[1] || "home";
  let title = r.seo[page] || r.seo.home,
    description =
      {
        services: r.services.description,
        work: r.work.description,
        about: r.about.description,
        contact: r.contact.description,
      }[page] || r.seo.description;
  let valid = publicPaths().includes(clean);
  if (segments[1] === "services" && segments[2]) {
    const s = services.find((s) => s.slug === segments[2]);
    if (s) {
      title = `${s[lang].title} | Jreas Lab`;
      description = s[lang].short;
    }
  }
  if (segments[1] === "work" && segments[2]) {
    const p = projects.find((p) => p.slug === segments[2]);
    if (p) {
      title = `${p[lang].title} — ${r.common.concept} | Jreas Lab`;
      description = p[lang].summary;
    }
  }
  if (!valid) {
    title = `404 | Jreas Lab`;
    description = r.common.notfound;
  }
  const suffix = segments.slice(1).join("/");
  return {
    title,
    description,
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    url: `${SITE_URL}${clean}`,
    ar: `${SITE_URL}/ar${suffix ? "/" + suffix : ""}`,
    en: `${SITE_URL}/en${suffix ? "/" + suffix : ""}`,
    valid,
  };
}
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function renderHead(meta) {
  const m = meta;
  return `<title>${escape(m.title)}</title><meta name="description" content="${escape(m.description)}"/><meta name="robots" content="${m.valid ? "index,follow" : "noindex,follow"}"/><link rel="canonical" href="${m.url}"/><link rel="alternate" hreflang="ar" href="${m.ar}"/><link rel="alternate" hreflang="en" href="${m.en}"/><link rel="alternate" hreflang="x-default" href="${m.ar}"/><meta property="og:type" content="website"/><meta property="og:site_name" content="Jreas Lab"/><meta property="og:title" content="${escape(m.title)}"/><meta property="og:description" content="${escape(m.description)}"/><meta property="og:url" content="${m.url}"/><meta property="og:locale" content="${m.lang === "ar" ? "ar_PS" : "en_US"}"/><meta property="og:image" content="${SITE_URL}/images/og-cover.png"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${escape(m.title)}"/><meta name="twitter:description" content="${escape(m.description)}"/><meta name="twitter:image" content="${SITE_URL}/images/og-cover.png"/><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Jreas Lab", url: SITE_URL, logo: `${SITE_URL}/images/logo-dark.svg`, email: "info@jreaslab.com", telephone: "+970597747340", sameAs: ["https://www.linkedin.com/company/jreas-lab1/", "https://www.instagram.com/jreas_lab/", "https://x.com/JreasLab"], contactPoint: { "@type": "ContactPoint", contactType: "customer service", email: "info@jreaslab.com", availableLanguage: ["Arabic", "English"] } })}</script>`;
}
export function applyMeta(meta) {
  document.title = meta.title;
  const temp = document.createElement("template");
  temp.innerHTML = renderHead(meta);
  document.head
    .querySelectorAll(
      'meta[name="description"],meta[name="robots"],link[rel="canonical"],link[rel="alternate"][hreflang],meta[property^="og:"],meta[name^="twitter:"],script[type="application/ld+json"]',
    )
    .forEach((n) => n.remove());
  Array.from(temp.content.children)
    .filter((n) => n.tagName !== "TITLE")
    .forEach((n) => document.head.appendChild(n));
}
