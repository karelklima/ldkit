import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "vite-plus/test";

import { findBrokenLinks, pageUrl } from "./links.ts";

test("pageUrl maps built files to the URLs they are served at", () => {
  expect(pageUrl("index.html")).toBe("/");
  expect(pageUrl(join("docs", "lens", "index.html"))).toBe("/docs/lens/");
  expect(pageUrl(join("ontology", "IRI.html"))).toBe("/ontology/IRI");
});

describe("findBrokenLinks", () => {
  let dir: string;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), "ldkit-links-"));
    await mkdir(join(dir, "docs", "lens"), { recursive: true });
    await mkdir(join(dir, "ontology"));
    await writeFile(join(dir, "ontology", "IRI.html"), '<h2 id="overview">');
    await writeFile(join(dir, "style.css"), "");
    await writeFile(join(dir, "logo.svg"), "");
    await writeFile(
      join(dir, "docs", "lens", "index.html"),
      [
        '<h2 id="usage">',
        // Valid
        '<a href="/ontology/IRI">', // served from IRI.html
        '<a href="/ontology/IRI#overview">',
        '<a href="https://ldkit.io/ontology/IRI">', // absolute, same site
        '<a href="../../style.css">', // relative
        '<a href="./#usage">', // the page itself
        '<a href="#usage">',
        '<img src="/logo.svg">',
        '<svg><use href="#icon-added-by-script"></use></svg>', // not an <a>
        '<a href="https://example.com/missing">', // external
        // Broken
        '<a href="/docs/missing/">',
        '<a href="https://ldkit.io/missing">',
        '<a href="/ontology/IRI#missing">',
        '<a href="#missing">',
        '<img src="/missing.png">',
      ].join("\n"),
    );
  });

  afterAll(() => rm(dir, { recursive: true, force: true }));

  test("reports internal links without a target file or anchor", async () => {
    const page = "/docs/lens/";
    expect(await findBrokenLinks(dir)).toEqual([
      { page, href: "/docs/missing/", reason: "missing file" },
      { page, href: "https://ldkit.io/missing", reason: "missing file" },
      { page, href: "/ontology/IRI#missing", reason: "missing anchor" },
      { page, href: "#missing", reason: "missing anchor" },
      { page, href: "/missing.png", reason: "missing file" },
    ]);
  });
});
