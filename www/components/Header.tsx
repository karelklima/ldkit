import type { ComponentChildren } from "preact";

import { IconGitHub, IconLDkit } from "./Icons.tsx";

export function Header() {
  return (
    <div class="md:sticky md:top-0 bg-white dark:bg-[#0d1117] bg-opacity-90 dark:bg-opacity-90 border-b-1 border-dark-50 dark:border-red-700 border-opacity-90">
      <header class="container mx-auto px-4 h-14 flex flex-row items-stretch justify-between">
        <Logo />
        <Menu />
      </header>
    </div>
  );
}

function Logo() {
  return (
    <h1 class="text-2xl flex flex-shrink-0 items-center font-black">
      <a
        href="/"
        class="flex items-center hover:text-gray-700 dark:hover:text-white pr-4"
      >
        <IconLDkit />
        <span class="pb-1 pl-2">LDkit</span>
      </a>
    </h1>
  );
}

function Menu() {
  return (
    <ul class="flex-0-1-auto flex overflow-x-auto">
      <Link url="/">Home</Link>
      <Link url="/docs">Documentation</Link>
      <Link url="/api">API Reference</Link>
      <Link url="https://github.com/karelklima/ldkit">
        <IconGitHub />
      </Link>
    </ul>
  );
}

const baseLinkClass =
  "table-cell align-middle h-14 px-4 border-b-2 hover:border-black dark:hover:border-red-700 dark:hover:text-white border-transparent";

const activeCurrentLinkClass =
  `${baseLinkClass} [data-current]:border-black [data-current]:dark:border-red-700 [data-current]:bg-gray-50 [data-current]:dark:bg-gray-800`;

const activeAncestorLinkClass =
  `${baseLinkClass} [data-ancestor]:border-black [data-ancestor]:dark:border-red-700 [data-ancestor]:bg-gray-50 [data-ancestor]:dark:bg-gray-800`;

function Link({ url, children }: {
  url: string;
  children: ComponentChildren;
}) {
  const linkClass = url === "/"
    ? activeCurrentLinkClass
    : activeAncestorLinkClass;
  return (
    <li>
      <a href={url} class={linkClass}>
        {children}
      </a>
    </li>
  );
}
