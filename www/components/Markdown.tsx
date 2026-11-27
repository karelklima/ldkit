import { render } from "../lib/markdown.ts";

export function Markdown({
  markdown,
  path,
  class: className,
}: {
  markdown: string;
  /** URL path that relative links in the markdown are resolved against. */
  path?: string;
  class?: string;
}) {
  return (
    <div
      class={className ? `markdown-body ${className}` : "markdown-body"}
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
      dangerouslySetInnerHTML={{ __html: render(markdown, path) }}
    />
  );
}
