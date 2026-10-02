import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fmt, formatEUR, getDict, isLang, seo, useT } from "@/i18n";
import { getProduct, products } from "@/data/products";
import { ProductGallery } from "@/components/site/ProductGallery";
import { PriceLabel, ProductCard } from "@/components/site/ProductCard";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/$lang/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { slug: product.slug };
  },
  head: ({ params, loaderData }) => {
    const lang = isLang(params.lang) ? params.lang : "sq";
    const t = getDict(lang);
    const p = loaderData ? getProduct(loaderData.slug) : undefined;
    if (!p) return { meta: [{ title: t.notFound.title }, { name: "robots", content: "noindex" }] };
    const title = `${p.name[lang]} | Bini Home`;
    const head = seo(lang, `/products/${p.slug}`, title, fmt(t.meta.productDesc, { name: p.name[lang] }), { type: "product" });
    const ld: Record<string, unknown> = { "@context": "https://schema.org", "@type": "Product", name: p.name[lang], brand: { "@type": "Brand", name: "Bini Home" } };
    if (p.price) ld["offers"] = { "@type": "Offer", priceCurrency: "EUR", price: p.price.amount, ...(p.availability === "in_stock" ? { availability: "https://schema.org/InStock" } : {}) };
    return { ...head, scripts: [{ type: "application/ld+json", children: JSON.stringify(ld) }] };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const { lang, t } = useT();
  const product = getProduct(slug)!;
  const [variation, setVariation] = useState(product.variations[0]?.id);
  const related = products.filter((p) => p.id !== product.id).sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category)).slice(0, 3);
  const hasSpecs = product.dimensions || product.materials || product.price || product.availability;

  useEffect(() => { track("product_view", { productId: product.id, lang }); }, [product.id, lang]);

  const quoteLink = (
    <Link to="/$lang/custom" params={{ lang }} search={{ product: product.slug, variation }} hash="enquiry" className="btn-primary w-full sm:w-auto">
      {t.product.requestQuote}
    </Link>
  );

  return (
    <div className="container-site pb-28 pt-8 lg:pb-12">
      <nav className="text-sm"><Link to="/$lang/products" params={{ lang }} className="link-u">← {t.product.back}</Link></nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7"><ProductGallery product={product} /></div>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">{t.categories[product.category]}</p>
            <h1 className="mt-3 text-4xl sm:text-[2.8rem]">{product.name[lang]}</h1>
            <p className="mt-4 text-lg"><PriceLabel product={product} /></p>
            {product.price && <p className="text-sm text-muted-foreground">{fmt(t.product.priceConfig, { config: product.price.config[lang] })}</p>}
            <p className="mt-6 text-foreground/85">{product.description[lang]}</p>

            {product.variations.length > 0 && (
              <fieldset className="mt-8">
                <legend className="label">{t.product.chooseVariation}</legend>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((o) => (
                    <label key={o.id} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border bg-card px-4 has-[:checked]:border-primary">
                      <input type="radio" name="variation" value={o.id} checked={variation === o.id} onChange={() => setVariation(o.id)} className="accent-primary" />
                      {o.label[lang]}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <dl className="mt-8 divide-y border-y text-[0.95rem]">
              {product.dimensions && (
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3">
                  <dt className="text-muted-foreground">{t.product.dimensions}</dt>
                  <dd>{t.product.dimW} {product.dimensions.w} cm · {t.product.dimD} {product.dimensions.d} cm · {t.product.dimH} {product.dimensions.h} cm</dd>
                </div>
              )}
              {product.materials && (
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-muted-foreground">{t.product.materials}</dt><dd>{product.materials[lang]}</dd></div>
              )}
              {product.availability && (
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-muted-foreground">{t.product.availability}</dt><dd>{t.availability[product.availability]}</dd></div>
              )}
              {product.price && (
                <div className="grid grid-cols-[9rem_1fr] gap-4 py-3"><dt className="text-muted-foreground">€</dt><dd>{formatEUR(product.price.amount, lang)}</dd></div>
              )}
              {!hasSpecs && <div className="py-4 text-muted-foreground">{t.product.unconfirmed}</div>}
            </dl>
            {product.customisable && <p className="mt-4 text-sm text-muted-foreground">{t.product.customNote}</p>}
            {product.demo && <p className="mt-2 text-sm italic text-muted-foreground">{t.product.demoNote}</p>}

            <div className="mt-8 hidden sm:block">{quoteLink}</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24 border-t pt-14" aria-labelledby="rel-h">
          <h2 id="rel-h" className="text-3xl">{t.product.related}</h2>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Mobile quote action */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 backdrop-blur-sm sm:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        {quoteLink}
      </div>
    </div>
  );
}
