import { Markdown } from "../components/Markdown.tsx";
import { App } from "../components/App.tsx";
import { usePage } from "../components/Page.ts";
import {
  CATEGORIES,
  readDoc,
  SLUGS,
  TABLE_OF_CONTENTS,
  type TableOfContentsCategory,
  type TableOfContentsCategoryEntry,
} from "../lib/docs.ts";

export default function DocsPage({ slug }: { slug: string }) {
  const page = TABLE_OF_CONTENTS[slug];
  return (
    <App title={page.title}>
      <div class="mx-auto max-w-5xl flex flex-col md:flex-row-reverse gap-6">
        <Content slug={slug} />
        <Sidebar />
      </div>
    </App>
  );
}

function Sidebar() {
  return (
    <nav class="md:w-[16rem] shrink-0 pb-6 md:pb-0 md:pt-12 md:pr-4">
      <ul class="list-decimal list-inside font-semibold nested md:fixed">
        {CATEGORIES.map((category) => (
          <SidebarCategory key={category.href} category={category} />
        ))}
      </ul>
    </nav>
  );
}

const linkBase = "block px-8 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800";
const link = linkBase;
const linkActive = `${linkBase} bg-gray-300 dark:bg-gray-800`;

function SidebarCategory(props: { category: TableOfContentsCategory }) {
  const { title, href, entries } = props.category;
  const linkClass = `${href == usePage().path ? linkActive : link} font-bold`;

  return (
    <li class="block">
      <a href={href} class={linkClass}>
        {title}
      </a>
      {entries.length > 0 && (
        <ul class="pl-2 nested">
          {entries.map((entry) => (
            <SidebarEntry key={entry.href} entry={entry} />
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarEntry(props: { entry: TableOfContentsCategoryEntry }) {
  const { title, href } = props.entry;
  const linkClass = `${href == usePage().path ? linkActive : link} font-normal`;

  return (
    <li class="block">
      <a href={href} class={linkClass}>
        {title}
      </a>
    </li>
  );
}

function Content({ slug }: { slug: string }) {
  const page = TABLE_OF_CONTENTS[slug];
  return (
    <div class="py-4 md:py-8 overflow-hidden flex-1 md:mt-6">
      <Markdown markdown={readDoc(page)} path={`/docs/${slug}`} />
      <ForwardBackButtons slug={slug} />
    </div>
  );
}

const button =
  "p-2 bg-gray-100 dark:bg-gray-800 w-full border border-gray-200 dark:border-gray-700 grid";

function ForwardBackButtons(props: { slug: string }) {
  const currentIndex = SLUGS.findIndex((slug) => slug === props.slug);
  const previous = TABLE_OF_CONTENTS[SLUGS[currentIndex - 1]];
  const next = TABLE_OF_CONTENTS[SLUGS[currentIndex + 1]];

  const upper = "text-sm text-gray-400";
  const category = "font-normal";
  const lower = "text-gray-900 dark:text-[#c9d1d9] font-medium";

  return (
    <div class="mt-8 flex flex-col md:flex-row gap-4">
      {previous && (
        <a href={previous.href} class={`${button} text-left`}>
          <span class={upper}>← Previous</span>
          <span class={lower}>
            <span class={category}>
              {previous.category ? `${TABLE_OF_CONTENTS[previous.category].title}: ` : ""}
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
              {next.category ? `${TABLE_OF_CONTENTS[next.category].title}: ` : ""}
            </span>
            {next.title}
          </span>
        </a>
      )}
    </div>
  );
}
