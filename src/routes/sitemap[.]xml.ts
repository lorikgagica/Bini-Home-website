import { createFileRoute } from "@tanstack/react-router";
import { LANGS } from "@/i18n";
import { products } from "@/data/products";
import { site } from "@/config/business";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = ["", "/products", "/custom", "/about", "/contact", "/privacy", ...products.map((p) => `/products/${p.slug}`)];
        const urls = paths.map((path) => {
          const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${site.url}/${l}${path}"/>`).join("");
          return LANGS.map((l) => `<url><loc>${site.url}/${l}${path}</loc>${alts}</url>`).join("");
        }).join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
