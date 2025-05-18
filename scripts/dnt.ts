import { build, emptyDir } from "jsr:@deno/dnt@0.42.1/";

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
    {
      kind: "bin",
      name: "ldkit",
      path: "./cli.ts",
    },
  ],
  outDir: "./npm",
  compilerOptions: {
    lib: ["ESNext", "DOM"],
    //target: "ES5",
  },
  shims: {
    // see JS docs for overview and more options
    // deno: "dev",
    // undici: true,
  },
  test: false,
  rootTestDir: "./tests",
  typeCheck: "single",
  declaration: "inline",
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
  postBuild() {
    console.log("Copying LICENSE and README.md");
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");

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

    console.info("Post build finished");
  },
});
