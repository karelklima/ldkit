import { assertEquals } from "./test_deps.ts";

import { DataFactory } from "../library/rdf.ts";
import { sparql } from "../library/sparql/sparql_tag.ts";
import xsd from "../library/namespaces/xsd.ts";

const df = new DataFactory();

Deno.test("SPARQL / Sparql tags simple strings", () => {
  assertEquals(sparql``, "");
  assertEquals(sparql`abc`, "abc");
});

Deno.test("SPARQL / Sparql tag basic types", () => {
  assertEquals(sparql`${df.blankNode("x")}`, "_:x");
  assertEquals(sparql`${df.namedNode("x")}`, "<x>");
  assertEquals(sparql`${df.variable("x")}`, "?x");

  assertEquals(
    sparql`${df.quad(df.namedNode("s"), df.namedNode("p"), df.namedNode("o"))}`,
    "<s> <p> <o> .",
  );

  assertEquals(
    sparql`${
      df.quad(
        df.namedNode("s"),
        df.namedNode("p"),
        df.namedNode("o"),
        df.namedNode("g"),
      )
    }`,
    "GRAPH <g> { <s> <p> <o> . }",
  );
});

Deno.test("SPARQL / Sparql tag literals", () => {
  // known types
  assertEquals(
    sparql`${df.literal("true", df.namedNode(xsd.boolean))}`,
    "true",
  );
  assertEquals(
    sparql`${true}`,
    "true",
  );
  assertEquals(sparql`${df.literal("1", df.namedNode(xsd.integer))}`, "1");
  assertEquals(sparql`${1}`, "1");
  assertEquals(sparql`${df.literal("1.0", df.namedNode(xsd.decimal))}`, "1.0");
  assertEquals(sparql`${1.1}`, "1.1");

  // date
  assertEquals(
    sparql`${new Date("2001-10-26T21:32:52Z")}`,
    `"2001-10-26T21:32:52.000Z"^^<${xsd.dateTime}>`,
  );

  // custom type
  assertEquals(
    sparql`${
      df.literal("2001-10-26T21:32:52+02:00", df.namedNode(xsd.dateTime))
    }`,
    `"2001-10-26T21:32:52+02:00"^^<${xsd.dateTime}>`,
  );

  // language
  assertEquals(sparql`${df.literal("thing", "en")}`, `"thing"@en`);
});

Deno.test("SPARQL / Sparql tag escape", () => {
  assertEquals(sparql`${df.literal(`"thing"`)}`, `"\\"thing\\""`);
  assertEquals(sparql`${df.literal(`th\\ing`)}`, `"th\\\\ing"`);

  assertEquals(sparql`${df.literal(`th\ning\r\n`)}`, `"th\\ning\\r\\n"`);
});

Deno.test("SPARQL / Sparql tag iterable terms", () => {
  const quad = df.quad(df.namedNode("s"), df.namedNode("p"), df.namedNode("o"));
  const graphedQuad = df.quad(
    df.namedNode("s"),
    df.namedNode("p"),
    df.namedNode("o"),
    df.namedNode("g"),
  );
  const quads = [quad, graphedQuad];

  const result = "<s> <p> <o> .\nGRAPH <g> { <s> <p> <o> . }";

  assertEquals(sparql`${quads}`, result);
});

Deno.test("SPARQL / Sparql tag complex test", () => {
  const quad = df.quad(df.variable("s"), df.variable("p"), df.variable("o"));
  const input = sparql`SELECT ${df.variable("s")} WHERE { ${quad} }`;
  const expected = "SELECT ?s WHERE { ?s ?p ?o . }";

  assertEquals(input, expected);
});
