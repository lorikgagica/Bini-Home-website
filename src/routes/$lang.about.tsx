import { createFileRoute, Link } from "@tanstack/react-router";
import { getDict, isLang, seo, useT } from "@/i18n";
import dining from "@/assets/dining-a.jpg";

export const Route = createFileRoute("/$lang/about")({
  head: ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : "sq";
    const t = getDict(lang);
    return seo(lang, "/about", t.meta.aboutTitle, t.meta.aboutDesc);
  },
  component: About,
});

function About() {
  const { lang, t } = useT();
  return (
    <div className="container-site py-12 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h1 className="mt-4 text-4xl sm:text-5xl">{t.about.pageTitle}</h1>
          <p className="mt-6 text-xl leading-relaxed text-foreground/85">{t.about.pageIntro}</p>
          <div className="mt-10 max-w-prose space-y-5">
            {t.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl">{t.about.abroadTitle}</h2>
            <p className="mt-3 max-w-prose text-muted-foreground">{t.about.abroadBody}</p>
            <Link to="/$lang/custom" params={{ lang }} hash="enquiry" className="btn-primary mt-6">{t.nav.quote}</Link>
          </div>
        </div>
        <figure className="lg:col-span-5 lg:col-start-8">
          <img src={dining} alt={t.categories.dining} width={1024} height={1280} loading="lazy" className="aspect-[4/5] w-full object-cover" />
        </figure>
      </div>
    </div>
  );
}
