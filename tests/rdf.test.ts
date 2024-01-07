import { assert, assertEquals } from "./test_deps.ts";

import { DataFactory, type RDF } from "ldkit/rdf";

import { BindingsFactory, QuadFactory, RDFJSON } from "../library/rdf.ts";

Deno.test("RDF / Quad Factory", () => {
  const df = new DataFactory();
  const quadFactory = new QuadFactory(df);

  const q = (s: string, p: string, o: RDF.Quad_Object) => {
    return df.quad(df.namedNode(s), df.namedNode(p), o);
  };

  const equalQuads = (triple: RDFJSON.Triple, quad: RDF.Quad) => {
    const createdQuad = quadFactory.fromJson(triple);
    assertEquals(createdQuad, quad);
  };

  equalQuads(
    ["s", "p", { type: "literal", value: "o" }],
    q("s", "p", df.literal("o")),
  );

  equalQuads(
    ["s", "p", { type: "uri", value: "o" }],
    q("s", "p", df.namedNode("o")),
  );
});

Deno.test("RDF / Bindings Factory", () => {
  const df = new DataFactory();
  const bindingsFactory = new BindingsFactory(df);

  const equalBindings = (
    jsonBindings: RDFJSON.Bindings,
    bindingsEntries: [string, RDF.Term][],
  ) => {
    const createdBindings = bindingsFactory.fromJson(jsonBindings);
    const bindings = new Map(bindingsEntries);
    assertEquals(createdBindings.size, bindings.size);
    bindings.forEach((term, variable) => {
      assert(createdBindings.has(variable));
      assertEquals(term, createdBindings.get(variable));
      assertEquals(term, createdBindings.get(df.variable(variable)));
    });
    createdBindings.forEach((term, variable) => {
      assertEquals(term, bindings.get(variable.value));
    });
  };

  equalBindings(
    {
      "var": { type: "literal", value: "v" },
    },
    [
      ["var", df.literal("v")],
    ],
  );
});
