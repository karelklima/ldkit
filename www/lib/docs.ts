// Table of contents of the documentation in ../docs, ported from the original
// Fresh site (www/data/docs.ts).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DOCS_DIR = new URL("../../docs/", import.meta.url);

interface RawTableOfContentsEntry {
  title: string;
  pages?: [string, string][];
}

export interface TableOfContentsEntry {
  slug: string;
  title: string;
  category?: string;
  href: string;
  file: string;
}

export interface TableOfContentsCategory {
  title: string;
  href: string;
  entries: TableOfContentsCategoryEntry[];
}

export interface TableOfContentsCategoryEntry {
  title: string;
  href: string;
}

const RAW_TOC: Record<string, RawTableOfContentsEntry> = JSON.parse(
  readFileSync(new URL("table-of-contents.json", DOCS_DIR), "utf8"),
);

export const TABLE_OF_CONTENTS: Record<string, TableOfContentsEntry> = {};
export const CATEGORIES: TableOfContentsCategory[] = [];

for (const [parent, rawEntry] of Object.entries(RAW_TOC)) {
  const href = `/docs/${parent}/`;
  TABLE_OF_CONTENTS[parent] = {
    slug: parent,
    title: rawEntry.title,
    href,
    file: `${parent}/index.md`,
  };
  const category: TableOfContentsCategory = {
    title: rawEntry.title,
    href,
    entries: [],
  };
  CATEGORIES.push(category);
  for (const [id, title] of rawEntry.pages ?? []) {
    const slug = `${parent}/${id}`;
    const href = `/docs/${slug}/`;
    TABLE_OF_CONTENTS[slug] = {
      slug,
      title,
      category: parent,
      href,
      file: `${slug}.md`,
    };
    category.entries.push({ title, href });
  }
}

export const SLUGS = Object.keys(TABLE_OF_CONTENTS);

/** Absolute path of ../docs, watched by the dev server. */
export const DOCS_PATH = fileURLToPath(DOCS_DIR);

export function readDoc(entry: TableOfContentsEntry): string {
  return readFileSync(new URL(entry.file, DOCS_DIR), "utf8");
}
