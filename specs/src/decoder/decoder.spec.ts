import { createGraph, x } from "./utils";
import { decode } from "@ldkit/decoder";
import type { Schema } from "@ldkit/schema";
import type { Context } from "@ldkit/context";
import { ldkit, xsd } from "@ldkit/namespaces";

const decodeGraph = (turtle: string, schema: Schema, context: Context = {}) =>
  decode(createGraph(turtle), schema, context);

const evaluate = (
  turtle: string,
  schema: Schema,
  result: Record<string, any>[],
  context: Context = {}
) => expect(decodeGraph(turtle, schema, context)).toEqual(result);

describe("Decoder", () => {
  test("Minimal resource", async () => {
    const input = `
      x:A a ldkit:Resource, x:Item .
    `;

    const schema = { "@type": [x("Item")] };

    const output = [
      {
        $id: x("A"),
        $type: [x("Item")],
      },
    ];

    evaluate(input, schema, output);
  });

  test("Multiple minimal resources", async () => {
    const input = `
      x:A a ldkit:Resource, x:Item .
      x:B a ldkit:Resource, x:Item .
      x:C a ldkit:Resource, x:Item .
    `;

    const schema = { "@type": [x("Item")] };

    const output = [
      {
        $id: x("A"),
        $type: [x("Item")],
      },
      {
        $id: x("B"),
        $type: [x("Item")],
      },
      {
        $id: x("C"),
        $type: [x("Item")],
      },
    ];

    evaluate(input, schema, output);
  });

  test("Basic types", async () => {
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
      "@type": [x("Item")],
      string: {
        "@id": x("string"),
        "@type": xsd.string,
      },
      integer: {
        "@id": x("integer"),
        "@type": xsd.integer,
      },
      decimal: {
        "@id": x("decimal"),
        "@type": xsd.decimal,
      },
      double: {
        "@id": x("double"),
        "@type": xsd.double,
      },
      boolean: {
        "@id": x("boolean"),
        "@type": xsd.boolean,
      },
      date: {
        "@id": x("date"),
        "@type": xsd.date,
      },
    };

    const output = [
      {
        $id: x("A"),
        $type: [x("Item")],
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

  test("Required property missing", async () => {
    const input = `
      x:A a ldkit:Resource, x:Item .
    `;

    const schema = {
      "@type": [x("Item")],
      required: {
        "@id": x("required"),
      },
    };

    expect(() => decodeGraph(input, schema)).toThrowError();
  });

  test("Optional property missing", async () => {
    const input = `
      x:A a ldkit:Resource, x:Item .
    `;

    const schema = {
      "@type": [x("Item")],
      optional: {
        "@id": x("optional"),
        "@optional": true as const,
      },
    };

    const output = [
      {
        $id: x("A"),
        $type: [x("Item")],
      },
    ];

    evaluate(input, schema, output);
  });

  test("Optional array property missing", async () => {
    const input = `
      x:A a ldkit:Resource, x:Item .
    `;

    const schema = {
      "@type": [x("Item")],
      optional: {
        "@id": x("optional"),
        "@optional": true as const,
        "@array": true as const,
      },
    };

    const output = [
      {
        $id: x("A"),
        $type: [x("Item")],
        optional: [],
      },
    ];

    evaluate(input, schema, output);
  });

  test("Array simple property", async () => {
    const input = `
      x:A
        a ldkit:Resource, x:Item ;
        x:array 1, 2, 3 .
    `;

    const schema = {
      "@type": [x("Item")],
      array: {
        "@id": x("array"),
        "@array": true as const,
      },
    };

    const output = [
      {
        $id: x("A"),
        $type: [x("Item")],
        array: [1, 2, 3],
      },
    ];

    evaluate(input, schema, output);
  });

  test("Array subschema property", async () => {
    const input = `
      x:A
        a ldkit:Resource, x:Item ;
        x:array x:B, x:C .
      x:B
        a x:SubItem ;
        x:value "value B" .
      x:C a x:SubItem ;
        x:value "value C" .
    `;

    const schema = {
      "@type": [x("Item")],
      array: {
        "@id": x("array"),
        "@array": true as const,
        "@context": {
          "@type": [x("SubItem")],
          value: {
            "@id": x("value"),
          },
        },
      },
    };

    const output = [
      {
        $id: x("A"),
        $type: [x("Item")],
        array: [
          {
            $id: x("B"),
            $type: [x("SubItem")],
            value: "value B",
          },
          {
            $id: x("C"),
            $type: [x("SubItem")],
            value: "value C",
          },
        ],
      },
    ];

    evaluate(input, schema, output);
  });

  test("Multilang property", async () => {
    const input = `
      x:A
        a ldkit:Resource, x:Item ;
        x:multilang "CS"@cs, "EN"@en, "Unknown" .
    `;

    const schema = {
      "@type": [x("Item")],
      multilang: {
        "@id": x("multilang"),
        "@multilang": true as const,
      },
    };

    const output = [
      {
        $id: x("A"),
        $type: [x("Item")],
        multilang: {
          cs: "CS",
          en: "EN",
          [""]: "Unknown",
        },
      },
    ];

    evaluate(input, schema, output);
  });

  test("Multilang array property", async () => {
    const input = `
      x:A
        a ldkit:Resource, x:Item ;
        x:multilang "CS 1"@cs, "CS 2"@cs, "CS 3"@cs, "EN"@en, "Unknown" .
    `;

    const schema = {
      "@type": [x("Item")],
      multilang: {
        "@id": x("multilang"),
        "@multilang": true as const,
        "@array": true as const,
      },
    };

    const output = [
      {
        $id: x("A"),
        $type: [x("Item")],
        multilang: {
          cs: ["CS 1", "CS 2", "CS 3"],
          en: ["EN"],
          [""]: ["Unknown"],
        },
      },
    ];

    evaluate(input, schema, output);
  });

  test("Preferred language property", async () => {
    const input = `
      x:A
        a ldkit:Resource, x:Item ;
        x:preferredLanguage "DE"@de, "CS"@cs, "EN"@en .
    `;

    const schema = {
      "@type": [x("Item")],
      preferredLanguage: {
        "@id": x("preferredLanguage"),
      },
    };

    const output = [
      {
        $id: x("A"),
        $type: [x("Item")],
        preferredLanguage: "CS",
      },
    ];

    evaluate(input, schema, output, { language: "cs" });
  });

  test("Preferred first property", async () => {
    const input = `
      x:A
        a ldkit:Resource, x:Item ;
        x:preferredFirst "DE"@de, "CS"@cs, "EN"@en .
    `;

    const schema = {
      "@type": [x("Item")],
      preferredFirst: {
        "@id": x("preferredFirst"),
      },
    };

    const output = [
      {
        $id: x("A"),
        $type: [x("Item")],
        preferredFirst: "DE",
      },
    ];

    evaluate(input, schema, output);
  });
});
