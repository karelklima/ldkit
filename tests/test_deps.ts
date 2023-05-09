export {
  assert,
  assertEquals,
  assertRejects,
  assertStrictEquals,
  assertThrows,
  equal,
} from "https://deno.land/std@0.179.0/testing/asserts.ts";

export { assert as assertTypeSafe } from "npm:tsafe@1.4.3";

export { QueryEngine as Comunica } from "npm:@comunica/query-sparql-rdfjs@2.5.2";

// @deno-types="npm:@types/n3"
export * as N3 from "npm:n3@1.16.3";
