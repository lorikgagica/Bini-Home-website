import { createFileRoute, redirect } from "@tanstack/react-router";
import { getPreferredLang } from "@/lib/lang.functions";
import { isLang, LANG_STORAGE_KEY } from "@/i18n";

// Root URL: Albanian by default, or the language the visitor explicitly chose before.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bini Home | Tavolina dhe mobilje me porosi në Gjilan" },
      { name: "description", content: "Tavolina kafeje, tavolina ngrënieje dhe mobilje me porosi në Gjilan." },
      { property: "og:title", content: "Bini Home | Tavolina dhe mobilje me porosi në Gjilan" },
      { property: "og:description", content: "Tavolina kafeje, tavolina ngrënieje dhe mobilje me porosi në Gjilan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: async () => {
    let lang: string = "sq";
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(stored)) lang = stored;
    } else {
      lang = await getPreferredLang();
    }
    throw redirect({ to: "/$lang", params: { lang } });
  },
});
