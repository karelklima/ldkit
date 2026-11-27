import type { ComponentChildren } from "preact";

import { IconGitHub, IconLDkit } from "./Icons.tsx";
import { usePage } from "./Page.ts";

export function Header() {
  return (
    <div class="md:sticky md:top-0 bg-white/90 dark:bg-[#0d1117]/90 border-b border-gray-200 dark:border-red-700/90">
      <header class="container mx-auto px-4 h-14 flex flex-row items-stretch justify-between">
        <Logo />
        <Menu />
      </header>
    </div>
  );
}

function Logo() {
  return (
    <h1 class="text-2xl flex shrink-0 items-center font-black">
      <a href="/" class="flex items-center hover:text-gray-700 dark:hover:text-white pr-4">
        <IconLDkit />
        <span class="pb-1 pl-2">LDkit</span>
      </a>
    </h1>
  );
}

function Menu() {
  return (
    <ul class="flex overflow-x-auto">
      <Link url="/">Home</Link>
      <Link url="/docs/about-ldkit/" section="/docs/">
        Documentation
      </Link>
      <Link url="/api/" section="/api/">
        API Reference
      </Link>
      <Link url="https://github.com/karelklima/ldkit" label="GitHub">
        <IconGitHub />
      </Link>
    </ul>
  );
}

const linkClass =
  "table-cell align-middle h-14 px-4 border-b-2 hover:border-black dark:hover:border-red-700 dark:hover:text-white border-transparent data-active:border-black data-active:dark:border-red-700 data-active:bg-gray-50 data-active:dark:bg-gray-800";

function Link({
  url,
  section,
  label,
  children,
}: {
  url: string;
  /** Path prefix for which the link is highlighted as active. */
  section?: string;
  label?: string;
  children: ComponentChildren;
}) {
  const { path } = usePage();
  const active = section ? path.startsWith(section) : path === url;
  return (
    <li>
      <a href={url} class={linkClass} aria-label={label} data-active={active || undefined}>
        {children}
      </a>
    </li>
  );
}
