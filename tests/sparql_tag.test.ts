import { assertEquals } from "./test_deps.ts";

import { DataFactory } from "ldkit/rdf";
import { sparql } from "ldkit/sparql";
import { xsd } from "ldkit/namespaces";

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

Deno.test("SPARQL / Sparql tag numbers", () => {
  const typed = (lexical: string, dataType: string) =>
    `"${lexical}"^^<${dataType}>`;

  // plain notation keeps xsd:integer and xsd:decimal
  assertEquals(sparql`${0}`, typed("0", xsd.integer));
  assertEquals(sparql`${-0}`, typed("0", xsd.integer));
  assertEquals(sparql`${-3}`, typed("-3", xsd.integer));
  assertEquals(sparql`${0.5}`, typed("0.5", xsd.decimal));
  assertEquals(sparql`${-10.5}`, typed("-10.5", xsd.decimal));
  assertEquals(sparql`${1e-6}`, typed("0.000001", xsd.decimal));
  assertEquals(sparql`${1e20}`, typed("100000000000000000000", xsd.integer));

  // exponent notation becomes xsd:double
  assertEquals(sparql`${1e-7}`, typed("1e-7", xsd.double));
  assertEquals(sparql`${-1e-7}`, typed("-1e-7", xsd.double));
  assertEquals(sparql`${-1.5e-10}`, typed("-1.5e-10", xsd.double));
  assertEquals(sparql`${1e21}`, typed("1e+21", xsd.double));
  assertEquals(sparql`${-1e21}`, typed("-1e+21", xsd.double));
  assertEquals(
    sparql`${Number.MAX_VALUE}`,
    typed("1.7976931348623157e+308", xsd.double),
  );

  // NaN and infinities use the XSD lexical forms
  assertEquals(sparql`${NaN}`, typed("NaN", xsd.double));
  assertEquals(sparql`${Infinity}`, typed("INF", xsd.double));
  assertEquals(sparql`${-Infinity}`, typed("-INF", xsd.double));

  // the same literals are used in iterables
  assertEquals(
    sparql`${[1, 1e-7]}`,
    `${typed("1", xsd.integer)}\n${typed("1e-7", xsd.double)}`,
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
  assertEquals(
    sparql`${df.literal("1", df.namedNode(xsd.integer))}`,
    `"1"^^<${xsd.integer}>`,
  );
  assertEquals(sparql`${1}`, `"1"^^<${xsd.integer}>`);
  assertEquals(
    sparql`${df.literal("10.5", df.namedNode(xsd.decimal))}`,
    `"10.5"^^<${xsd.decimal}>`,
  );
  assertEquals(sparql`${10.5}`, `"10.5"^^<${xsd.decimal}>`);

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
