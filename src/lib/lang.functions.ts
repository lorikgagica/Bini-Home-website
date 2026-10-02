import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const getPreferredLang = createServerFn({ method: "GET" }).handler(async () => {
  const v = getCookie("bini-lang");
  return ["sq", "en", "fr", "de"].includes(v ?? "") ? (v as string) : "sq";
});
