import { createFileRoute } from "@tanstack/react-router";
import { getDict, isLang, seo, useT } from "@/i18n";

export const Route = createFileRoute("/$lang/privacy")({
  head: ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : "sq";
    const t = getDict(lang);
    return seo(lang, "/privacy", t.meta.privacyTitle, t.meta.privacyDesc);
  },
  component: Privacy,
});

function Privacy() {
  const { t } = useT();
  return (
    <div className="container-site max-w-3xl py-12 lg:py-16">
      <h1 className="text-4xl sm:text-5xl">{t.privacy.title}</h1>
      <p className="mt-5 text-lg text-muted-foreground">{t.privacy.intro}</p>
      <div className="mt-12 space-y-10">
        {t.privacy.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-2xl">{s.h}</h2>
            <p className="mt-3">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
