import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useT } from "@/i18n";
import { getProduct, CATEGORY_ORDER } from "@/data/products";
import { site } from "@/config/business";
import { track } from "@/lib/analytics";
import { FieldError, FormStatus } from "./FormStatus";

export type QuoteDraft = {
  name: string;
  method: "phone" | "email";
  phone: string;
  email: string;
  productType: string;
  city: string;
  w: string;
  d: string;
  h: string;
  material: string;
  budget: string;
  message: string;
};

const EMPTY: QuoteDraft = { name: "", method: "phone", phone: "", email: "", productType: "", city: "", w: "", d: "", h: "", material: "", budget: "", message: "" };
const DRAFT_KEY = "bini-quote-draft";
const BUDGETS = ["unsure", "lt300", "b300_700", "b700_1500", "gt1500"] as const;

type Errors = Partial<Record<keyof QuoteDraft, string>>;
type Status = "idle" | "invalid" | "submitting" | "success" | "error";

export function QuoteForm({ productSlug, variation, onClearProduct }: { productSlug?: string | undefined; variation?: string | undefined; onClearProduct?: () => void }) {
  const { lang, t } = useT();
  const f = t.form;
  const [v, setV] = useState<QuoteDraft>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const started = useRef(false);
  const product = productSlug ? getProduct(productSlug) : undefined;
  const variationLabel = product?.variations.find((x) => x.id === variation)?.label[lang];

  // Draft survives language switches and reloads within the session.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) setV({ ...EMPTY, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    if (product && !v.productType) setV((s) => ({ ...s, productType: product.category }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const set = <K extends keyof QuoteDraft>(k: K, val: QuoteDraft[K]) => {
    if (!started.current) { started.current = true; track("quote_form_start", { lang, productId: product?.id }); }
    setV((s) => {
      const next = { ...s, [k]: val };
      try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = f.required;
    if (v.method === "phone") {
      const digits = v.phone.replace(/[\s\-().]/g, "");
      if (!digits) e.phone = f.required;
      else if (!/^\+?\d{7,15}$/.test(digits)) e.phone = f.invalidPhone;
    } else {
      if (!v.email.trim()) e.email = f.required;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = f.invalidEmail;
    }
    if (!v.productType) e.productType = f.required;
    if (!v.city.trim()) e.city = f.required;
    for (const k of ["w", "d", "h"] as const) {
      if (v[k] && !(Number(v[k]) > 0 && Number(v[k]) < 1000)) e[k] = f.invalidNumber;
    }
    if (v.message.trim().length < 10) e.message = v.message.trim() ? f.tooShort : f.required;
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus("invalid");
      const first = Object.keys(e)[0];
      document.getElementById(`q-${first}`)?.focus();
      return;
    }
    if (!site.enquiryBackendConnected) return;
    setStatus("submitting");
    // Real submission is wired in once the enquiry backend is connected.
    setStatus("error");
  };

  const field = (k: keyof QuoteDraft) => ({
    id: `q-${k}`,
    name: k,
    value: v[k],
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `q-${k}-err` : undefined,
    className: "field",
  });

  if (status === "success") return <FormStatus tone="success">{f.success}</FormStatus>;

  const disabled = !site.enquiryBackendConnected || status === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6" aria-describedby={!site.enquiryBackendConnected ? "q-unavailable" : undefined}>
      {!site.enquiryBackendConnected && <div id="q-unavailable"><FormStatus tone="info">{f.unavailable}</FormStatus></div>}
      {status === "invalid" && <FormStatus tone="error">{f.errorsSummary}</FormStatus>}
      {status === "error" && <FormStatus tone="error">{f.failure}</FormStatus>}

      {product && (
        <div className="flex items-center gap-4 border bg-card p-3">
          <img src={product.images[0]!.src} alt="" width={64} height={80} className="h-20 w-16 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">{f.aboutProduct}</p>
            <p className="font-serif text-lg leading-snug">{product.name[lang]}</p>
            {variationLabel && <p className="text-sm">{f.variation}: {variationLabel}</p>}
          </div>
          {onClearProduct && <button type="button" onClick={onClearProduct} className="btn-ghost text-sm">{f.removeProduct}</button>}
        </div>
      )}

      <div>
        <label htmlFor="q-name" className="label">{f.name}</label>
        <input {...field("name")} autoComplete="name" onChange={(e) => set("name", e.target.value)} />
        <FieldError id="q-name-err" message={errors.name} />
      </div>

      <fieldset>
        <legend className="label">{f.contactMethod}</legend>
        <div className="flex flex-wrap gap-2">
          {(["phone", "email"] as const).map((m) => (
            <label key={m} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border bg-card px-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input type="radio" name="method" value={m} checked={v.method === m} onChange={() => set("method", m)} className="accent-primary" />
              {m === "phone" ? f.byPhone : f.byEmail}
            </label>
          ))}
        </div>
      </fieldset>

      {v.method === "phone" ? (
        <div>
          <label htmlFor="q-phone" className="label">{f.phone}</label>
          <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="+383 …" onChange={(e) => set("phone", e.target.value)} aria-describedby={errors.phone ? "q-phone-err" : "q-phone-hint"} />
          <p id="q-phone-hint" className="mt-1.5 text-sm text-muted-foreground">{f.phoneHint}</p>
          <FieldError id="q-phone-err" message={errors.phone} />
        </div>
      ) : (
        <div>
          <label htmlFor="q-email" className="label">{f.email}</label>
          <input {...field("email")} type="email" inputMode="email" autoComplete="email" onChange={(e) => set("email", e.target.value)} />
          <FieldError id="q-email-err" message={errors.email} />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="q-productType" className="label">{f.productType}</label>
          <select {...field("productType")} onChange={(e) => set("productType", e.target.value)}>
            <option value="">{f.choose}</option>
            {[...CATEGORY_ORDER, "other" as const].map((c) => <option key={c} value={c}>{t.categories[c]}</option>)}
          </select>
          <FieldError id="q-productType-err" message={errors.productType} />
        </div>
        <div>
          <label htmlFor="q-city" className="label">{f.city}</label>
          <input {...field("city")} autoComplete="address-level2" onChange={(e) => set("city", e.target.value)} />
          <FieldError id="q-city-err" message={errors.city} />
        </div>
      </div>

      <fieldset>
        <legend className="label">{f.dimensions}</legend>
        <p id="q-dim-hint" className="-mt-1 mb-2 text-sm text-muted-foreground">{f.dimensionsHint}</p>
        <div className="grid grid-cols-3 gap-3">
          {(["w", "d", "h"] as const).map((k) => (
            <div key={k}>
              <label htmlFor={`q-${k}`} className="mb-1 block text-sm">{k === "w" ? f.width : k === "d" ? f.depth : f.height}</label>
              <div className="relative">
                <input {...field(k)} inputMode="decimal" className="field pr-10" onChange={(e) => set(k, e.target.value.replace(",", "."))} />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{f.cm}</span>
              </div>
              <FieldError id={`q-${k}-err`} message={errors[k]} />
            </div>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="q-material" className="label">{f.material}</label>
          <input {...field("material")} onChange={(e) => set("material", e.target.value)} />
        </div>
        <div>
          <label htmlFor="q-budget" className="label">{f.budget}</label>
          <select {...field("budget")} onChange={(e) => set("budget", e.target.value)}>
            <option value="">{f.choose}</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{f.budgetOptions[b]}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="q-message" className="label">{f.message}</label>
        <textarea {...field("message")} rows={5} onChange={(e) => set("message", e.target.value)} aria-describedby={errors.message ? "q-message-err" : "q-message-hint"} />
        <p id="q-message-hint" className="mt-1.5 text-sm text-muted-foreground">{f.messageHint}</p>
        <FieldError id="q-message-err" message={errors.message} />
      </div>

      <div className="flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {f.privacyNote}{" "}
          <Link to="/$lang/privacy" params={{ lang }} className="link-u">{f.privacyLink}</Link>
        </p>
        <button type="submit" className="btn-primary sm:min-w-48" disabled={disabled} aria-disabled={disabled}>
          {status === "submitting" ? f.submitting : f.submit}
        </button>
      </div>
    </form>
  );
}
