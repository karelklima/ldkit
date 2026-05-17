import { assertEquals } from "../test_deps.ts";
import {
  type ExtraNamespace,
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

const testWithExtras = (
  schemas: SchemaSpec[],
  extras: ExtraNamespace[],
  script: string,
) => {
  const result = schemaToScript(schemas, extras);
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

Deno.test("Scripts / Schema To Script / Property name escaping", () => {
  const schema = {
    name: "TheSchema",
    type: [],
    properties: {
      name: {
        id: "http://schema.org/name",
      },
      givenName: {
        id: "http://schema.org/givenName",
      },
      "country-name": {
        id: "http://example.com/country-name",
      },
      "postal-code:": {
        id: "http://example.com/postal-code",
        type: "http://www.w3.org/2001/XMLSchema#integer",
      },
    },
  };

  const script = s`
    import { schema, xsd } from "ldkit/namespaces";

    export const TheSchema = {
      name: schema.name,
      givenName: schema.givenName,
      "country-name": "http://example.com/country-name",
      "postal-code:": {
        "@id": "http://example.com/postal-code",
        "@type": xsd.integer,
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

Deno.test("Scripts / Schema To Script / Extra namespace emits createNamespace block", () => {
  const schema: SchemaSpec = {
    name: "PersonSchema",
    type: ["http://example.org/vocab#Person"],
    properties: {
      name: { id: "http://example.org/vocab#name" },
      age: {
        id: "http://example.org/vocab#age",
        type: "http://www.w3.org/2001/XMLSchema#integer",
      },
    },
  };

  const extras: ExtraNamespace[] = [
    { iri: "http://example.org/vocab#", prefix: "ex" },
  ];

  const script = s`
    import { createNamespace } from "ldkit";
    import { xsd } from "ldkit/namespaces";

    export const ex = createNamespace(
      {
        iri: "http://example.org/vocab#",
        prefix: "ex:",
        terms: [
          "Person",
          "age",
          "name",
        ],
      } as const,
    );

    export const PersonSchema = {
      "@type": ex.Person,
      name: ex.name,
      age: {
        "@id": ex.age,
        "@type": xsd.integer,
      },
    } as const;
  `;

  testWithExtras([schema], extras, script);
});

Deno.test("Scripts / Schema To Script / Extra namespace bracket access for non-identifier local parts", () => {
  // Hyphens, dots, etc. are valid in IRI local parts but invalid in TS dot
  // access. The printer must use bracket access for those.
  const schema: SchemaSpec = {
    name: "AdSchema",
    type: ["https://ex.org/Ad-Type"],
    properties: {
      ref: { id: "https://ex.org/foo-bar" },
    },
  };

  const extras: ExtraNamespace[] = [
    { iri: "https://ex.org/", prefix: "ex" },
  ];

  const script = s`
    import { createNamespace } from "ldkit";

    export const ex = createNamespace(
      {
        iri: "https://ex.org/",
        prefix: "ex:",
        terms: [
          "Ad-Type",
          "foo-bar",
        ],
      } as const,
    );

    export const AdSchema = {
      "@type": ex["Ad-Type"],
      ref: ex["foo-bar"],
    } as const;
  `;

  testWithExtras([schema], extras, script);
});

Deno.test("Scripts / Schema To Script / Extra namespaces sorted by IRI length descending", () => {
  // When multiple extras share a base IRI prefix, the longest must match
  // first so that `https://ex.org/sub/foo` resolves to `exsub.foo`, not
  // `ex.sub/foo` (which would be a lexer error).
  const schema: SchemaSpec = {
    name: "TheSchema",
    type: [],
    properties: {
      a: { id: "https://ex.org/a" },
      b: { id: "https://ex.org/sub/b" },
    },
  };

  const extras: ExtraNamespace[] = [
    { iri: "https://ex.org/", prefix: "ex" },
    { iri: "https://ex.org/sub/", prefix: "exsub" },
  ];

  const script = s`
    import { createNamespace } from "ldkit";

    export const exsub = createNamespace(
      {
        iri: "https://ex.org/sub/",
        prefix: "exsub:",
        terms: [
          "b",
        ],
      } as const,
    );

    export const ex = createNamespace(
      {
        iri: "https://ex.org/",
        prefix: "ex:",
        terms: [
          "a",
        ],
      } as const,
    );

    export const TheSchema = {
      a: ex.a,
      b: exsub.b,
    } as const;
  `;

  testWithExtras([schema], extras, script);
});

Deno.test("Scripts / Schema To Script / Unused extra namespaces are dropped", () => {
  // An extra namespace passed in but unreferenced by any schema should NOT
  // produce a createNamespace block (would be dead code in the output).
  const schema: SchemaSpec = {
    name: "TheSchema",
    type: [],
    properties: {
      name: { id: "http://schema.org/name" },
    },
  };

  const extras: ExtraNamespace[] = [
    { iri: "https://unused.example/", prefix: "unused" },
  ];

  const script = s`
    import { schema } from "ldkit/namespaces";

    export const TheSchema = {
      name: schema.name,
    } as const;
  `;

  testWithExtras([schema], extras, script);
});

Deno.test("Scripts / Schema To Script / Extra namespace shadowing a built-in: built-in import dropped, IRIs under it fall back to literal", () => {
  // When a user-defined extra namespace shares its prefix name with an
  // LDkit built-in (e.g. user `schema:` for HTTPS schema.org vs LDkit's
  // built-in `schema` for HTTP schema.org), the user's prefix wins the
  // clean name. The corresponding built-in is NOT imported, so any IRIs
  // that would have matched it render as literal strings.
  const schema: SchemaSpec = {
    name: "TheSchema",
    type: ["https://schema.org/Person"],
    properties: {
      name: { id: "https://schema.org/name" }, // matches user's HTTPS namespace
      legacyName: { id: "http://schema.org/name" }, // would match LDkit built-in but built-in is shadowed
    },
  };

  const extras: ExtraNamespace[] = [
    { iri: "https://schema.org/", prefix: "schema" },
  ];

  const script = s`
    import { createNamespace } from "ldkit";

    export const schema = createNamespace(
      {
        iri: "https://schema.org/",
        prefix: "schema:",
        terms: [
          "Person",
          "name",
        ],
      } as const,
    );

    export const TheSchema = {
      "@type": schema.Person,
      name: schema.name,
      legacyName: "http://schema.org/name",
    } as const;
  `;

  testWithExtras([schema], extras, script);
});

Deno.test("Scripts / Schema To Script / IRI not under any namespace falls back to literal", () => {
  // If no extra or built-in namespace matches, the IRI is emitted as a raw
  // string literal. Confirms existing behavior survives extra-namespace
  // handling.
  const schema: SchemaSpec = {
    name: "TheSchema",
    type: [],
    properties: {
      orphan: { id: "https://nobody.example/foo" },
    },
  };

  const extras: ExtraNamespace[] = [
    { iri: "https://other.example/", prefix: "other" },
  ];

  const script = s`
    export const TheSchema = {
      orphan: "https://nobody.example/foo",
    } as const;
  `;

  testWithExtras([schema], extras, script);
});
