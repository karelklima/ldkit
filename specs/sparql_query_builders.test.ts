import { assertEquals } from "./test_deps.ts";

import { DataFactory } from "../library/rdf.ts";
import {
  ASK,
  CONSTRUCT,
  DESCRIBE,
  SELECT,
} from "../library/sparql/sparql_query_builders.ts";

const df = new DataFactory();
const s = df.variable("s");
const p = df.variable("p");
const o = df.variable("o");
const spo = df.quad(s, p, o);
const g = df.namedNode("g");

Deno.test("SPARQL / Sparql builder SELECT #1", () => {
  const expected = "SELECT ?s\nWHERE {\n?s ?p ?o .\n}\n";
  const query = SELECT`${s}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #2", () => {
  const expected = "SELECT DISTINCT ?s\nWHERE {\n?s ?p ?o .\n}\n";
  const query = SELECT.DISTINCT`${s}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #3", () => {
  const expected = "SELECT REDUCED ?s\nWHERE {\n?s ?p ?o .\n}\n";
  const query = SELECT.REDUCED`${s}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #4", () => {
  const expected = "SELECT *\nWHERE {\n?s ?p ?o .\n}\n";
  const query = SELECT.ALL.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #5", () => {
  const expected = "SELECT ?s\nFROM <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = SELECT`${s}`.FROM`${g}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #6", () => {
  const expected = "SELECT ?s\nFROM NAMED <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = SELECT`${s}`.FROM_NAMED`${g}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #7", () => {
  const expected =
    "SELECT ?s\nFROM <g>\nFROM NAMED <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = SELECT`${s}`.FROM`${g}`.FROM_NAMED`${g}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #8", () => {
  const expected = "SELECT ?s\nWHERE {\n?s ?p ?o .\n}\nORDER BY ?s\n";
  const query = SELECT`${s}`.WHERE`${spo}`.ORDER_BY`${s}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #9", () => {
  const expected = "SELECT ?s\nWHERE {\n?s ?p ?o .\n}\nORDER BY ?s\nLIMIT 10\n";
  const query = SELECT`${s}`.WHERE`${spo}`.ORDER_BY`${s}`.LIMIT(10).build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #10", () => {
  const expected =
    "SELECT ?s\nWHERE {\n?s ?p ?o .\n}\nORDER BY ?s\nLIMIT 10\nOFFSET 5\n";
  const query = SELECT`${s}`.WHERE`${spo}`.ORDER_BY`${s}`.LIMIT(10).OFFSET(5)
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #11", () => {
  const expected = "SELECT ?s\nWHERE {\n?s ?p ?o .\n}\nLIMIT 10\nOFFSET 5\n";
  const query = SELECT`${s}`.WHERE`${spo}`.LIMIT(10).OFFSET(5)
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #12", () => {
  const expected = "SELECT ?s\nWHERE {\n?s ?p ?o .\n}\nGROUP BY ?s\n";
  const query = SELECT`${s}`.WHERE`${spo}`.GROUP_BY`${s}`
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #13", () => {
  const expected =
    "SELECT ?s\nWHERE {\n?s ?p ?o .\n}\nGROUP BY ?s\nHAVING(true)\n";
  const query = SELECT`${s}`.WHERE`${spo}`.GROUP_BY`${s}`.HAVING`${true}`
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder SELECT #14", () => {
  const expected =
    "SELECT ?s\nWHERE {\n?s ?p ?o .\n}\nGROUP BY ?s\nHAVING(true)\nLIMIT 5\n";
  const query = SELECT`${s}`.WHERE`${spo}`.GROUP_BY`${s}`.HAVING`${true}`
    .LIMIT(5)
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder CONSTRUCT #1", () => {
  const expected = "CONSTRUCT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\n";
  const query = CONSTRUCT`${spo}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder CONSTRUCT #2", () => {
  const expected = "CONSTRUCT WHERE {\n?s ?p ?o .\n}\n";
  const query = CONSTRUCT.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder CONSTRUCT #3", () => {
  const expected =
    "CONSTRUCT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\nORDER BY ?s\n";
  const query = CONSTRUCT`${spo}`.WHERE`${spo}`.ORDER_BY`${s}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder CONSTRUCT #4", () => {
  const expected =
    "CONSTRUCT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\nORDER BY ?s\nLIMIT 10\n";
  const query = CONSTRUCT`${spo}`.WHERE`${spo}`.ORDER_BY`${s}`.LIMIT(10)
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder CONSTRUCT #5", () => {
  const expected =
    "CONSTRUCT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\nORDER BY ?s\nLIMIT 10\nOFFSET 5\n";
  const query = CONSTRUCT`${spo}`.WHERE`${spo}`.ORDER_BY`${s}`.LIMIT(10)
    .OFFSET(5)
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder CONSTRUCT #6", () => {
  const expected =
    "CONSTRUCT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\nLIMIT 10\nOFFSET 5\n";
  const query = CONSTRUCT`${spo}`.WHERE`${spo}`.LIMIT(10).OFFSET(5)
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder CONSTRUCT #7", () => {
  const expected =
    "CONSTRUCT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\nGROUP BY ?s\n";
  const query = CONSTRUCT`${spo}`.WHERE`${spo}`.GROUP_BY`${s}`
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder CONSTRUCT #8", () => {
  const expected =
    "CONSTRUCT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\nGROUP BY ?s\nHAVING(true)\n";
  const query = CONSTRUCT`${spo}`.WHERE`${spo}`.GROUP_BY`${s}`.HAVING`${true}`
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder CONSTRUCT #9", () => {
  const expected =
    "CONSTRUCT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\nGROUP BY ?s\nHAVING(true)\nLIMIT 5\n";
  const query = CONSTRUCT`${spo}`.WHERE`${spo}`.GROUP_BY`${s}`.HAVING`${true}`
    .LIMIT(5)
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder CONSTRUCT #10", () => {
  const expected =
    "CONSTRUCT {\n?s ?p ?o .\n}\nWHERE {\n?s ?p ?o .\n}\nGROUP BY ?s\nHAVING(true)\nLIMIT 5\n";
  const query = CONSTRUCT`${spo}`.WHERE`${spo}`.GROUP_BY`${s}`.HAVING`${true}`
    .LIMIT(5)
    .build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder ASK #1", () => {
  const expected = "ASK {\n?s ?p ?o .\n}\n";
  const query = ASK`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder ASK #2", () => {
  const expected = "ASK\nWHERE {\n?s ?p ?o .\n}\n";
  const query = ASK.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder ASK #3", () => {
  const expected = "ASK\nFROM <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = ASK.FROM`${g}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder ASK #4", () => {
  const expected = "ASK\nFROM NAMED <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = ASK.FROM_NAMED`${g}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder ASK #5", () => {
  const expected = "ASK\nFROM <g>\nFROM NAMED <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = ASK.FROM`${g}`.FROM_NAMED`${g}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder DESCRIBE #1", () => {
  const expected = "DESCRIBE <g>\n";
  const query = DESCRIBE`${g}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder DESCRIBE #2", () => {
  const expected = "DESCRIBE <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = DESCRIBE`${g}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder DESCRIBE #3", () => {
  const expected = "DESCRIBE <g>\nFROM <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = DESCRIBE`${g}`.FROM`${g}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder DESCRIBE #4", () => {
  const expected = "DESCRIBE <g>\nFROM NAMED <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = DESCRIBE`${g}`.FROM_NAMED`${g}`.WHERE`${spo}`.build();

  assertEquals(query, expected);
});

Deno.test("SPARQL / Sparql builder DESCRIBE #5", () => {
  const expected =
    "DESCRIBE <g>\nFROM <g>\nFROM NAMED <g>\nWHERE {\n?s ?p ?o .\n}\n";
  const query = DESCRIBE`${g}`.FROM`${g}`.FROM_NAMED`${g}`.WHERE`${spo}`
    .build();

  assertEquals(query, expected);
});
