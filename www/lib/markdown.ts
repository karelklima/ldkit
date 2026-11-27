// Port of deno.land/x/gfm@0.1.23 `render()`, which the original Fresh site
// used, so documentation HTML (and therefore its styling) stays identical.
import he from "he";
import { marked } from "marked";
import Prism from "prismjs";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-diff.js";
import sanitizeHtml from "sanitize-html";

const ANCHOR_ICON = `<svg class="octicon octicon-link" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>`;

class Renderer extends marked.Renderer {
  constructor(private pageUrl?: URL) {
    super();
  }

  override heading(
    text: string,
    level: 1 | 2 | 3 | 4 | 5 | 6,
    raw: string,
    slugger: marked.Slugger,
  ): string {
    const slug = slugger.slug(raw);
    return `<h${level} id="${slug}"><a class="anchor" aria-hidden="true" tabindex="-1" href="#${slug}">${ANCHOR_ICON}</a>${text}</h${level}>`;
  }

  override code(code: string, language?: string) {
    // a language of `ts, ignore` should really be `ts`
    language = language?.split(",")?.[0];
    const grammar =
      language && Object.hasOwn(Prism.languages, language) ? Prism.languages[language] : undefined;
    if (grammar === undefined) {
      return `<pre><code class="notranslate">${he.escape(code)}</code></pre>`;
    }
    const html = Prism.highlight(code, grammar, language!);
    return `<div class="highlight highlight-source-${language} notranslate"><pre>${html}</pre></div>`;
  }

  override link(href: string, title: string, text: string) {
    if (href.startsWith("#")) {
      return `<a href="${href}" title="${title}">${text}</a>`;
    }
    // Docs use relative links written for URLs without a trailing slash; doc
    // pages are served with one, so resolve them to absolute paths.
    if (this.pageUrl && /^\.\.?\//.test(href)) {
      const url = new URL(href, this.pageUrl);
      href = url.pathname.replace(/\/?$/, "/") + url.hash;
    }
    return `<a href="${href}" title="${title}" rel="noopener noreferrer">${text}</a>`;
  }
}

/**
 * Renders GitHub flavoured markdown to sanitized HTML.
 * @param pagePath URL path of the page (without trailing slash) that relative
 * links in the markdown are resolved against.
 */
export function render(markdown: string, pagePath?: string): string {
  const pageUrl = pagePath ? new URL(pagePath, "https://ldkit.io") : undefined;
  const html = marked(markdown, { gfm: true, renderer: new Renderer(pageUrl) });

  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "video", "svg", "path"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "height", "width", "align"],
      video: ["src", "alt", "height", "width", "autoplay", "muted", "loop", "playsinline"],
      a: ["id", "aria-hidden", "href", "tabindex", "rel"],
      svg: ["viewbox", "width", "height", "aria-hidden"],
      path: ["fill-rule", "d"],
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      h5: ["id"],
      h6: ["id"],
    },
    allowedClasses: {
      div: ["highlight", "notranslate"],
      span: [
        "token",
        "keyword",
        "operator",
        "number",
        "boolean",
        "function",
        "string",
        "comment",
        "class-name",
        "regex",
        "regex-delimiter",
        "tag",
        "attr-name",
        "punctuation",
        "script-punctuation",
        "script",
        "plain-text",
        "property",
        "prefix",
        "line",
        "deleted",
        "inserted",
      ],
      a: ["anchor"],
      svg: ["octicon", "octicon-link"],
    },
    allowProtocolRelative: false,
  });
}
