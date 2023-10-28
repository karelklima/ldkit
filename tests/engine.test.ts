import { assertEquals, assertRejects } from "./test_deps.ts";

import { QueryEngine } from "../library/engine/query_engine.ts";
import { type Context } from "../library/rdf.ts";

const engine = new QueryEngine();
const context: Context = { sources: ["https://dbpedia.org/sparql"] };

Deno.test("Boolean query with TRUE outcome", async () => {
  const response = await engine.queryBoolean("ASK { ?s ?p ?o }", context);
  assertEquals(response, true);
});

Deno.test("Boolean query with FALSE outcome", async () => {
  const response = await engine.queryBoolean(
    "ASK { ?s <https://probablynonexistentnode> ?o }",
    context,
  );
  assertEquals(response, false);
});

Deno.test("Invalid boolean query", async () => {
  await assertRejects(() => {
    return engine.queryBoolean(
      "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 1",
      context,
    );
  }, "Non-boolean query should fail");
});

Deno.test("Bindings query", async () => {
  const q = `SELECT ?x ?y WHERE { BIND("x" as ?x) BIND("y" as ?y) }`;
  const stream = await engine.queryBindings(
    q,
    context,
  );
  const bindings = stream.read();
  assertEquals(bindings?.get("x")?.value, "x");
  assertEquals(bindings?.get("y")?.value, "y");
  assertEquals(bindings?.get("z")?.value, undefined);
  assertEquals(stream.read(), null);
});

Deno.test("Invalid bindings query", async () => {
  await assertRejects(() => {
    return engine.queryBindings(
      "ASK { ?s ?p ?o }",
      context,
    );
  }, "Non-bindings query should fail");
});

Deno.test("Quads query", async () => {
  const q =
    `CONSTRUCT { <https://x/x> <https://x/y> <https://x/z>  } WHERE { ?s ?p ?o } LIMIT 1`;
  const stream = await engine.queryQuads(
    q,
    context,
  );
  const quad = stream.read();
  assertEquals(quad?.subject.value, "https://x/x");
  assertEquals(quad?.predicate.value, "https://x/y");
  assertEquals(quad?.object.value, "https://x/z");
  assertEquals(stream.read(), null);
});
