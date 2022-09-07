import * as esbuild from "https://deno.land/x/esbuild@v0.14.51/mod.js";
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.5.2/mod.ts";

await esbuild.build({
  plugins: [
    denoPlugin({
      importMapURL: new URL("./import_map.json", import.meta.url),
    }),
  ],
  entryPoints: ["./mod.ts"],
  outfile: "./dist/main.js",
  bundle: true,
  format: "esm",
  logLevel: "info",
  mainFields: ["browser", "main"],
});
//esbuild.stop();
