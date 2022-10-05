import { ComponentChildren } from "preact";

type JumboProps = {
  children: ComponentChildren;
};

export function Jumbo({ children }: JumboProps) {
  return (
    <h2 class="pt-5 md:pt-10 pb-3 md:pb-5 text-center text-6xl md:text-8xl font-black">
      {children}
    </h2>
  );
}
