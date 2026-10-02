import { Link } from "@tanstack/react-router";
import { fmt, formatEUR, useT } from "@/i18n";
import type { Product } from "@/data/products";

export function PriceLabel({ product }: { product: Product }) {
  const { lang, t } = useT();
  if (!product.price) return <>{t.product.priceOnRequest}</>;
  return <>{fmt(t.product.from, { price: formatEUR(product.price.amount, lang) })}</>;
}

export function ProductCard({ product, eager = false }: { product: Product; eager?: boolean }) {
  const { lang, t } = useT();
  const image = product.images[0]!;
  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone">
        <img
          src={image.src}
          alt={image.alt[lang]}
          width={image.width}
          height={image.height}
          loading={eager ? "eager" : "lazy"}
          className="img-zoom h-full w-full object-cover"
        />
        {product.demo && (
          <span className="absolute left-3 top-3 rounded-sm bg-background/90 px-2 py-0.5 text-xs text-muted-foreground">{t.demo.badge}</span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{t.categories[product.category]}</p>
          <h3 className="mt-1 font-serif text-xl leading-snug">
            <Link to="/$lang/products/$slug" params={{ lang, slug: product.slug }} className="after:absolute after:inset-0">
              {product.name[lang]}
            </Link>
          </h3>
        </div>
        <p className="shrink-0 pt-5 text-right text-sm text-muted-foreground"><PriceLabel product={product} /></p>
      </div>
      <span className="mt-2 inline-block text-sm text-primary underline-offset-4 group-hover:underline">{t.product.view} →</span>
    </article>
  );
}
