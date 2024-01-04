import { assertEquals } from "./test_deps.ts";
import { ttl, x } from "./test_utils.ts";

import type { ExpandedSchema, Options } from "ldkit";
import { xsd } from "ldkit/namespaces";

import { encode } from "../library/encoder.ts";

const evaluate = (
  node: Record<string, unknown>,
  schema: ExpandedSchema,
  turtle: string,
  options: Options = {},
) => assertEquals(encode(node, schema, options), ttl(turtle));

Deno.test("Encoder / Minimal resource", () => {
  const input = {
    $id: x.A,
  };

  const output = `
      x:A a x:Item .
    `;

  const schema = { "@type": [x.Item] };

  evaluate(input, schema, output);
});

Deno.test("Encoder / Resource types", () => {
  const inputOneType = {
    $id: x.A,
    $type: x.Item,
  };

  const inputFullTypes = {
    $id: x.A,
    $type: [x.Item],
  };

  const inputExtraTypes = {
    $id: x.A,
    $type: [x.Item, x.OtherItem],
  };

  const output = `
      x:A a x:Item .
    `;

  const outputExtraTypes = `
      x:A a x:Item , x:OtherItem .
    `;

  const schema = { "@type": [x.Item] };

  evaluate(inputOneType, schema, output);
  evaluate(inputFullTypes, schema, output);
  evaluate(inputExtraTypes, schema, outputExtraTypes);
});

Deno.test("Encoder / Basic types", () => {
  const input = {
    $id: x.A,
    $type: [x.Item],
    string: "LDKit",
    integer: -5,
    decimal: 10.5,
    double: 12345678000.5,
    boolean: true,
    date: new Date("2021-11-11"),
  };

  const output = `
      x:A
        a x:Item ;
        x:string "LDKit"^^xsd:string ;
        x:integer "-5"^^xsd:integer ;
        x:decimal "1.05E1"^^xsd:decimal ;
        x:double "1.23456780005E10"^^xsd:double ;
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

  evaluate(input, schema, output);
});

Deno.test("Encoder / Array simple property", () => {
  const input = {
    $id: x.A,
    $type: [x.Item],
    array: [1, 2, 3],
  };

  const schema = {
    "@type": [x.Item],
    array: {
      "@id": x.array,
      "@type": xsd.integer,
      "@array": true as const,
    },
  };

  const output = `
      x:A
        a x:Item ;
        x:array 1, 2, 3 .
    `;

  evaluate(input, schema, output);
});

Deno.test("Encoder / Array subschema property", () => {
  const input = {
    $id: x.A,
    $type: [x.Item],
    array: [
      {
        $id: x.B,
        $type: [x.SubItem],
        value: "value B",
      },
      {
        $id: x.C,
        $type: [x.SubItem],
        value: "value C",
      },
    ],
  };

  const schema = {
    "@type": [x.Item],
    array: {
      "@id": x.array,
      "@array": true as const,
      "@schema": {
        "@type": [x.SubItem],
        value: {
          "@id": x.value,
        },
      },
    },
  };

  const output = `
      x:A
        a x:Item .
      x:B
        a x:SubItem ;
        x:value "value B" .
      x:A x:array x:B .
      x:C a x:SubItem ;
        x:value "value C" .
      x:A x:array x:C .
    `;

  evaluate(input, schema, output);
});

Deno.test("Encoder / Anonymous subschema property", () => {
  const input = {
    $id: x.A,
    $type: [x.Item],
    anonymousProperty: {
      $type: [x.SubSchema],
      value: "value in blank node",
    },
  };

  const schema = {
    "@type": [x.Item],
    anonymousProperty: {
      "@id": x.anonymousProperty,
      "@schema": {
        "@type": [x.SubSchema],
        value: {
          "@id": x.value,
        },
      },
    },
  };

  const output = `
      x:A
        a x:Item ;
        x:anonymousProperty [
          a x:SubSchema ;
          x:value "value in blank node" 
        ] .
    `;

  evaluate(input, schema, output);
});

Deno.test("Encoder / Anonymous subschema array property", () => {
  const input = {
    $id: x.A,
    $type: [x.Item],
    anonymousProperty: [
      {
        $type: [x.SubSchema],
        value: "value in blank node",
      },
      {
        $type: [x.SubSchema],
        value: "value in another blank node",
      },
    ],
  };

  const schema = {
    "@type": [x.Item],
    anonymousProperty: {
      "@id": x.anonymousProperty,
      "@array": true as const,
      "@schema": {
        "@type": [x.SubSchema],
        value: {
          "@id": x.value,
        },
      },
    },
  };

  const output = `
      x:A
        a x:Item ;
        x:anonymousProperty [
          a x:SubSchema ;
          x:value "value in blank node" 
        ] .
      x:A
        x:anonymousProperty [
          a x:SubSchema ;
          x:value "value in another blank node" 
        ] .
    `;

  evaluate(input, schema, output);
});

Deno.test("Encoder / Multilang property", () => {
  const input = {
    $id: x.A,
    $type: [x.Item],
    multilang: {
      cs: "CS",
      en: "EN",
      [""]: "Unknown",
    },
  };

  const schema = {
    "@type": [x.Item],
    multilang: {
      "@id": x.multilang,
      "@multilang": true as const,
    },
  };

  const output = `
      x:A
        a x:Item ;
        x:multilang "CS"@cs, "EN"@en, "Unknown" .
    `;

  evaluate(input, schema, output);
});

Deno.test("Encoder / Multilang array property", () => {
  const input = {
    $id: x.A,
    $type: [x.Item],
    multilang: {
      cs: ["CS 1", "CS 2", "CS 3"],
      en: ["EN"],
      [""]: ["Unknown"],
    },
  };

  const schema = {
    "@type": [x.Item],
    multilang: {
      "@id": x.multilang,
      "@multilang": true as const,
      "@array": true as const,
    },
  };

  const output = `
      x:A
        a x:Item ;
        x:multilang "CS 1"@cs, "CS 2"@cs, "CS 3"@cs, "EN"@en, "Unknown" .
    `;

  evaluate(input, schema, output);
});

Deno.test("Encoder / Localized property using a language set in context", () => {
  const input = {
    $id: x.A,
    $type: [x.Item],
    language: "CS",
  };

  const schema = {
    "@type": [x.Item],
    language: {
      "@id": x.language,
    },
  };

  const output = `
      x:A
        a x:Item ;
        x:language "CS"@cs .
    `;

  evaluate(input, schema, output, { language: "cs", sources: ["dummy"] });
});

Deno.test("Encoder / One resource multiple schemas", () => {
  const input = {
    $id: x.A,
    $type: [x.Item],
    rootProperty: "Root property",
    nested: {
      $id: x.A,
      $type: [x.SubItem],
      nestedProperty: "Nested property",
    },
  };

  const schema = {
    "@type": [x.Item],
    rootProperty: {
      "@id": x.rootProperty,
    },
    nested: {
      "@id": x.nested,
      "@schema": {
        "@type": [x.SubItem],
        nestedProperty: {
          "@id": x.nestedProperty,
        },
      },
    },
  };

  const output = `
      x:A
        a x:Item ;
        x:rootProperty "Root property" ;
        a x:SubItem ;
        x:nestedProperty "Nested property" ;
        x:nested x:A .
    `;

  evaluate(input, schema, output);
});

Deno.test("Encoder / Resource with null values", () => {
  const input = {
    $id: x.A,
    $type: [x.Item],
    someProperty: null,
    anonymousProperty: [
      {
        $type: [x.SubSchema],
        value: null,
      },
      {
        $type: [x.SubSchema],
        value: null,
      },
    ],
  };

  const schema = {
    "@type": [x.Item],
    someProperty: {
      "@id": x.someProperty,
    },
    anonymousProperty: {
      "@id": x.anonymousProperty,
      "@array": true as const,
      "@schema": {
        "@type": [x.SubSchema],
        value: {
          "@id": x.value,
        },
      },
    },
  };

  const output = `
      x:A
        a x:Item ;
        x:someProperty ?v0 ;
        x:anonymousProperty [
          a x:SubSchema ;
          x:value ?v1 
        ] .
      x:A
        x:anonymousProperty [
          a x:SubSchema ;
          x:value ?v2 
        ] .
    `;

  evaluate(input, schema, output);
});
