import { ComponentChildren } from "preact";

type JumboProps = {
  children: ComponentChildren;
};

export function Jumbo({ children }: JumboProps) {
  return (
    <h2 class="pt-10 pb-5 text-center text-8xl font-black">
      {children}
    </h2>
  );
}
