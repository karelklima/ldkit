import { Handlers, PageProps } from "$fresh/server.ts";

import { gfm } from "../../utils/markdown.ts";

import {
  CATEGORIES,
  SLUGS,
  TABLE_OF_CONTENTS,
  TableOfContentsCategory,
  TableOfContentsCategoryEntry,
  TableOfContentsEntry,
} from "../../data/docs.ts";
import { App } from "../../components/App.tsx";

interface Data {
  page: Page;
}

interface Page extends TableOfContentsEntry {
  markdown: string;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug !== undefined ? ctx.params.slug : "";

    const redirects = {
      "": "/docs/about-ldkit",
      "how-to/query-with-comunica": "features/query-with-comunica",
    };

    for (const [oldSlug, newSlug] of Object.entries(redirects)) {
      if (slug === oldSlug) {
        // Redirect to the new URL
        return new Response("", {
          status: 301,
          headers: { location: `/docs/${newSlug}` },
        });
      }
    }

    const entry = TABLE_OF_CONTENTS[slug];
    if (!entry) {
      return ctx.renderNotFound();
    }
    const url = new URL(`../../../${entry.file}`, import.meta.url);
    const markdown = await Deno.readTextFile(url);
    const page = { ...entry, markdown };
    const resp = ctx.render({ page });
    return resp;
  },
};

export default function DocsPage(props: PageProps<Data>) {
  return (
    <App title={props.data.page?.title ?? "Not Found"}>
      <div class="mx-auto max-w-screen-lg flex flex-col md:flex-row-reverse gap-6">
        <Content page={props.data.page} />
        <Sidebar path={props.url.pathname} />
      </div>
    </App>
  );
}

function Sidebar(props: { path: string }) {
  return (
    <nav class="md:w-[16rem] flex-shrink-0 pb-6 md:pb-0 md:pt-12 md:pr-4">
      <ul class="list-decimal list-inside font-semibold nested md:fixed">
        {CATEGORIES.map((category) => (
          <SidebarCategory path={props.path} category={category} />
        ))}
      </ul>
    </nav>
  );
}

const linkBase =
  "block px-8 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800";
const link = linkBase;
const linkActive = `${linkBase} bg-gray-300 dark:bg-gray-800`;

export function SidebarCategory(props: {
  path: string;
  category: TableOfContentsCategory;
}) {
  const { title, href, entries } = props.category;

  const linkClass = `${href == props.path ? linkActive : link} font-bold`;

  return (
    <li class="block">
      <a href={href} class={linkClass}>
        {title}
      </a>
      {entries.length > 0 && (
        <ul class="pl-2 nested">
          {entries.map((entry) => (
            <SidebarEntry path={props.path} entry={entry} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function SidebarEntry(props: {
  path: string;
  entry: TableOfContentsCategoryEntry;
}) {
  const { title, href } = props.entry;

  const linkClass = `${href == props.path ? linkActive : link} font-normal`;

  return (
    <li class="block">
      <a href={href} class={linkClass}>
        {title}
      </a>
    </li>
  );
}

function Content(props: { page: Page }) {
  const html = gfm.render(props.page.markdown);
  return (
    <div class="py-4 md:py-8 overflow-hidden flex-1 md:mt-6">
      <article
        class="markdown-body"
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
        dangerouslySetInnerHTML={{ __html: html }}
      >
      </article>
      <ForwardBackButtons slug={props.page.slug} />
    </div>
  );
}

const button =
  "p-2 bg-gray-100 dark:bg-gray-800 w-full border-1 border-gray-200 dark:border-gray-700 grid";

function ForwardBackButtons(props: { slug: string }) {
  const currentIndex = SLUGS.findIndex((slug) => slug === props.slug);
  const previousSlug = SLUGS[currentIndex - 1];
  const nextSlug = SLUGS[currentIndex + 1];
  const previous = TABLE_OF_CONTENTS[previousSlug];
  const next = TABLE_OF_CONTENTS[nextSlug];

  const upper = "text(sm gray-400)";
  const category = "font-normal";
  const lower = "text-gray-900 dark:text-[#c9d1d9] font-medium";

  return (
    <div class="mt-8 flex flex(col md:row) gap-4">
      {previous && (
        <a href={previous.href} class={`${button} text-left`}>
          <span class={upper}>← Previous</span>
          <span class={lower}>
            <span class={category}>
              {previous.category
                ? `${TABLE_OF_CONTENTS[previous.category].title}: `
                : ""}
            </span>
            {previous.title}
          </span>
        </a>
      )}
      {next && (
        <a href={next.href} class={`${button} text-right`}>
          <span class={upper}>Next →</span>
          <span class={lower}>
            <span class={category}>
              {next.category
                ? `${TABLE_OF_CONTENTS[next.category].title}: `
                : ""}
            </span>
            {next.title}
          </span>
        </a>
      )}
    </div>
  );
}
