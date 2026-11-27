import { describe, expect, test } from "vite-plus/test";

import { render } from "./markdown.ts";

describe("render", () => {
  test("resolves relative links against the page and adds a trailing slash", () => {
    const html = render(
      "[Schema](./schema) [Filtering](../features/filtering#simple-example)",
      "/docs/components/lens",
    );
    expect(html).toContain('href="/docs/components/schema/"');
    expect(html).toContain('href="/docs/features/filtering/#simple-example"');
  });

  test("leaves absolute, external and fragment links alone", () => {
    const html = render(
      "[a](/ontology/IRI) [b](https://ldkit.io) [c](#usage)",
      "/docs/components/lens",
    );
    expect(html).toContain('href="/ontology/IRI"');
    expect(html).toContain('href="https://ldkit.io"');
    expect(html).toContain('href="#usage"');
  });

  test("renders GitHub-style heading anchors", () => {
    expect(render("## Lens usage")).toContain(
      '<h2 id="lens-usage"><a class="anchor" aria-hidden="true" tabindex="-1" href="#lens-usage">',
    );
  });

  test("highlights known languages with Prism and escapes unknown ones", () => {
    const ts = render("```ts\nconst a = 1;\n```");
    expect(ts).toContain('<div class="highlight notranslate"><pre>');
    expect(ts).toContain('<span class="token keyword">const</span>');

    const sh = render("```sh\necho <b>\n```");
    // The sanitizer drops the class on <code>, as the original gfm renderer did.
    expect(sh).toContain("<pre><code>echo &lt;b&gt;</code></pre>");
  });
});
