import type { ComponentChildren } from "preact";
import { Footer } from "./Footer.tsx";
import { Header } from "./Header.tsx";

type AppProps = {
  children: ComponentChildren;
};

export function App({ children }: AppProps) {
  return (
    <div class="flex flex-col min-h-screen">
      <Header />
      <main class="container mx-auto px-4 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
