import { assertEquals } from "../test_deps.ts";
import {
  contextToSchema,
  type JsonSpec,
} from "../../scripts/context_to_schema.ts";
import { type SchemaSpec } from "../../scripts/schema_to_script.ts";

const testSchemas = async (json: JsonSpec, schemas: SchemaSpec[]) => {
  const result = await contextToSchema(json);
  assertEquals(result, schemas);
};

const testSchema = async (json: JsonSpec, schema: SchemaSpec) => {
  return await testSchemas(json, [schema]);
};

const testProperties = async (
  json: JsonSpec,
  properties: SchemaSpec["properties"],
) => {
  return await testSchema(json, {
    "name": "TheSchema",
    "type": [],
    properties,
  });
};

Deno.test("Scripts / Context to Schema / Default schema name", async () => {
  const input = {
    "schema": "http://schema.org/",
  };

  const schema = {
    name: "TheSchema",
    type: [],
    properties: {},
  };

  await testSchema(input, schema);
});

Deno.test("Scripts / Context to Schema / Schema type", async () => {
  const input = {
    "schema": "http://schema.org/",
    "@type": "schema:Person",
  };

  const schema = {
    name: "PersonSchema",
    type: ["http://schema.org/Person"],
    properties: {},
  };

  await testSchema(input, schema);
});

Deno.test("Scripts / Context to Schema / Property basics", async () => {
  const input = {
    "name": "http://schema.org/name",
    "age": "http://schema.org/age",
  };

  const properties = {
    name: {
      id: "http://schema.org/name",
    },
    age: {
      id: "http://schema.org/age",
    },
  };

  await testProperties(input, properties);
});

Deno.test("Scripts / Context to Schema / Namespace resolution", async () => {
  const input = {
    "schema": "http://schema.org/",
    "name": "schema:name",
    "age": "http://schema.org/age",
  };

  const properties = {
    name: {
      id: "http://schema.org/name",
    },
    age: {
      id: "http://schema.org/age",
    },
  };

  await testProperties(input, properties);
});

Deno.test("Scripts / Context to Schema / Property types", async () => {
  const input = {
    "schema": "http://schema.org/",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "age": {
      "@id": "schema:age",
      "@type": "xsd:integer",
    },
    "url": {
      "@id": "schema:url",
      "@type": "@id",
    },
  };

  const properties = {
    age: {
      id: "http://schema.org/age",
      type: "http://www.w3.org/2001/XMLSchema#integer",
    },
    url: {
      id: "http://schema.org/url",
      type: "@id",
    },
  };

  await testProperties(input, properties);
});

Deno.test("Scripts / Context to Schema / Array", async () => {
  const input = {
    "schema": "http://schema.org/",
    "name": {
      "@id": "schema:name",
      "@container": "@set",
    },
    "description": {
      "@id": "schema:description",
      "@container": "@list",
    },
  };

  const properties = {
    name: {
      id: "http://schema.org/name",
      array: true,
    },
    description: {
      id: "http://schema.org/description",
      array: true,
    },
  };

  await testProperties(input, properties);
});

Deno.test("Scripts / Context to Schema / Multilang", async () => {
  const input = {
    "schema": "http://schema.org/",
    "name": {
      "@id": "schema:name",
      "@container": "@language",
    },
    "description": {
      "@id": "schema:description",
      "@container": ["@language", "@set"],
    },
  };

  const properties = {
    name: {
      id: "http://schema.org/name",
      multilang: true,
    },
    description: {
      id: "http://schema.org/description",
      multilang: true,
      array: true,
    },
  };

  await testProperties(input, properties);
});

Deno.test("Scripts / Context to Schema / Inverse", async () => {
  const input = {
    "children": { "@reverse": "http://example.com/vocab#parent" },
  };

  const properties = {
    children: {
      id: "http://example.com/vocab#parent",
      inverse: true,
    },
  };

  await testProperties(input, properties);
});

Deno.test("Scripts / Context to Schema / Nested schema", async () => {
  const input = {
    "foaf": "http://xmlns.com/foaf/0.1/",
    "@type": "foaf:Person",
    "name": "foaf:name",
    "age": { "@id": "foaf:age" },
    "knows": {
      "@id": "foaf:knows",
      "@context": {
        "@type": "foaf:Person",
        "name": "foaf:name",
        "made": {
          "@id": "foaf:made",
          "@context": {
            "@type": "foaf:Project",
            "title": "foaf:title",
          },
        },
      },
    },
  };

  const schema1 = {
    name: "PersonSchema",
    type: ["http://xmlns.com/foaf/0.1/Person"],
    properties: {
      name: {
        id: "http://xmlns.com/foaf/0.1/name",
      },
      age: {
        id: "http://xmlns.com/foaf/0.1/age",
      },
      knows: {
        id: "http://xmlns.com/foaf/0.1/knows",
        schemaRef: "PersonSchema1",
      },
    },
  };

  const schema2 = {
    name: "PersonSchema1",
    type: ["http://xmlns.com/foaf/0.1/Person"],
    properties: {
      name: {
        id: "http://xmlns.com/foaf/0.1/name",
      },
      made: {
        id: "http://xmlns.com/foaf/0.1/made",
        schemaRef: "ProjectSchema",
      },
    },
  };

  const schema3 = {
    name: "ProjectSchema",
    type: ["http://xmlns.com/foaf/0.1/Project"],
    properties: {
      title: {
        id: "http://xmlns.com/foaf/0.1/title",
      },
    },
  };

  await testSchemas(input, [schema1, schema2, schema3]);
});

Deno.test("Scripts / Context to Schema / Complex context", async () => {
  const input = {
    "schema": "http://schema.org/",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "@type": "schema:Person",
    "name": "schema:name",
    "birthDate": {
      "@id": "schema:birthDate",
      "@type": "xsd:date",
    },
    "children": {
      "@reverse": "schema:parent",
      "@context": {
        "@type": "schema:Person",
        "givenName": "schema:givenName",
        "age": {
          "@id": "schema:age",
          "@type": "xsd:integer",
        },
        "parents": {
          "@id": "schema:parent",
          "@context": {
            "@type": "schema:Person",
            "name": "schema:name",
          },
          "@container": "@set",
        },
      },
      "@container": "@set",
    },
    "urls": {
      "@id": "schema:url",
      "@type": "@id",
      "@container": "@list",
    },
    "owns": {
      "@id": "schema:owns",
      "@context": {
        "@type": "schema:Product",
        "description": {
          "@id": "schema:description",
          "@container": ["@language", "@list"],
        },
        "keywords": {
          "@id": "schema:keywords",
          "@container": "@set",
        },
      },
    },
  };

  const schema1 = {
    name: "PersonSchema",
    type: ["http://schema.org/Person"],
    properties: {
      name: {
        id: "http://schema.org/name",
      },
      birthDate: {
        id: "http://schema.org/birthDate",
        type: "http://www.w3.org/2001/XMLSchema#date",
      },
      children: {
        id: "http://schema.org/parent",
        schemaRef: "PersonSchema1",
        inverse: true,
        array: true,
      },
      urls: {
        id: "http://schema.org/url",
        type: "@id",
        array: true,
      },
      owns: {
        id: "http://schema.org/owns",
        schemaRef: "ProductSchema",
      },
    },
  };

  const schema2 = {
    name: "PersonSchema1",
    type: ["http://schema.org/Person"],
    properties: {
      givenName: {
        id: "http://schema.org/givenName",
      },
      age: {
        id: "http://schema.org/age",
        type: "http://www.w3.org/2001/XMLSchema#integer",
      },
      parents: {
        id: "http://schema.org/parent",
        schemaRef: "PersonSchema2",
        array: true,
      },
    },
  };

  const schema3 = {
    name: "PersonSchema2",
    type: ["http://schema.org/Person"],
    properties: {
      name: {
        id: "http://schema.org/name",
      },
    },
  };

  const schema4 = {
    name: "ProductSchema",
    type: ["http://schema.org/Product"],
    properties: {
      description: {
        id: "http://schema.org/description",
        multilang: true,
        array: true,
      },
      keywords: {
        id: "http://schema.org/keywords",
        array: true,
      },
    },
  };

  await testSchemas(input, [schema1, schema2, schema3, schema4]);
});
