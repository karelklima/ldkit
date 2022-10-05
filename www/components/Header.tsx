import { IconExternalLink } from "./Icons.tsx";

export function Header(props: { activeLink: ActiveLink }) {
  return (
    <div class="md:sticky md:top-0 bg-white bg-opacity-90 border-b-1 border-dark-50 border-opacity-90">
      <header class="container mx-auto px-4 flex flex-row items-stretch justify-between">
        <Logo />
        <Menu {...props} />
      </header>
    </div>
  );
}

function Logo() {
  return (
    <h1 class="text-2xl flex flex-shrink-0 items-center font-black">
      <a href="/" class="flex items-center hover:text-gray-700 pr-4">
        <img src="/logo.svg" class="mb-1 mr-1" />
        <span class="pb-1">LDkit</span>
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

function Menu(props: { activeLink: ActiveLink }) {
  return (
    <ul class="flex-0-1-auto flex overflow-x-auto">
      {menuItems.map((item) => MenuItem({ ...item, ...props }))}
    </ul>
  );
}

type MenuItemProps = {
  title: string;
  url: string;
  activeLink: ActiveLink;
};

const baseLinkClass = "flex flex-row p-4 border-b-2 hover:border-black";

function MenuItem({ title, url, activeLink }: MenuItemProps) {
  const linkClass =
    url === activeLink
      ? `${baseLinkClass} border-black bg-gray-50`
      : `${baseLinkClass} border-transparent`;
  return (
    <li>
      <a href={url} class={linkClass}>
        <span>{title}</span>
        {url.startsWith("http") ? (
          <span class="ml-1 mt-1 w-2 h-2 text-gray-400">
            <IconExternalLink />
          </span>
        ) : null}
      </a>
    </li>
  );
}
