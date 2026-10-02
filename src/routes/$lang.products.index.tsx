import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SlidersHorizontal } from "lucide-react";
import { fmt, getDict, isLang, seo, useT } from "@/i18n";
import { activeCategories, products, type CategoryId } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";

const PER_PAGE = 9;
const searchSchema = z.object({
  category: z.enum(["coffee", "dining", "tv", "wardrobe"]).optional().catch(undefined),
  q: z.string().optional().catch(undefined),
  page: z.number().int().min(1).optional().catch(undefined),
});

export const Route = createFileRoute("/$lang/products/")({
  validateSearch: searchSchema,
  head: ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : "sq";
    const t = getDict(lang);
    return seo(lang, "/products", t.meta.productsTitle, t.meta.productsDesc);
  },
  component: Catalogue,
});

function Catalogue() {
  const { lang, t } = useT();
  const { category, q = "", page = 1 } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [showFilters, setShowFilters] = useState(false);
  const cats = activeCategories();

  const filtered = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase(lang);
    return products.filter((p) => (!category || p.category === category) && (!needle || p.name[lang].toLocaleLowerCase(lang).includes(needle)));
  }, [category, q, lang]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const hasFilters = !!category || !!q;

  const setSearch = (s: { category?: CategoryId | undefined; q?: string | undefined; page?: number | undefined }) =>
    navigate({ search: (prev) => ({ ...prev, page: undefined, ...s }), replace: true, resetScroll: false });

  return (
    <div className="container-site py-12 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl">{t.catalogue.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t.catalogue.intro}</p>
      </header>

      <div className="mt-10 border-y py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1 sm:max-w-xs">
            <label htmlFor="cat-search" className="sr-only">{t.catalogue.search}</label>
            <input
              id="cat-search"
              type="search"
              value={q}
              placeholder={t.catalogue.search}
              onChange={(e) => setSearch({ q: e.target.value || undefined })}
              className="field"
            />
          </div>
          <button type="button" className="btn-outline md:hidden" aria-expanded={showFilters} aria-controls="cat-filters" onClick={() => setShowFilters((s) => !s)}>
            <SlidersHorizontal className="size-4" aria-hidden />
            {showFilters ? t.catalogue.hideFilters : t.catalogue.showFilters}
          </button>
          <div id="cat-filters" role="group" aria-label={t.catalogue.category} className={cn("w-full flex-wrap gap-2 md:flex md:w-auto", showFilters ? "flex" : "hidden")}>
            {[undefined, ...cats].map((c) => {
              const active = category === c;
              return (
                <button
                  key={c ?? "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSearch({ category: c })}
                  className={cn("min-h-11 rounded-sm border px-4 text-sm transition-colors", active ? "border-foreground bg-foreground text-background" : "bg-card hover:border-foreground/50")}
                >
                  {c ? t.categories[c] : t.categories.all}
                </button>
              );
            })}
          </div>
          {hasFilters && (
            <button type="button" className="btn-ghost link-u text-sm" onClick={() => navigate({ search: {}, replace: true, resetScroll: false })}>
              {t.catalogue.reset}
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {filtered.length === 1 ? t.catalogue.resultsOne : fmt(t.catalogue.results, { n: filtered.length })}
      </p>

      {visible.length ? (
        <div className="mt-6 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => <ProductCard key={p.id} product={p} eager={i < 3} />)}
        </div>
      ) : (
        <div className="mt-10 max-w-lg border bg-card p-8">
          <h2 className="text-2xl">{t.catalogue.emptyTitle}</h2>
          <p className="mt-3 text-muted-foreground">{t.catalogue.emptyBody}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn-outline" onClick={() => navigate({ search: {}, replace: true })}>{t.catalogue.reset}</button>
            <Link to="/$lang/custom" params={{ lang }} hash="enquiry" className="btn-primary">{t.catalogue.emptyCta}</Link>
          </div>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label={t.catalogue.pagination} className="mt-14 flex items-center justify-center gap-4">
          <button type="button" className="btn-outline" disabled={current <= 1} onClick={() => navigate({ search: (p) => ({ ...p, page: current - 1 }) })}>{t.catalogue.prev}</button>
          <span className="text-sm">{fmt(t.catalogue.page, { a: current, b: pages })}</span>
          <button type="button" className="btn-outline" disabled={current >= pages} onClick={() => navigate({ search: (p) => ({ ...p, page: current + 1 }) })}>{t.catalogue.next}</button>
        </nav>
      )}
    </div>
  );
}
