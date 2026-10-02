import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { getDict, isLang, seo, useT } from "@/i18n";
import { QuoteForm } from "@/components/site/QuoteForm";
import detail from "@/assets/detail.jpg";

export const Route = createFileRoute("/$lang/custom")({
  validateSearch: z.object({
    product: z.string().optional().catch(undefined),
    variation: z.string().optional().catch(undefined),
  }),
  head: ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : "sq";
    const t = getDict(lang);
    return seo(lang, "/custom", t.meta.customTitle, t.meta.customDesc);
  },
  component: CustomPage,
});

function CustomPage() {
  const { t } = useT();
  const { product, variation } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <>
      <section className="container-site grid gap-10 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-6">
          <p className="eyebrow">{t.custom.eyebrow}</p>
          <h1 className="mt-4 text-4xl sm:text-5xl">{t.custom.pageTitle}</h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t.custom.pageIntro}</p>
          <h2 className="mt-10 font-sans text-base font-semibold">{t.custom.discussTitle}</h2>
          <ul className="mt-3 space-y-2">
            {t.custom.discussList.map((x) => (
              <li key={x} className="flex gap-3"><span className="mt-[0.7em] h-px w-4 shrink-0 bg-primary" aria-hidden />{x}</li>
            ))}
          </ul>
          <ol className="mt-10 grid gap-6 border-t pt-8 sm:grid-cols-3">
            {t.customTeaser.steps.map((s, i) => (
              <li key={i}>
                <span className="font-serif text-2xl text-primary">{i + 1}</span>
                <h3 className="mt-1 font-sans text-[0.95rem] font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
          <img src={detail} alt={t.customTeaser.imageAlt} width={1024} height={1280} className="aspect-[4/5] w-full object-cover" />
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-24 border-t bg-card py-16" aria-labelledby="form-h">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="form-h" className="text-3xl sm:text-4xl">{t.custom.formTitle}</h2>
            <p className="mt-4 text-muted-foreground">{t.custom.formIntro}</p>
            <div className="mt-8 space-y-3 border-l-2 border-primary pl-4 text-[0.95rem]">
              <p>{t.custom.quoteNote}</p>
              <p>{t.custom.deliveryNote}</p>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <QuoteForm
              productSlug={product}
              variation={variation}
              onClearProduct={() => navigate({ search: {}, replace: true, resetScroll: false })}
            />
          </div>
        </div>
      </section>
    </>
  );
}
