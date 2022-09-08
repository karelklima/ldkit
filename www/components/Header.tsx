export function Header() {
  return (
    <div class="sticky top-0 bg-white bg-opacity-90 border-b-1 border-dark-50 border-opacity-90">
      <header class="container mx-auto px-4 flex flex-row items-center justify-between">
        <Logo />
        <Menu />
      </header>
    </div>
  );
}

function Logo() {
  return (
    <h1 class="text-2xl font-black">
      <a href="/" class="inline-block">
        <img src="/logo.svg" class="inline-block mb-1 mr-1" />
        <span class="inline-block pb-1">LDkit</span>
      </a>
    </h1>
  );
}

const menuItems: MenuItemProps[] = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Documentation",
    url: "/docs",
  },
  {
    title: "Showcase",
    url: "/showcase",
  },
  {
    title: "Research",
    url: "/research",
  },
  {
    title: "GitHub",
    url: "https://github.com/karelklima/ldkit",
  },
];

function Menu() {
  return (
    <nav>
      <ul>
        {menuItems.map(MenuItem)}
      </ul>
    </nav>
  );
}

type MenuItemProps = {
  title: string;
  url: string;
};

function MenuItem({ title, url }: MenuItemProps) {
  return (
    <li class="inline-block">
      <a
        href={url}
        class="block p-4 border-b-2 border-transparent hover:border-black"
      >
        {title}
      </a>
    </li>
  );
}
