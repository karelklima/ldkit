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

const menuItems = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Documentation",
    url: "/docs",
  },
  //{
  //  title: "Showcase",
  //  url: "/showcase",
  //},
  {
    title: "GitHub",
    url: "https://github.com/karelklima/ldkit",
  },
] as const;

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
type Unpacked<T> = T extends (infer U)[] ? U : T;
export type ActiveLink = Unpacked<Writeable<typeof menuItems>>["url"];

function Menu() {
  return (
    <ul class="flex-0-1-auto flex overflow-x-auto">
      <Link url="/">Home</Link>
      <Link url="/docs">Documentation</Link>
      <Link url="https://github.com/karelklima/ldkit">
        <IconGitHub />
      </Link>
    </ul>
  );
}

const baseLinkClass =
  "table-cell align-middle h-14 px-4 border-b-2 hover:border-black dark:hover:border-red-700 dark:hover:text-white border-transparent";

const activeLinkClass =
  `${baseLinkClass} [data-ancestor]:border-black [data-ancestor]:dark:border-red-700 [data-ancestor]:bg-gray-50 [data-ancestor]:dark:bg-gray-800`;

function Link({ url, children }: {
  url: string;
  children: ComponentChildren;
}) {
  const linkClass = url === "/" ? baseLinkClass : activeLinkClass;
  return (
    <li>
      <a href={url} class={linkClass}>
        {children}
      </a>
    </li>
  );
}
