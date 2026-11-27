import { describe, expect, test } from "vite-plus/test";

import { formatRedirects, legacyApiRedirects } from "./redirects.ts";

describe("legacyApiRedirects", () => {
  const redirects = legacyApiRedirects(
    ["mod", "sparql"],
    [
      { module: "mod", name: "Lens", page: "/api/mod/Lens/", members: ["find", "findByIri"] },
      // Re-exported from `namespaces`, documented under `mod`.
      {
        module: "namespaces",
        name: "createNamespace",
        page: "/api/mod/createNamespace/",
        members: [],
      },
    ],
  );
  const target = (from: string) => redirects.find((r) => r.from === from)?.to;

  test("maps modules and symbols to their TypeDoc pages", () => {
    expect(target("/api/mod.ts")).toBe("/api/mod/");
    expect(target("/api/sparql.ts")).toBe("/api/sparql/");
    expect(target("/api/mod.ts~Lens")).toBe("/api/mod/Lens/");
    expect(target("/api/namespaces.ts~createNamespace")).toBe("/api/mod/createNamespace/");
  });

  test("maps instance and static members to lowercased anchors", () => {
    expect(target("/api/mod.ts~Lens.prototype.findByIri")).toBe("/api/mod/Lens/#findbyiri");
    expect(target("/api/mod.ts~Lens.find")).toBe("/api/mod/Lens/#find");
  });
});

test("formatRedirects writes Netlify _redirects lines", () => {
  const text = formatRedirects([{ from: "/api/mod.ts", to: "/api/mod/" }]);
  expect(text).toMatch(/^#/);
  expect(text).toContain("/api/mod.ts  /api/mod/  301\n");
});
