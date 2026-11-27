// Checks the links in the built site: every internal `href` and `src` must
// point to a file that exists (resolving URLs the way Netlify serves them),
// and every fragment on an `<a>` link must match an `id` on the target page.

import { existsSync, statSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

/** Origin of the deployed site; absolute links to it are checked too. */
const SITE = "https://ldkit.io";

export interface BrokenLink {
  /** URL path of the page containing the link. */
  page: string;
  /** The link's `href` or `src`. */
  href: string;
  reason: "missing file" | "missing anchor";
}

/** URL path a built HTML file is served at, e.g. `docs/lens/index.html` → `/docs/lens/`. */
export function pageUrl(file: string): string {
  const path = `/${file.split(sep).join("/")}`;
  if (path.endsWith("/index.html")) return path.slice(0, -"index.html".length);
  return path.replace(/\.html$/, "");
}

/** The file in `dir` that `pathname` is served from (`/a` → `a`, `a.html` or `a/index.html`). */
export function resolveFile(dir: string, pathname: string): string | undefined {
  const base = join(dir, decodeURIComponent(pathname));
  const isFile = (path: string) => existsSync(path) && statSync(path).isFile();
  return [base, `${base}.html`, join(base, "index.html")].find(isFile);
}

/** Whether `pathname` resolves to a file in `dir`. */
export function resolvesTo(dir: string, pathname: string): boolean {
  return resolveFile(dir, pathname) !== undefined;
}

/** Internal URL of a link, or `undefined` for external links. */
function internalUrl(href: string, page: string): URL | undefined {
  const url = new URL(href, `${SITE}${page}`);
  return url.origin === SITE ? url : undefined;
}

export async function findBrokenLinks(dir: string): Promise<BrokenLink[]> {
  const files = (await readdir(dir, { recursive: true })).filter((f) => f.endsWith(".html"));

  const idCache = new Map<string, Set<string>>();
  const idsOf = async (file: string) => {
    let ids = idCache.get(file);
    if (!ids) {
      const html = await readFile(file, "utf8");
      ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
      idCache.set(file, ids);
    }
    return ids;
  };

  const broken: BrokenLink[] = [];
  for (const file of files) {
    const page = pageUrl(relative(dir, join(dir, file)));
    const html = await readFile(join(dir, file), "utf8");
    for (const [, tag, attributes] of html.matchAll(/<([a-zA-Z][\w-]*)\b([^>]*)>/g)) {
      for (const [, , href] of attributes.matchAll(/\s(href|src)="([^"]*)"/g)) {
        if (!href || href === "#") continue;
        const url = internalUrl(href, page);
        if (!url) continue;

        const target = href.startsWith("#") ? join(dir, file) : resolveFile(dir, url.pathname);
        if (!target) {
          broken.push({ page, href, reason: "missing file" });
          continue;
        }
        // Fragments are checked on links only: other elements (such as SVG
        // `<use>`) may reference content that scripts add at runtime.
        const fragment = decodeURIComponent(url.hash.slice(1));
        if (tag === "a" && fragment && target.endsWith(".html")) {
          if (!(await idsOf(target)).has(fragment)) {
            broken.push({ page, href, reason: "missing anchor" });
          }
        }
      }
    }
  }
  return broken;
}
