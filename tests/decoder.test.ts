import { assertEquals, assertThrows } from "./test_deps.ts";
import { createGraph, x } from "./test_utils.ts";

import type { Context } from "../library/rdf.ts";
import { decode } from "../library/decoder.ts";
import type { Schema } from "../library/schema/mod.ts";
import { rdf, xsd } from "../library/namespaces/mod.ts";

const decodeGraph = (
  turtle: string,
  schema: Schema,
  context: Context = { sources: ["dummy"] },
) => decode(createGraph(turtle), schema, context);

const evaluate = (
  turtle: string,
  schema: Schema,
  result: Record<string, unknown>[],
  context?: Context,
) => assertEquals(decodeGraph(turtle, schema, context), result);

Deno.test("Decoder / Minimal resource", () => {
  const input = `
      x:A a ldkit:Resource .
    `;

  const schema = { "@type": [] };

  const output = [
    {
      $id: x.A,
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Multiple minimal resources", () => {
  const input = `
      x:A a ldkit:Resource .
      x:B a ldkit:Resource .
      x:C a ldkit:Resource .
    `;

  const schema = { "@type": [] };

  const output = [
    {
      $id: x.A,
    },
    {
      $id: x.B,
    },
    {
      $id: x.C,
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Query without RDF type", () => {
  const input = `
      x:A a ldkit:Resource;
        x:property "value" .
    `;

  const schema = {
    "@type": [],
    property: {
      "@id": x.property,
    },
  };

  const output = [
    {
      $id: x.A,
      property: "value",
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Query for RDF types", () => {
  const input = `
      x:A a ldkit:Resource, x:TypeA, x:TypeB, x:TypeC .
    `;

  const schema = {
    "@type": [],
    types: {
      "@id": rdf.type,
      "@array": true as const,
    },
  };

  const output = [
    {
      $id: x.A,
      types: [x.TypeA, x.TypeB, x.TypeC],
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Query with multiple RDF types for RDF types", () => {
  const input = `
    x:A a ldkit:Resource, x:TypeA, x:TypeB, x:TypeC .
  `;

  const schema = {
    "@type": [x.TypeA, x.TypeB],
    types: {
      "@id": rdf.type,
      "@array": true as const,
    },
  };

  const output = [
    {
      $id: x.A,
      types: [x.TypeA, x.TypeB, x.TypeC],
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Basic types", () => {
  const input = `
      x:A
        a ldkit:Resource, x:Item ;
        x:string "LDKit"^^xsd:string ;
        x:integer "-5"^^xsd:integer ;
        x:decimal "-5.0"^^xsd:decimal ;
        x:double "4.2E9"^^xsd:double ;
        x:boolean true ;
        x:date "2021-11-11"^^xsd:date .
    `;

  const schema = {
    "@type": [x.Item],
    string: {
      "@id": x.string,
      "@type": xsd.string,
    },
    integer: {
      "@id": x.integer,
      "@type": xsd.integer,
    },
    decimal: {
      "@id": x.decimal,
      "@type": xsd.decimal,
    },
    double: {
      "@id": x.double,
      "@type": xsd.double,
    },
    boolean: {
      "@id": x.boolean,
      "@type": xsd.boolean,
    },
    date: {
      "@id": x.date,
      "@type": xsd.date,
    },
  };

  const output = [
    {
      $id: x.A,
      string: "LDKit",
      integer: -5,
      decimal: -5.0,
      double: 4.2e9,
      boolean: true,
      date: new Date("2021-11-11"),
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Required property missing", () => {
  const input = `
      x:A a ldkit:Resource .
    `;

  const schema = {
    "@type": [],
    required: {
      "@id": x.required,
    },
  };

  assertThrows(() => decodeGraph(input, schema));
});

Deno.test("Decoder / Optional property missing", () => {
  const input = `
      x:A a ldkit:Resource .
    `;

  const schema = {
    "@type": [],
    optional: {
      "@id": x.optional,
      "@optional": true as const,
    },
  };

  const output = [
    {
      $id: x.A,
      optional: null,
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Optional array property missing", () => {
  const input = `
      x:A a ldkit:Resource .
    `;

  const schema = {
    "@type": [],
    optional: {
      "@id": x.optional,
      "@optional": true as const,
      "@array": true as const,
    },
  };

  const output = [
    {
      $id: x.A,
      optional: [],
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Array simple property", () => {
  const input = `
      x:A
        a ldkit:Resource ;
        x:array 1, 2, 3 .
    `;

  const schema = {
    "@type": [],
    array: {
      "@id": x.array,
      "@array": true as const,
    },
  };

  const output = [
    {
      $id: x.A,
      array: [1, 2, 3],
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Array subschema property", () => {
  const input = `
      x:A
        a ldkit:Resource ;
        x:array x:B, x:C .
      x:B x:value "value B" .
      x:C x:value "value C" .
    `;

  const schema = {
    "@type": [],
    array: {
      "@id": x.array,
      "@array": true as const,
      "@context": {
        "@type": [],
        value: {
          "@id": x.value,
        },
      },
    },
  };

  const output = [
    {
      $id: x.A,
      array: [
        {
          $id: x.B,
          value: "value B",
        },
        {
          $id: x.C,
          value: "value C",
        },
      ],
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Multilang property", () => {
  const input = `
      x:A
        a ldkit:Resource ;
        x:multilang "CS"@cs, "EN"@en, "Unknown" .
    `;

  const schema = {
    "@type": [],
    multilang: {
      "@id": x.multilang,
      "@multilang": true as const,
    },
  };

  const output = [
    {
      $id: x.A,
      multilang: {
        cs: "CS",
        en: "EN",
        [""]: "Unknown",
      },
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Multilang array property", () => {
  const input = `
      x:A
        a ldkit:Resource;
        x:multilang "CS 1"@cs, "CS 2"@cs, "CS 3"@cs, "EN"@en, "Unknown" .
    `;

  const schema = {
    "@type": [],
    multilang: {
      "@id": x.multilang,
      "@multilang": true as const,
      "@array": true as const,
    },
  };

  const output = [
    {
      $id: x.A,
      multilang: {
        cs: ["CS 1", "CS 2", "CS 3"],
        en: ["EN"],
        [""]: ["Unknown"],
      },
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Preferred language property", () => {
  const input = `
      x:A
        a ldkit:Resource ;
        x:preferredLanguage "DE"@de, "CS"@cs, "EN"@en .
    `;

  const schema = {
    "@type": [],
    preferredLanguage: {
      "@id": x.preferredLanguage,
    },
  };

  const output = [
    {
      $id: x.A,
      preferredLanguage: "CS",
    },
  ];

  evaluate(input, schema, output, { language: "cs", sources: ["dummy"] });
});

Deno.test("Decoder / Preferred first property", () => {
  const input = `
      x:A
        a ldkit:Resource ;
        x:preferredFirst "DE"@de, "CS"@cs, "EN"@en .
    `;

  const schema = {
    "@type": [],
    preferredFirst: {
      "@id": x.preferredFirst,
    },
  };

  const output = [
    {
      $id: x.A,
      preferredFirst: "DE",
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / One resource multiple schemas", () => {
  const input = `
      x:A
        a ldkit:Resource ;
        x:nested x:A ;
        x:rootProperty "Root property" ;
        x:nestedProperty "Nested property" .
    `;

  const schema = {
    "@type": [],
    rootProperty: {
      "@id": x.rootProperty,
    },
    nested: {
      "@id": x.nested,
      "@context": {
        "@type": [x.Item],
        nestedProperty: {
          "@id": x.nestedProperty,
        },
      },
    },
  };

  const output = [
    {
      $id: x.A,
      rootProperty: "Root property",
      nested: {
        $id: x.A,
        nestedProperty: "Nested property",
      },
    },
  ];

  evaluate(input, schema, output);
});

Deno.test("Decoder / Caching", () => {
  const input = `
      x:A
        a ldkit:Resource ;
        x:nested x:C .
      x:B
        a ldkit:Resource ;
        x:nested x:C .
      x:C
        a x:Nested .
    `;

  const schema = {
    "@type": [],
    nested: {
      "@id": x.nested,
      "@context": {
        "@type": [x.Nested],
      },
    },
  };

  const output = [
    {
      $id: x.A,
      nested: {
        $id: x.C,
      },
    },
    {
      $id: x.B,
      nested: {
        $id: x.C,
      },
    },
  ];

  const decoded = decodeGraph(input, schema);

  assertEquals(decoded, output);
  assertEquals(decoded[0].nested, decoded[1].nested);
});
