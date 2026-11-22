import { assertEquals, Comunica } from "../test_deps.ts";

import { createStore } from "../test_utils.ts";

import { sparql } from "ldkit/sparql";

Deno.test("E2E / SPARQL numbers / Interpolated numbers are valid literals", async () => {
  const engine = new Comunica();
  const context = { sources: [createStore()] };

  const compare = async (value: number) => {
    const query = sparql`SELECT ?ok WHERE { BIND((${value} < 1e30) AS ?ok) }`;
    const stream = await engine.queryBindings(query, context);
    const [bindings] = await stream.toArray();
    return bindings?.get("ok")?.value;
  };

  assertEquals(await compare(0.5), "true");
  assertEquals(await compare(1e-7), "true");
  assertEquals(await compare(1e21), "true");
  assertEquals(await compare(-Infinity), "true");
  assertEquals(await compare(Infinity), "false");
  assertEquals(await compare(NaN), "false");
});
