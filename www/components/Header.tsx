import { IconExternalLink } from "./Icons.tsx";

export function Header(props: { activeLink: ActiveLink }) {
  return (
    <div class="sticky top-0 bg-white bg-opacity-90 border-b-1 border-dark-50 border-opacity-90">
      <header class="container mx-auto px-4 flex flex-row items-center justify-between">
        <Logo />
        <Menu {...props} />
      </header>
    </div>
  );
}

function Logo() {
  return (
    <h1 class="text-2xl font-black">
      <a href="/" class="inline-block hover:text-gray-700">
        <img src="/logo.svg" class="inline-block mb-1 mr-1" />
        <span class="inline-block pb-1">LDkit</span>
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
    <nav>
      <ul>{menuItems.map((item) => MenuItem({ ...item, ...props }))}</ul>
    </nav>
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
    <li class="inline-block">
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
