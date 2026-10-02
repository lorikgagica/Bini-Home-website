import { createFileRoute, Link } from "@tanstack/react-router";
import { getDict, isLang, seo, useT } from "@/i18n";
import { business } from "@/config/business";
import { Address, ContactMethods, MapLink } from "@/components/site/ContactDetails";

export const Route = createFileRoute("/$lang/contact")({
  head: ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : "sq";
    const t = getDict(lang);
    return seo(lang, "/contact", t.meta.contactTitle, t.meta.contactDesc);
  },
  component: Contact,
});

function Contact() {
  const { lang, t } = useT();
  return (
    <div className="container-site py-12 lg:py-16">
      <header className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl">{t.contactPage.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t.contactPage.intro}</p>
      </header>
      <dl className="mt-12 grid gap-px border bg-border sm:grid-cols-3">
        <div className="bg-card p-6">
          <dt className="eyebrow mb-3">{t.location.addressLabel}</dt>
          <dd className="text-lg"><Address /><div className="mt-4 text-base"><MapLink className="btn-outline" /></div></dd>
        </div>
        <div className="bg-card p-6">
          <dt className="eyebrow mb-3">{t.location.hoursLabel}</dt>
          <dd className="text-muted-foreground">{business.openingHours?.[lang] ?? t.location.hoursUnset}</dd>
        </div>
        <div className="bg-card p-6">
          <dt className="eyebrow mb-3">{t.location.contactLabel}</dt>
          <dd><ContactMethods /></dd>
        </div>
      </dl>
      <div className="mt-12 flex flex-wrap items-center gap-6 border-t pt-10">
        <p className="max-w-md text-lg">{t.custom.formIntro}</p>
        <Link to="/$lang/custom" params={{ lang }} hash="enquiry" className="btn-primary">{t.contactPage.formCta}</Link>
      </div>
    </div>
  );
}
