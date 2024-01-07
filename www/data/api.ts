import { doc, load } from "../utils/doc.ts";

const modules = ["mod", "namespaces", "rdf", "sparql"];

async function loadDoc(module: string) {
  const file = import.meta.resolve(`../../${module}.ts`);
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
