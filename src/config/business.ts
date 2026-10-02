/**
 * Central business configuration.
 * Leave values `undefined` until the owner confirms them — unset contact
 * methods are hidden automatically across the site.
 */
export const business = {
  brandName: "Bini Home",
  address: {
    street: "Rruga Tregu",
    city: "Gjilan",
    country: { sq: "Kosovë", en: "Kosovo", fr: "Kosovo", de: "Kosovo" },
  },
  /** Confirmed international phone, e.g. "+383 44 000 000". */
  phone: undefined as string | undefined,
  email: undefined as string | undefined,
  /** Full WhatsApp/Viber link once confirmed, e.g. "https://wa.me/383..." */
  messagingUrl: undefined as string | undefined,
  social: {
    instagram: undefined as string | undefined,
    facebook: undefined as string | undefined,
  },
  /** Opening hours per language, once confirmed. */
  openingHours: undefined as Record<"sq" | "en" | "fr" | "de", string> | undefined,
  /** Verified map URL (exact pin). Until set, an address search link is used. */
  verifiedMapUrl: undefined as string | undefined,
  /** Delivery information, once coverage is confirmed. */
  delivery: undefined as Record<"sq" | "en" | "fr" | "de", string> | undefined,
} as const;

export const site = {
  url: "https://project--b519f53e-49b9-463c-897f-04c377fbb959.lovable.app",
  /**
   * Preview/demo mode. While true: demonstration products are shown, a notice
   * banner appears and every page is marked noindex. Set to false only once
   * real products and business details are approved — demo records are then
   * excluded from the catalogue automatically.
   */
  demoMode: true,
  /** Becomes true once the enquiry backend is connected. */
  enquiryBackendConnected: false,
};

export const addressSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Rruga Tregu, Gjilan, Kosovo",
)}`;
