import type { ComponentChildren } from "preact";
import { asset, Head } from "$fresh/runtime.ts";

import { Footer } from "./Footer.tsx";
import { Header } from "./Header.tsx";

type AppProps = {
  children: ComponentChildren;
  title?: string;
};

export function App({ children, title }: AppProps) {
  const titleText = title
    ? `${title} · LDkit`
    : "LDkit · Linked Data query toolkit for TypeScript developers";

  return (
    <>
      <Head>
        <title>{titleText}</title>
        <link rel="stylesheet" href={asset("/gfm.css")} />
      </Head>
      <div class="flex flex-col min-h-screen dark:text-[#c9d1d9] dark:bg-[#0d1117]">
        <Header />
        <main class="container mx-auto px-4 flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
