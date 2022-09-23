import type { ComponentChildren } from "preact";
import { Head } from "$fresh/runtime.ts";

import { Footer } from "./Footer.tsx";
import { type ActiveLink, Header } from "./Header.tsx";
import { Title } from "./Title.tsx";

type AppProps = {
  children: ComponentChildren;
  activeLink: ActiveLink;
  title?: string;
};

export function App({ children, activeLink, title }: AppProps) {
  return (
    <>
      <Head>
        <Title>{title}</Title>
      </Head>
      <div class="flex flex-col min-h-screen">
        <Header activeLink={activeLink} />
        <main class="container mx-auto px-4 flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
