/**
 * Lightweight, privacy-safe event tracking.
 * Only event names and non-personal properties (product id, language) are allowed.
 * No provider is connected yet — events are inactive until a consent-aware
 * analytics setup is configured.
 */
type EventName = "product_view" | "quote_form_start" | "quote_submit_success" | "contact_click";
type Props = { productId?: string | undefined; lang?: string; method?: "phone" | "email" | "messaging" | "map" };

export function track(event: EventName, props: Props = {}) {
  if (import.meta.env.DEV) console.debug("[analytics]", event, props);
}
