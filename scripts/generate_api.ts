import { doc } from "https://deno.land/x/deno_doc@0.86.0/mod.ts";
import type { DocNode } from "https://deno.land/x/deno_doc@0.86.0/types.d.ts";
import { load as defaultLoad } from "https://deno.land/x/deno_graph@0.53.0/loader.ts";

export function load(specifier: string) {
  if (specifier.startsWith("npm:")) {
    specifier = `https://esm.sh/${specifier.slice(4)}`;
  }
  return defaultLoad(specifier);
}

const modules = ["mod", "namespaces", "rdf", "sparql"];

async function loadDoc(module: string) {
  const file = import.meta.resolve(`../${module}.ts`);
  return await doc(file, { printImportMapDiagnostics: true, load });
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
Deno.writeTextFileSync(apiFile, JSON.stringify(api, null, 2), { create: true });
