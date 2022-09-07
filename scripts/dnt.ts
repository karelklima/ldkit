import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: [
    "./mod.ts",
    {
      name: "./namespaces",
      path: "./library/namespaces/mod.ts",
    },
    {
      name: "./rdf",
      path: "./library/rdf.ts",
    },
    {
      name: "./sparql",
      path: "./library/sparql.ts",
    },
  ],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    // deno: true,
    // undici: true,
  },
  test: false,
  typeCheck: false,
  declaration: true,
  package: {
    // package.json properties
    name: "ldkit",
    version: Deno.args[0],
    description: "LDKit",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/karelklima/ldkit.git",
    },
    bugs: {
      url: "https://github.com/karelklima/ldkit/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
