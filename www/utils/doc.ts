export { doc } from "https://deno.land/x/deno_doc@0.86.0/mod.ts";
export type { DocNode } from "https://deno.land/x/deno_doc@0.86.0/types.d.ts";
import { load as defaultLoad } from "https://deno.land/x/deno_graph@0.53.0/loader.ts";

export function load(specifier: string) {
  if (specifier.startsWith("npm:")) {
    return Promise.resolve({
      "kind": "external" as const,
      "specifier": specifier,
    });
  }
  return defaultLoad(specifier);
}
