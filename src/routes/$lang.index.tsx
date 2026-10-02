import { createFileRoute, Link } from "@tanstack/react-router";
import { getDict, isLang, seo, useT } from "@/i18n";
import { activeCategories, products } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Address, ContactMethods, MapLink } from "@/components/site/ContactDetails";
import { business } from "@/config/business";
import hero from "@/assets/hero.jpg";
import detail from "@/assets/detail.jpg";

export const Route = createFileRoute("/$lang/")({
  head: ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : "sq";
    const t = getDict(lang);
    const ld = {
      "@context": "https://schema.org",
      "@type": "FurnitureStore",
      name: business.brandName,
      address: { "@type": "PostalAddress", streetAddress: business.address.street, addressLocality: business.address.city, addressCountry: "XK" },
      ...(business.phone ? { telephone: business.phone } : {}),
      ...(business.email ? { email: business.email } : {}),
    };
    return { ...seo(lang, "", t.meta.homeTitle, t.meta.homeDesc), scripts: [{ type: "application/ld+json", children: JSON.stringify(ld) }] };
  },
  component: Home,
});

function Home() {
  const { lang, t } = useT();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const cats = activeCategories();

  return (
    <>
      {/* Opening */}
      <section className="container-site grid items-end gap-10 pb-16 pt-10 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-16">
        <div className="lg:col-span-5 lg:pb-10">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 className="mt-5 text-[2.6rem] sm:text-5xl lg:text-[3.9rem]">{t.hero.title}</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">{t.hero.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/$lang/products" params={{ lang }} className="btn-primary">{t.hero.primary}</Link>
            <Link to="/$lang/custom" params={{ lang }} hash="enquiry" className="btn-outline">{t.hero.secondary}</Link>
          </div>
        </div>
        <figure className="lg:col-span-7">
          <img src={hero} alt={t.hero.imageAlt} width={1536} height={1152} fetchPriority="high" className="aspect-[4/3] w-full object-cover" />
          <figcaption className="mt-3 text-right text-xs text-muted-foreground">{t.hero.caption}</figcaption>
        </figure>
      </section>

      {/* Featured */}
      <section className="border-t py-20" aria-labelledby="featured-h">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-lg">
              <h2 id="featured-h" className="text-3xl sm:text-4xl">{t.featured.title}</h2>
              <p className="mt-3 text-muted-foreground">{t.featured.intro}</p>
            </div>
            <Link to="/$lang/products" params={{ lang }} className="link-u">{t.featured.viewAll} →</Link>
          </div>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Categories — a simple index list */}
      <section className="bg-stone/60 py-16" aria-labelledby="cats-h">
        <div className="container-site grid gap-8 lg:grid-cols-12">
          <h2 id="cats-h" className="text-3xl lg:col-span-4">{t.categories.title}</h2>
          <ul className="divide-y border-y border-foreground/15 lg:col-span-8">
            {cats.map((c, i) => (
              <li key={c}>
                <Link to="/$lang/products" params={{ lang }} search={{ category: c }} className="group flex items-baseline gap-6 py-5">
                  <span className="w-8 text-sm tabular-nums text-muted-foreground">0{i + 1}</span>
                  <span className="font-serif text-2xl transition-colors group-hover:text-primary sm:text-3xl">{t.categories[c]}</span>
                  <span className="ml-auto text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Custom orders — image + numbered steps */}
      <section className="py-24" aria-labelledby="custom-h">
        <div className="container-site grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img src={detail} alt={t.customTeaser.imageAlt} width={1024} height={1280} loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">{t.customTeaser.eyebrow}</p>
            <h2 id="custom-h" className="mt-4 text-3xl sm:text-[2.6rem]">{t.customTeaser.title}</h2>
            <p className="mt-5 text-lg text-muted-foreground">{t.customTeaser.body}</p>
            <ol className="mt-10 space-y-7">
              {t.customTeaser.steps.map((s, i) => (
                <li key={i} className="grid grid-cols-[3rem_1fr] gap-2">
                  <span className="font-serif text-3xl leading-none text-primary">{i + 1}</span>
                  <div>
                    <h3 className="font-sans text-base font-semibold">{s.title}</h3>
                    <p className="mt-1 text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/$lang/custom" params={{ lang }} hash="enquiry" className="btn-primary">{t.nav.quote}</Link>
              <Link to="/$lang/custom" params={{ lang }} className="btn-ghost link-u">{t.customTeaser.cta}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* About — quiet text block */}
      <section className="border-y bg-card py-20" aria-labelledby="about-h">
        <div className="container-site grid gap-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3">{t.about.eyebrow}</p>
          <div className="lg:col-span-7">
            <h2 id="about-h" className="text-3xl sm:text-4xl">{t.about.teaserTitle}</h2>
            <p className="mt-5 text-xl leading-relaxed text-foreground/85">{t.about.teaserBody}</p>
            <Link to="/$lang/about" params={{ lang }} className="link-u mt-6 inline-block">{t.about.cta} →</Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="pt-20" aria-labelledby="loc-h">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t.location.eyebrow}</p>
            <h2 id="loc-h" className="mt-4 text-3xl sm:text-4xl">{t.location.title}</h2>
          </div>
          <dl className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            <div>
              <dt className="eyebrow mb-2">{t.location.addressLabel}</dt>
              <dd><Address /><div className="mt-3"><MapLink /></div></dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">{t.location.hoursLabel}</dt>
              <dd className="text-muted-foreground">{business.openingHours?.[lang] ?? t.location.hoursUnset}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">{t.location.contactLabel}</dt>
              <dd><ContactMethods /></dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
