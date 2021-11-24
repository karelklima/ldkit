import { ttl, x } from "./utils";
import { encode } from "@ldkit/encoder";
import type { Schema } from "@ldkit/schema";
import type { Context } from "@ldkit/context";
import { ldkit, xsd } from "@ldkit/namespaces";
import {
  DataFactory,
  blankNode,
  literal,
  variable,
  namedNode,
  quad,
} from "@ldkit/rdf";
import { Parser } from "n3";

const evaluate = (
  node: Record<string, any>,
  schema: Schema,
  turtle: string,
  context: Context = {}
) => expect(encode(node, schema, context)).toStrictEqual(ttl(turtle));

describe("Encoder", () => {
  test("Minimal resource", async () => {
    const input = {
      $id: x.A,
    };

    const output = `
      x:A a x:Item .
    `;

    const schema = { "@type": [x.Item] };

    evaluate(input, schema, output);
  });

  test("Resource types", async () => {
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

  test("Basic types", async () => {
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

  test("Array simple property", async () => {
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

  test("Array subschema property", async () => {
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
        "@context": {
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

  test("Anonymous subschema property", async () => {
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
        "@context": {
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

  test("Anonymous subschema array property", async () => {
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
        "@context": {
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

  test("Multilang property", async () => {
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

  test("Multilang array property", async () => {
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

  test("Localized property using a language set in context", async () => {
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

    evaluate(input, schema, output, { language: "cs" });
  });

  test("One resource multiple schemas", async () => {
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
        "@context": {
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
});
