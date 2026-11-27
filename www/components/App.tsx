import type { ComponentChildren } from "preact";

import { Footer } from "./Footer.tsx";
import { Header } from "./Header.tsx";
import { usePage } from "./Page.ts";

type AppProps = {
  children: ComponentChildren;
  title?: string;
};

export function App({ children, title }: AppProps) {
  const { stylesheet } = usePage();
  const titleText = title
    ? `${title} · LDkit`
    : "LDkit · Linked Data query toolkit for TypeScript developers";

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{titleText}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href={stylesheet} />
      </head>
      <body>
        <div class="flex flex-col min-h-screen dark:text-[#c9d1d9] dark:bg-[#0d1117]">
          <Header />
          <main class="container mx-auto px-4 flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
