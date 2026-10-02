<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- All public pages live under `src/routes/$lang.*` with identical slugs per language — language switching just swaps the prefix.
- UI text lives only in `src/i18n/locales/*.ts` (sq is the source type) — keeps four languages in sync via TypeScript.
- Business facts live in `src/config/business.ts`; unset values stay `undefined` and their UI hides — never guess contact details.
- Catalogue data lives in `src/data/products.ts`; demo records are filtered out when `site.demoMode` is false — prevents demo stock going live.
- Custom component classes are declared with `@utility` in styles.css, never `@layer components` + chained `@apply` — Tailwind v4 rejects the latter.
