import { PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          LDkit · Linked Data query toolkit for TypeScript developers
        </title>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
