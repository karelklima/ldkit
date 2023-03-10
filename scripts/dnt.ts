import { build, emptyDir } from "https://deno.land/x/dnt@0.33.1/mod.ts";

await emptyDir("./npm");

const exports = ["namespaces", "rdf", "sparql"];
const dntExports = exports.map((e) => ({
  name: `./${e}`,
  path: `./${e}.ts`,
}));

await build({
  entryPoints: [
    "./mod.ts",
    ...dntExports,
  ],
  outDir: "./npm",
  importMap: "./scripts/dnt_import_map.json",
  compilerOptions: {
    lib: ["es2021", "dom"],
    //target: "ES5",
  },
  shims: {
    // see JS docs for overview and more options
    // deno: true,
    // undici: true,
  },
  test: false,
  typeCheck: true,
  declaration: true,
  package: {
    // package.json properties
    name: "ldkit",
    version: Deno.args[0],
    description: "LDkit, a Linked Data query toolkit for TypeScript developers",
    homepage: "https://ldkit.io",
    author: "Karel Klima <karelklima@gmail.com> (https://karelklima.com)",
    keywords: ["linked data", "rdf", "sparql", "deno"],
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

console.info("Creating legacy node exports");
for (const e of exports) {
  const packageContents = {
    main: `../script/${e}.js`,
    module: `../esm/${e}.js`,
    types: `../types/${e}.d.ts`,
  };
  Deno.mkdirSync(`npm/${e}`);
  Deno.writeTextFileSync(
    `npm/${e}/package.json`,
    JSON.stringify(packageContents),
  );
}
console.info("Done creating legacy node exports");

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
