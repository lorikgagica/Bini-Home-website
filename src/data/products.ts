import type { Lang } from "@/i18n";
import { site } from "@/config/business";
import coffeeA from "@/assets/coffee-a.jpg";
import coffeeB from "@/assets/coffee-b.jpg";
import diningA from "@/assets/dining-a.jpg";
import diningB from "@/assets/dining-b.jpg";
import tvA from "@/assets/tv-a.jpg";
import wardrobeA from "@/assets/wardrobe-a.jpg";
import detail from "@/assets/detail.jpg";

export type CategoryId = "coffee" | "dining" | "tv" | "wardrobe";
/** Order shown in filters. Categories without visible products are hidden automatically. */
export const CATEGORY_ORDER: CategoryId[] = ["coffee", "dining", "tv", "wardrobe"];

type L10n = Record<Lang, string>;
export type Availability = "showroom" | "in_stock" | "made_to_order";

export interface Product {
  id: string;
  slug: string;
  category: CategoryId;
  /** Demonstration record — shown only while site.demoMode is true. */
  demo: boolean;
  published: boolean;
  featured: boolean;
  images: { src: string; width: number; height: number; alt: L10n }[];
  name: L10n;
  description: L10n;
  /** Confirmed starting price in EUR plus the configuration it covers. */
  price: { amount: number; config: L10n } | null;
  availability: Availability | null;
  /** Confirmed dimensions in centimetres. */
  dimensions: { w: number; d: number; h: number } | null;
  materials: L10n | null;
  /** Only options the business can actually provide. */
  variations: { id: string; label: L10n }[];
  customisable: boolean;
}

const img = (src: string, alt: L10n) => ({ src, width: 1024, height: 1280, alt });
const detailImg = img(detail, {
  sq: "Detaj i këndit dhe strukturës së drurit",
  en: "Detail of the corner and wood grain",
  fr: "Détail de l’angle et du veinage du bois",
  de: "Detail der Ecke und Holzmaserung",
});

const demoDesc: L10n = {
  sq: "Model demonstrues që tregon si do të paraqiten produktet. Përshkrimi i vërtetë do të shtohet pasi Bini Home të konfirmojë detajet.",
  en: "A demonstration model showing how products will be presented. The real description will be added once Bini Home confirms the details.",
  fr: "Modèle de démonstration montrant la présentation des produits. La description réelle sera ajoutée après confirmation par Bini Home.",
  de: "Ein Demonstrationsmodell, das zeigt, wie Produkte präsentiert werden. Die echte Beschreibung folgt, sobald Bini Home die Details bestätigt.",
};

const base = { demo: true, published: true, price: null, availability: null, dimensions: null, materials: null, variations: [] as Product["variations"], customisable: true };

const ALL: Product[] = [
  {
    ...base, id: "demo-coffee-round", slug: "tavoline-kafeje-e-rrumbullaket", category: "coffee", featured: true,
    name: { sq: "Tavolinë kafeje e rrumbullakët", en: "Round coffee table", fr: "Table basse ronde", de: "Runder Couchtisch" },
    description: demoDesc,
    images: [img(coffeeA, { sq: "Tavolinë kafeje e rrumbullakët me ngjyrë druri të çelët", en: "Round light-wood coffee table", fr: "Table basse ronde en bois clair", de: "Runder Couchtisch in hellem Holzton" }), detailImg],
  },
  {
    ...base, id: "demo-coffee-shelf", slug: "tavoline-kafeje-me-raft", category: "coffee", featured: true,
    name: { sq: "Tavolinë kafeje me raft", en: "Coffee table with shelf", fr: "Table basse avec étagère", de: "Couchtisch mit Ablage" },
    description: demoDesc,
    images: [img(coffeeB, { sq: "Tavolinë kafeje drejtkëndëshe e errët me raft poshtë", en: "Dark rectangular coffee table with a lower shelf", fr: "Table basse rectangulaire foncée avec étagère inférieure", de: "Dunkler rechteckiger Couchtisch mit unterer Ablage" }), detailImg],
  },
  {
    ...base, id: "demo-dining-rect", slug: "tavoline-ngrenieje-drejtkendeshe", category: "dining", featured: true,
    name: { sq: "Tavolinë ngrënieje drejtkëndëshe", en: "Rectangular dining table", fr: "Table à manger rectangulaire", de: "Rechteckiger Esstisch" },
    description: demoDesc,
    images: [img(diningA, { sq: "Tavolinë ngrënieje drejtkëndëshe me katër karrige", en: "Rectangular dining table with four chairs", fr: "Table à manger rectangulaire avec quatre chaises", de: "Rechteckiger Esstisch mit vier Stühlen" }), detailImg],
  },
  {
    ...base, id: "demo-dining-oval", slug: "tavoline-ngrenieje-ovale", category: "dining", featured: true,
    name: { sq: "Tavolinë ngrënieje ovale", en: "Oval dining table", fr: "Table à manger ovale", de: "Ovaler Esstisch" },
    description: demoDesc,
    images: [img(diningB, { sq: "Tavolinë ngrënieje ovale me një këmbë qendrore", en: "Oval dining table with a central pedestal", fr: "Table à manger ovale à pied central", de: "Ovaler Esstisch mit Mittelfuß" })],
  },
  {
    ...base, id: "demo-tv-slatted", slug: "komode-tv-me-dyer-rreshqitese", category: "tv", featured: false,
    name: { sq: "Komodë TV me dyer rrëshqitëse", en: "TV unit with sliding doors", fr: "Meuble TV à portes coulissantes", de: "TV-Möbel mit Schiebetüren" },
    description: demoDesc,
    images: [img(tvA, { sq: "Komodë e ulët TV prej druri me dyer me listela", en: "Low wooden TV unit with slatted doors", fr: "Meuble TV bas en bois à portes à lattes", de: "Niedriges TV-Möbel aus Holz mit Lamellentüren" })],
  },
  {
    ...base, id: "demo-wardrobe-2door", slug: "garderobe-me-dy-dyer", category: "wardrobe", featured: false,
    name: { sq: "Garderobë me dy dyer", en: "Two-door wardrobe", fr: "Armoire à deux portes", de: "Zweitüriger Kleiderschrank" },
    description: demoDesc,
    images: [img(wardrobeA, { sq: "Garderobë e lartë me dy dyer dhe doreza druri", en: "Tall two-door wardrobe with wooden handles", fr: "Grande armoire à deux portes avec poignées en bois", de: "Hoher zweitüriger Kleiderschrank mit Holzgriffen" })],
  },
];

/** Public catalogue: published products, demo records only in demo mode. */
export const products: Product[] = ALL.filter((p) => p.published && (site.demoMode || !p.demo));

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const activeCategories = (): CategoryId[] =>
  CATEGORY_ORDER.filter((c) => products.some((p) => p.category === c));
