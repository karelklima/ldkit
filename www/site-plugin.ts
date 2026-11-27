// Vite plugin that turns the Preact pages in routes.tsx into a static site
// during `vp build`: every route is rendered to an HTML file next to the
// hashed stylesheet, then TypeDoc writes the API reference to dist/api.
//
// The TypeDoc pages get the site header and footer (routes.tsx
// `renderApiChrome`), styled by their own small stylesheet, styles/api.css.
// The build also writes dist/_redirects for the old API URLs and fails if any
// internal link in dist/ is broken.
//
// To preview the built site locally, run `netlify serve` in the repo root.

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  Application,
  type DeclarationReflection,
  JSX,
  type ProjectReflection,
  TSConfigReader,
  TypeDocReader,
} from "typedoc";
import { type Plugin, runnerImport } from "vite-plus";

import { findBrokenLinks, resolvesTo } from "./lib/links.ts";
import { type ApiSymbol, formatRedirects, legacyApiRedirects } from "./lib/redirects.ts";

type RoutesModule = typeof import("./routes.tsx");
type ApiChrome = ReturnType<RoutesModule["renderApiChrome"]>;

const STYLESHEET = "styles/site.css";
const API_STYLESHEET = "styles/api.css";

/** JSX settings for the Preact pages, shared with vite.config.ts. */
export const JSX_OPTIONS = {
  jsx: { runtime: "automatic", importSource: "preact" },
} as const;

export function ldkitSite(): Plugin {
  let root = process.cwd();
  let outDir = "dist";
  let apiChrome: ApiChrome = { header: "", footer: "" };

  return {
    name: "ldkit-site",
    apply: "build",
    config() {
      // Stylesheets are the only bundle entries; pages are emitted as assets.
      return {
        build: {
          rollupOptions: { input: { site: STYLESHEET, api: API_STYLESHEET } },
        },
      };
    },
    configResolved(config) {
      root = config.root;
      outDir = resolve(config.root, config.build.outDir);
    },
    async generateBundle(_options, bundle) {
      let siteFile: string | undefined;
      let apiFile: string | undefined;
      for (const [fileName, output] of Object.entries(bundle)) {
        if (output.type === "asset" && fileName.endsWith(".css")) {
          if (fileName.startsWith("assets/site-")) siteFile = fileName;
          if (fileName.startsWith("assets/api-")) apiFile = fileName;
        } else if (output.type === "chunk" && output.code.trim() === "") {
          // A CSS-only entry leaves an empty JavaScript chunk behind.
          delete bundle[fileName];
        }
      }
      if (!siteFile || !apiFile) {
        this.error(`Stylesheets ${STYLESHEET} and ${API_STYLESHEET} were not built`);
      }

      const { module } = await runnerImport<RoutesModule>(resolve(root, "routes.tsx"), {
        root,
        configFile: false,
        logLevel: "warn",
        oxc: JSX_OPTIONS,
      });
      for (const route of [...module.routes, module.notFound]) {
        this.emitFile({
          type: "asset",
          fileName: route.file,
          source: module.renderRoute(route, `/${siteFile}`),
        });
      }
      apiChrome = module.renderApiChrome(`/${apiFile}`);
    },
    async closeBundle() {
      const apiDir = join(outDir, "api");
      const project = await generateApi(root, apiDir, apiChrome);

      const symbols = await apiSymbols(project, apiDir);
      const modules = (project.children ?? [])
        .map((m) => m.name)
        .filter((name) => resolvesTo(apiDir, `/${name}/`));
      await writeFile(
        join(outDir, "_redirects"),
        formatRedirects(legacyApiRedirects(modules, symbols)),
      );

      const broken = await findBrokenLinks(outDir);
      if (broken.length > 0) {
        const list = broken.map((b) => `  ${b.page} -> ${b.href} (${b.reason})`).join("\n");
        throw new Error(`Found ${broken.length} broken internal links:\n${list}`);
      }
    },
  };
}

async function generateApi(
  root: string,
  out: string,
  chrome: ApiChrome,
): Promise<ProjectReflection> {
  const app = await Application.bootstrapWithPlugins({ options: resolve(root, "typedoc.json") }, [
    new TypeDocReader(),
    new TSConfigReader(),
  ]);
  app.renderer.hooks.on("body.begin", () => JSX.createElement(JSX.Raw, { html: chrome.header }));
  app.renderer.hooks.on("footer.begin", () => JSX.createElement(JSX.Raw, { html: chrome.footer }));
  const project = await app.convert();
  if (!project) {
    throw new Error("TypeDoc failed to convert the LDkit sources");
  }
  await app.generateDocs(project, out);
  // The structure-dir router gives every page a clean URL, except that pages
  // in the output root link to the API index as `index.html`.
  for (const file of await readdir(out)) {
    if (!file.endsWith(".html")) continue;
    const path = join(out, file);
    const html = await readFile(path, "utf8");
    await writeFile(path, html.replaceAll('href="index.html"', 'href="./"'));
  }
  if (app.logger.hasErrors()) {
    throw new Error("TypeDoc reported errors, see above");
  }
  return project;
}

/** Exported symbols that have a page, with the members anchored on it. */
async function apiSymbols(project: ProjectReflection, apiDir: string): Promise<ApiSymbol[]> {
  const symbols: ApiSymbol[] = [];
  for (const module of project.children ?? []) {
    for (const symbol of module.children ?? []) {
      // A re-export is documented on the page of the symbol it refers to.
      const target = symbol.isReference() ? symbol.getTargetReflectionDeep() : symbol;
      if (!target.isDeclaration() || !target.parent) continue;
      const page = `/${target.parent.name}/${target.name}/`;
      if (!resolvesTo(apiDir, page)) continue;
      const html = await readFile(join(apiDir, page, "index.html"), "utf8");
      const members = (target.children ?? [])
        .map((member: DeclarationReflection) => member.name)
        .filter((name) => name !== "constructor")
        .filter((name) => html.includes(`id="${name.toLowerCase()}"`));
      symbols.push({ module: module.name, name: symbol.name, page: `/api${page}`, members });
    }
  }
  return symbols;
}
