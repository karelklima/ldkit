import { assertEquals } from "../test_deps.ts";
import {
  type SchemaSpec,
  schemaToScript,
} from "../../scripts/schema_to_script.ts";

function s(strings: TemplateStringsArray) {
  const str = strings.join("");
  const [_first, ...lines] = str.split("\n");
  const space = lines[0].length - lines[0].trimStart().length;
  return lines.map((line) => line.substring(space).trimEnd()).join("\n");
}

const test = (schemas: SchemaSpec[], script: string) => {
  const result = schemaToScript(schemas);
  assertEquals(result, script);
};

Deno.test("Scripts / Schema To Script / Empty schema", () => {
  const schema = {
    name: "TheSchema",
    type: [],
    properties: {},
  };

  const script = s`
    export const TheSchema = {
    } as const;
  `;

  test([schema], script);
});

Deno.test("Scripts / Schema To Script / One schema type", () => {
  const schema = {
    name: "TheSchema",
    type: ["http://schema.org/Person"],
    properties: {},
  };

  const script = s`
    import { schema } from "ldkit/namespaces";

    export const TheSchema = {
      "@type": schema.Person,
    } as const;
  `;

  test([schema], script);
});

Deno.test("Scripts / Schema To Script / Multiple schema types", () => {
  const schema = {
    name: "TheSchema",
    type: ["http://schema.org/Person", "http://schema.org/Thing"],
    properties: {},
  };

  const script = s`
    import { schema } from "ldkit/namespaces";

    export const TheSchema = {
      "@type": [
        schema.Person,
        schema.Thing,
      ],
    } as const;
  `;

  test([schema], script);
});

Deno.test("Scripts / Schema To Script / Schema ordering of explicit subschemas", () => {
  const schema1 = {
    name: "PersonSchema",
    type: ["http://schema.org/Person"],
    properties: {
      knows: {
        id: "http://schema.org/knows",
        schemaRef: "OtherPersonSchema",
      },
    },
  };

  const schema2 = {
    name: "OtherPersonSchema",
    type: ["http://schema.org/Person"],
    properties: {
      knows: {
        id: "http://schema.org/knows",
        schemaRef: "YetAnotherPersonSchema",
      },
    },
  };

  const schema3 = {
    name: "YetAnotherPersonSchema",
    type: ["http://schema.org/Person"],
    properties: {},
  };

  const script = s`
    import { schema } from "ldkit/namespaces";

    export const YetAnotherPersonSchema = {
      "@type": schema.Person,
    } as const;

    export const OtherPersonSchema = {
      "@type": schema.Person,
      knows: {
        "@id": schema.knows,
        "@schema": YetAnotherPersonSchema,
      },
    } as const;

    export const PersonSchema = {
      "@type": schema.Person,
      knows: {
        "@id": schema.knows,
        "@schema": OtherPersonSchema,
      },
    } as const;
  `;

  test([schema1, schema2, schema3], script);
  test([schema1, schema3, schema2], script);
  test([schema3, schema1, schema2], script);
  test([schema3, schema2, schema1], script);
});

Deno.test("Scripts / Schema To Script / Schema with implicit subschemas", () => {
  const schema = {
    name: "PersonSchema",
    type: ["http://schema.org/Person"],
    properties: {
      knows: {
        id: "http://schema.org/knows",
        schema: {
          name: "OtherPersonSchema",
          type: ["http://schema.org/Person"],
          properties: {
            knows: {
              id: "http://schema.org/knows",
              schema: {
                name: "YetAnotherPersonSchema",
                type: ["http://schema.org/Person"],
                properties: {},
              },
            },
          },
        },
      },
    },
  };

  const script = s`
    import { schema } from "ldkit/namespaces";

    export const PersonSchema = {
      "@type": schema.Person,
      knows: {
        "@id": schema.knows,
        "@schema": {
          "@type": schema.Person,
          knows: {
            "@id": schema.knows,
            "@schema": {
              "@type": schema.Person,
            },
          },
        },
      },
    } as const;
  `;

  test([schema], script);
});

Deno.test("Scripts / Schema To Script / Property basics", () => {
  const schema = {
    name: "TheSchema",
    type: [],
    properties: {
      givenName: {
        id: "http://schema.org/givenName",
      },
      lastName: {
        id: "http://schema.org/lastName",
        type: "http://www.w3.org/2001/XMLSchema#string",
      },
      age: {
        id: "http://schema.org/age",
        type: "http://www.w3.org/2001/XMLSchema#integer",
      },
      depiction: {
        id: "http://schema.org/depiction",
        type: "@id",
      },
      custom: {
        id: "http://example.com/custom",
        type: "http://example.com/customType",
      },
    },
  };

  const script = s`
    import { ldkit, schema, xsd } from "ldkit/namespaces";

    export const TheSchema = {
      givenName: schema.givenName,
      lastName: schema.lastName,
      age: {
        "@id": schema.age,
        "@type": xsd.integer,
      },
      depiction: {
        "@id": schema.depiction,
        "@type": ldkit.IRI,
      },
      custom: {
        "@id": "http://example.com/custom",
        "@type": "http://example.com/customType",
      },
    } as const;
  `;

  test([schema], script);
});

Deno.test("Scripts / Schema To Script / Property flags", () => {
  const schema = {
    name: "TheSchema",
    type: [],
    properties: {
      name: {
        id: "http://schema.org/name",
        optional: true,
        inverse: true,
      },
      age: {
        id: "http://schema.org/age",
        type: "http://www.w3.org/2001/XMLSchema#integer",
        array: true,
        multilang: true,
      },
    },
  };

  const script = s`
    import { schema, xsd } from "ldkit/namespaces";

    export const TheSchema = {
      name: {
        "@id": schema.name,
        "@optional": true,
        "@inverse": true,
      },
      age: {
        "@id": schema.age,
        "@type": xsd.integer,
        "@array": true,
        "@multilang": true,
      },
    } as const;
  `;

  test([schema], script);
});
