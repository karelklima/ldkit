import { assertEquals, assertRejects, describe, it } from "./test_deps.ts";

import { QueryEngine } from "../library/engine/query_engine.ts";
import { type Context, type RDF } from "../library/rdf.ts";

describe("Query Engine", () => {
  const engine = new QueryEngine();
  const context: Context = { sources: ["https://dbpedia.org/sparql"] };

  const q = async (query: string) => {
    const response = await engine.query(query, context);
    console.log(response);
    const json = await response.json();
    console.log(json);
  };

  it("Perform simple query", async () => {
    const query = "SELECT ?s WHERE { ?s ?p ?o } LIMIT 10";
    const response = await engine.query(query, context);
    console.log(response);
    const json = await response.json();
    console.log(json);

    console.log("ASK TRUE");
    await q("ASK { ?s ?p ?o }");
    console.log("ASK FALSE");
    await q("ASK { ?s ?p <https://karelklima.com/x> }");
    console.log("CONSTRUCT QUERY");
    await q("CONSTRUCT WHERE { ?s ?p ?o } LIMIT 5");
  });

  it("Boolean query with TRUE outcome", async () => {
    const response = await engine.queryBoolean("ASK { ?s ?p ?o }", context);
    assertEquals(response, true);
  });

  it("Boolean query with FALSE outcome", async () => {
    const response = await engine.queryBoolean(
      "ASK { ?s <https://probablynonexistentnode> ?o }",
      context,
    );
    console.log("RESPONSE", response);
    assertEquals(response, false);
  });

  it("Invalid boolean query", async () => {
    await assertRejects(() => {
      return engine.queryBoolean(
        "CONSTRUCT WHERE { ?s ?p ?o } LIMIT 1",
        context,
      );
    }, "Non-boolean query should fail");
  });

  it("Bindings query", async () => {
    const q = `SELECT ?x ?y WHERE { BIND("x" as ?x) BIND("y" as ?y) }`;
    const response = await engine.queryBindings(
      q,
      context,
    ) as unknown as RDF.Bindings[];
    console.log(response);
    assertEquals(response.length, 1);
    const bindings = response[0];
    assertEquals(bindings?.get("x")?.value, "x");
    assertEquals(bindings?.get("y")?.value, "y");
    assertEquals(bindings?.get("z")?.value, undefined);
  });

  it("Invalid bindings query", async () => {
    await assertRejects(() => {
      return engine.queryBindings(
        "ASK { ?s ?p ?o }",
        context,
      );
    }, "Non-bindings query should fail");
  });

  it("Quads query", async () => {
    const q =
      `CONSTRUCT { <https://x/x> <https://x/y> <https://x/z>  } WHERE { ?s ?p ?o } LIMIT 1`;
    const response = await engine.queryQuads(
      q,
      context,
    ) as unknown as RDF.Quad[];
    console.log(response);
    assertEquals(response.length, 1);
    const quad = response[0];
    console.log(quad);
    assertEquals(quad?.subject.value, "https://x/x");
    assertEquals(quad?.predicate.value, "https://x/y");
    assertEquals(quad?.object.value, "https://x/z");
  });

  it("Invalid quads query", async () => {
    await assertRejects(() => {
      return engine.queryQuads(
        "ASK { ?s ?p ?o }",
        context,
      );
    }, "Non-quads query should fail");
  });
});
