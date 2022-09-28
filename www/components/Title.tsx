import { ComponentChildren } from "preact";

type TitleProps = {
  children?: ComponentChildren;
};

export function Title({ children }: TitleProps) {
  return children ? (
    <title>
      {children}
      {" · LDkit"}
    </title>
  ) : (
    <title>
      {"LDkit · Linked Data query toolkit for TypeScript developers"}
    </title>
  );
}
