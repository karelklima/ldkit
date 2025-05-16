// This script generates the API documentation for the library by using Deno's built-in
// documentation generation tool. It loads the modules, generates the documentation,
// and saves it to a JSON file. The generated documentation includes information about
// the modules, classes, functions, and types defined in the library.

const modules = ["mod", "namespaces", "rdf", "sparql"];

async function loadDoc(module: string) {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["doc", "--json", `./${module}.ts`],
    stdout: "piped",
    stderr: "piped",
  });

  const { stdout } = await command.output();
  const value = new TextDecoder().decode(stdout);
  const json = JSON.parse(value);

  return json.nodes;
}

export async function getApi() {
  const promises = modules.map(async (module) => {
    const x = await loadDoc(module);
    return {
      kind: "module",
      path: `/${module}.ts`,
      items: x,
    };
  });

  return await Promise.all(promises);
}

export const api = await getApi();

const apiFile = new URL(import.meta.resolve("../docs/api.json"));
Deno.writeTextFileSync(apiFile, JSON.stringify(api, null, 2) + "\n", {
  create: true,
});
