import { assertEquals } from "./test_deps.ts";

import { DataFactory } from "../library/rdf.ts";
import {
  DELETE,
  INSERT,
  WITH,
} from "../library/sparql/sparql_update_builders.ts";

const df = new DataFactory();
const s = df.variable("s");
const p = df.variable("p");
const o = df.variable("o");
const spo = df.quad(s, p, o);
const g = df.namedNode("g");

Deno.test("SPARQL / Sparql builder INSERT #1", () => {
  const expected = "INSERT DATA {\n?s ?p ?o .\n}\n";
  const query = INSERT.DATA`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder INSERT #2", () => {
  const expected = "INSERT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\n";
  const query = INSERT`${spo}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder INSERT #3", () => {
  const expected =
    "INSERT {\n?s ?p ?o .\n}\nUSING <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = INSERT`${spo}`.USING(g).WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder INSERT #4", () => {
  const expected =
    "INSERT {\n?s ?p ?o .\n}\nUSING <g>\nUSING NAMED <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = INSERT`${spo}`.USING("g").USING_NAMED(g).WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder INSERT #5", () => {
  const expected =
    "INSERT {\n?s ?p ?o .\n}\nUSING <g>\nUSING <g>\nUSING NAMED <g>\nUSING NAMED <g>\nUSING NAMED <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = INSERT`${spo}`.USING("g").USING("g").USING_NAMED(g)
    .USING_NAMED(g).USING_NAMED(g).WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder DELETE #1", () => {
  const expected = "DELETE DATA {\n?s ?p ?o .\n}\n";
  const query = DELETE.DATA`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder DELETE #2", () => {
  const expected = "DELETE {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\n";
  const query = DELETE`${spo}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder DELETE #3", () => {
  const expected =
    "DELETE {\n?s ?p ?o .\n}\nUSING <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = DELETE`${spo}`.USING(g).WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder DELETE #4", () => {
  const expected =
    "DELETE {\n?s ?p ?o .\n}\nUSING <g>\nUSING NAMED <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = DELETE`${spo}`.USING("g").USING_NAMED(g).WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder DELETE #5", () => {
  const expected =
    "DELETE {\n?s ?p ?o .\n}\nINSERT {\n?s ?p ?o .\n}\nUSING <g>\nUSING NAMED <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = DELETE`${spo}`.INSERT`${spo}`.USING("g").USING_NAMED(g)
    .WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder DELETE #6", () => {
  const expected =
    "DELETE {\n?s ?p ?o .\n}\nINSERT {\n?s ?p ?o .\n}\nUSING <g>\nUSING <g>\nUSING NAMED <g>\nUSING NAMED <g>\nUSING NAMED <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = DELETE`${spo}`.INSERT`${spo}`.USING("g").USING("g")
    .USING_NAMED(g).USING_NAMED(g).USING_NAMED(g)
    .WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder WITH #1", () => {
  const expected =
    "WITH <g>\nDELETE {\n?s ?p ?o .\n}\nINSERT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\n";
  const query = WITH(g).DELETE`${spo}`.INSERT`${spo}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder WITH #2", () => {
  const expected =
    "WITH <g>\nDELETE {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\n";
  const query = WITH(g).DELETE`${spo}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder WITH #3", () => {
  const expected =
    "WITH <g>\nINSERT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\n";
  const query = WITH(g).INSERT`${spo}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});
