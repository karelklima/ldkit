import { ComponentChildren } from "https://esm.sh/v94/preact@10.10.6/src/index.d.ts";

type TitleProps = {
  children?: ComponentChildren;
};

export function Title({ children }: TitleProps) {
  return children
    ? <title>{children}{" | LDkit"}</title>
    : <title>{"LDkit, the RDF framework for browser, Deno and Node"}</title>;
}
