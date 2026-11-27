import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";

import { JSX_OPTIONS, ldkitSite } from "./site-plugin.ts";

export default defineConfig({
  plugins: [tailwindcss(), ldkitSite()],
  oxc: JSX_OPTIONS,
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  test: {
    include: ["**/*.test.ts"],
  },
  lint: {
    ignorePatterns: ["dist/**"],
    // Type-aware rules plus a full type check (tsrs) as part of `vp check`.
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    // Vendored from deno.land/x/gfm; kept byte-for-byte.
    ignorePatterns: ["styles/gfm.css"],
  },
});
