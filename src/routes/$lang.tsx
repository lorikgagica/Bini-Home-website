import { createFileRoute, Link, notFound, Outlet, useRouterState } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { isLang, useT } from "@/i18n";

export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!isLang(params.lang)) throw notFound();
  },
  component: LangLayout,
  notFoundComponent: LangNotFound,
});

function LangLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="flex-1">
        <div key={pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function LangNotFound() {
  const { lang, t } = useT();
  return (
    <div className="container-site py-32 text-center">
      <h1 className="text-4xl">{t.notFound.title}</h1>
      <p className="mt-3 text-muted-foreground">{t.notFound.body}</p>
      <Link to="/$lang" params={{ lang }} className="btn-primary mt-8">{t.notFound.home}</Link>
    </div>
  );
}
