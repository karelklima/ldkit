import { assertEquals } from "./test_deps.ts";

import { DataFactory } from "ldkit/rdf";
import { DELETE, OPTIONAL } from "ldkit/sparql";

const df = new DataFactory();
const s = df.variable("s");
const p = df.variable("p");
const o = df.variable("o");
const spo = df.quad(s, p, o);

Deno.test("SPARQL / Sparql builder OPTIONAL #1", () => {
  const expected = "OPTIONAL { ?s ?p ?o . }";
  const query = OPTIONAL`${s} ${p} ${o} .`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder OPTIONAL #2", () => {
  const expected = "OPTIONAL { ?s ?p ?o . }";
  const query = OPTIONAL`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder OPTIONAL #3", () => {
  const expected = "OPTIONAL { ?s ?p ?o .\n?s ?p ?o . }";
  const query = OPTIONAL`${[spo, spo]}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder OPTIONAL #4", () => {
  const expected = "DELETE WHERE {\nOPTIONAL { ?s ?p ?o .\n?s ?p ?o . }\n}\n";
  const query = DELETE.WHERE`${OPTIONAL`${[spo, spo]}`}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder OPTIONAL #5", () => {
  const expected =
    "DELETE WHERE {\nOPTIONAL { ?s ?p ?o . }\nOPTIONAL { ?s ?p ?o . }\n}\n";
  const query = DELETE.WHERE`${[OPTIONAL`${spo}`, OPTIONAL`${spo}`]}`.build();

  assertEquals(query, expected);
});
