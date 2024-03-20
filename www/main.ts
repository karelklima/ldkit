/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

const startTime = performance.now();

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

const freshTime = performance.now();

import { setup } from "$doc_components/services.ts";
import docConfig from "./doc.config.ts";

await setup(docConfig);

const docTime = performance.now();

console.log("Fresh time:", freshTime - startTime);
console.log("Doc time:", docTime - freshTime);

await start(manifest, config);
