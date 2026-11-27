// The site's routes. Each page is a Preact component that the Vite plugin in
// site-plugin.ts renders to a static HTML file during `vp build`.

import type { ComponentChildren, ComponentType } from "preact";
import { renderToString } from "preact-render-to-string";

import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header.tsx";
import { type PageInfo, PageContext } from "./components/Page.ts";
import { SLUGS } from "./lib/docs.ts";
import DocsPage from "./pages/docs.tsx";
import Home from "./pages/index.tsx";
import NotFound from "./pages/404.tsx";
import Ontology from "./pages/ontology/index.tsx";
import OntologyIRI from "./pages/ontology/IRI.tsx";
import OntologyResource from "./pages/ontology/Resource.tsx";

export interface Route {
  /** URL path the page is served at. */
  path: string;
  /** Output file relative to the build output directory. */
  file: string;
  page: ComponentType;
}

export const routes: Route[] = [
  { path: "/", file: "index.html", page: Home },
  // Ontology terms are IRIs, so they are served without a trailing slash
  // (Netlify serves `/ontology/IRI` from `ontology/IRI.html`).
  { path: "/ontology/", file: "ontology/index.html", page: Ontology },
  { path: "/ontology/IRI", file: "ontology/IRI.html", page: OntologyIRI },
  {
    path: "/ontology/Resource",
    file: "ontology/Resource.html",
    page: OntologyResource,
  },
  ...SLUGS.map((slug) => ({
    path: `/docs/${slug}/`,
    file: `docs/${slug}/index.html`,
    page: () => <DocsPage slug={slug} />,
  })),
];

export const notFound: Route = {
  path: "/404",
  file: "404.html",
  page: NotFound,
};

export function renderRoute(route: Route, stylesheet: string): string {
  const Page = route.page;
  const info: PageInfo = { path: route.path, stylesheet };
  const html = renderToString(
    <PageContext.Provider value={info}>
      <Page />
    </PageContext.Provider>,
  );
  return `<!DOCTYPE html>${html}`;
}

/**
 * Renders the site header and footer for the TypeDoc API pages. Each goes into
 * a declarative shadow root (no JavaScript needed), which keeps their Tailwind
 * styles and TypeDoc's styles from affecting each other.
 */
export function renderApiChrome(stylesheet: string): {
  header: string;
  footer: string;
} {
  const info: PageInfo = { path: "/api/", stylesheet };
  const shadow = (className: string, content: ComponentChildren) =>
    renderToString(
      <PageContext.Provider value={info}>
        <div class={className}>
          <template {...{ shadowrootmode: "open" }}>
            <link rel="stylesheet" href={stylesheet} />
            {content}
          </template>
        </div>
      </PageContext.Provider>,
    );
  return {
    header: shadow("ldkit-header", <Header />),
    footer: shadow("ldkit-footer", <Footer />),
  };
}
