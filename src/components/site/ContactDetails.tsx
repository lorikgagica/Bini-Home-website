import { addressSearchUrl, business } from "@/config/business";
import { useT } from "@/i18n";
import { track } from "@/lib/analytics";

export function Address() {
  const { lang } = useT();
  return (
    <address className="not-italic">
      {business.address.street}
      <br />
      {business.address.city}, {business.address.country[lang]}
    </address>
  );
}

export function MapLink({ className }: { className?: string }) {
  const { t } = useT();
  return (
    <a href={business.verifiedMapUrl ?? addressSearchUrl} target="_blank" rel="noopener noreferrer" className={className ?? "link-u"} onClick={() => track("contact_click", { method: "map" })}>
      {t.location.directions}
    </a>
  );
}

/** Renders only contact methods with a verified destination. */
export function ContactMethods() {
  const { t } = useT();
  const items = [
    business.phone && { label: t.location.phone, value: business.phone, href: `tel:${business.phone.replace(/\s/g, "")}`, method: "phone" as const },
    business.email && { label: t.location.email, value: business.email, href: `mailto:${business.email}`, method: "email" as const },
    business.messagingUrl && { label: t.location.messaging, value: business.messagingUrl.replace(/^https?:\/\//, ""), href: business.messagingUrl, method: "messaging" as const },
  ].filter(Boolean) as { label: string; value: string; href: string; method: "phone" | "email" | "messaging" }[];

  if (!items.length) return <p className="text-muted-foreground">{t.location.contactUnset}</p>;
  return (
    <ul className="space-y-1">
      {items.map((i) => (
        <li key={i.label}>
          <span className="text-muted-foreground">{i.label}: </span>
          <a className="link-u" href={i.href} onClick={() => track("contact_click", { method: i.method })}>{i.value}</a>
        </li>
      ))}
    </ul>
  );
}
