import { assertEquals, assertThrows } from "../test_deps.ts";
import { shaclToSchema } from "../../scripts/shacl_to_schema.ts";
import {
  type ExtraNamespace,
  type SchemaSpec,
} from "../../scripts/schema_to_script.ts";

const testSchemas = (ttl: string, schemas: SchemaSpec[]) => {
  const result = shaclToSchema(ttl);
  assertEquals(result.schemas, schemas);
};

const testSchema = (ttl: string, schema: SchemaSpec) => {
  return testSchemas(ttl, [schema]);
};

const PREFIXES = `
@prefix ex: <http://example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
`;

Deno.test(
  "Scripts / SHACL to Schema / Mixed HTTP and HTTPS schema.org IRIs: user HTTPS wins; HTTP IRIs left raw in IR",
  () => {
    // Real-world case: a SHACL file declares schema: as HTTPS schema.org
    // (modern W3C convention) but also references an HTTP schema.org IRI
    // directly via full-URI form. The user's HTTPS prefix wins the clean
    // `schema` name in the registered extras. The HTTP IRI lands in the
    // schema IR as a raw string — the printer (covered separately) falls
    // back to a literal-string emission because LDkit's built-in `schema`
    // import (which would have matched the HTTP IRI) is shadowed.
    const input = `
@prefix schema: <https://schema.org/> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<http://example.org/MixedShape> a sh:NodeShape ;
  sh:targetClass <http://example.org/Mixed> ;
  sh:property [
    sh:path schema:name ;
    sh:datatype xsd:string ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] ;
  sh:property [
    sh:path <http://schema.org/legacy> ;
    sh:datatype xsd:string ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] .
`;

    const result = shaclToSchema(input);

    assertEquals(result.schemas, [
      {
        name: "MixedSchema",
        type: ["http://example.org/Mixed"],
        properties: {
          name: { id: "https://schema.org/name" },
          legacy: { id: "http://schema.org/legacy" },
        },
      },
    ]);

    // Only the user's HTTPS schema.org is registered as an extra. The HTTP
    // IRI has no @prefix declaration in the input, so it doesn't appear here.
    assertEquals(result.extraNamespaces, [
      { iri: "https://schema.org/", prefix: "schema" },
    ]);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Project namespaces emitted as createNamespace specs",
  () => {
    // User-declared @prefix declarations whose IRI is not an LDkit built-in
    // surface as `extraNamespaces`. Built-in IRIs (xsd, sh) and unused ones
    // are filtered out. The user's prefix wins the clean name even if it
    // shadows an LDkit built-in's prefix (e.g. `schema:` here shadows LDkit's
    // built-in `schema` namespace, which uses HTTP schema.org).
    const input = `
@prefix ex: <http://example.org/vocab#> .
@prefix sub: <http://example.org/vocab/sub#> .
@prefix schema: <https://schema.org/> .
@prefix unused: <http://example.org/unused#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:ItemShape a sh:NodeShape ;
  sh:targetClass ex:Item ;
  sh:property [ sh:path ex:label ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] ;
  sh:property [ sh:path schema:dateCreated ; sh:datatype xsd:dateTime ; sh:minCount 1 ; sh:maxCount 1 ] ;
  sh:property [ sh:path sub:source ; sh:nodeKind sh:IRI ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

    const result = shaclToSchema(input);

    // Schemas use raw IRIs in the IR; the printer applies the namespace
    // prefixes downstream.
    assertEquals(result.schemas, [
      {
        name: "ExItemSchema",
        type: ["http://example.org/vocab#Item"],
        properties: {
          label: { id: "http://example.org/vocab#label" },
          dateCreated: {
            id: "https://schema.org/dateCreated",
            type: "http://www.w3.org/2001/XMLSchema#dateTime",
          },
          source: {
            id: "http://example.org/vocab/sub#source",
            type: "@id",
          },
        },
      },
    ]);

    // Three project namespaces emitted: `ex`, `sub`, `schema`. Built-in `sh`
    // and `xsd` are filtered. `unused` is dropped because no IRI references
    // it. `schema` keeps its clean name even though LDkit has a built-in
    // namespace by the same name — IRIs under the LDkit built-in fall back
    // to literal strings (not exercised here; covered by a printer test).
    const expected: ExtraNamespace[] = [
      { iri: "http://example.org/vocab#", prefix: "ex" },
      { iri: "http://example.org/vocab/sub#", prefix: "sub" },
      { iri: "https://schema.org/", prefix: "schema" },
    ];
    assertEquals(result.extraNamespaces, expected);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Malformed Turtle wraps the parser error with context",
  () => {
    // Without the wrapper, n3's error lands as an unstructured stack trace.
    // Wrapping it with a "Failed to parse Turtle" prefix gives users a clear
    // signal that the input — not the converter — is the issue.
    const input = `
@prefix ex: <http://example.org/> .

ex:PersonShape a sh:NodeShape  // <- missing terminating dot
`;

    assertThrows(() => shaclToSchema(input), Error, "Failed to parse Turtle");
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Non-node sh:property values are skipped, others convert",
  () => {
    // Some real-world SHACL files have malformed sh:property values (typos,
    // generated by buggy tools, etc.). Skipping them gracefully — instead of
    // crashing the whole conversion — lets the rest of the file succeed.
    const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property "literal-not-a-property-shape" ;
  sh:property [ sh:path ex:name ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

    // The literal sh:property value is dropped (with a stderr warning); the
    // valid blank-node property still converts.
    const schema: SchemaSpec = {
      name: "ExPersonSchema",
      type: ["http://example.org/Person"],
      properties: {
        name: { id: "http://example.org/name" },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Missing sh:path error names the enclosing shape",
  () => {
    // When a property shape has no sh:path, the error message must identify
    // *which* shape it belongs to — otherwise debugging a 14k-line SHACL is
    // a needle-in-a-haystack.
    const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [ sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

    assertThrows(() => shaclToSchema(input), Error, "PersonShape");
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Complex sh:path error names the enclosing shape",
  () => {
    // Same context-in-error rule for the unsupported-path case.
    const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [
    sh:path ( ex:hop1 ex:hop2 ) ;
    sh:datatype xsd:string
  ] .
`;

    assertThrows(() => shaclToSchema(input), Error, "PersonShape");
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Single property with default datatype",
  () => {
    const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [
    sh:path ex:name ;
    sh:datatype xsd:string ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] .
`;

    const schema: SchemaSpec = {
      name: "ExPersonSchema",
      type: ["http://example.org/Person"],
      properties: {
        name: { id: "http://example.org/name" },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test("Scripts / SHACL to Schema / Datatype mapping", () => {
  const input = `${PREFIXES}
ex:ThingShape a sh:NodeShape ;
  sh:targetClass ex:Thing ;
  sh:property [ sh:path ex:age ; sh:datatype xsd:integer ; sh:minCount 1 ; sh:maxCount 1 ] ;
  sh:property [ sh:path ex:active ; sh:datatype xsd:boolean ; sh:minCount 1 ; sh:maxCount 1 ] ;
  sh:property [ sh:path ex:born ; sh:datatype xsd:date ; sh:minCount 1 ; sh:maxCount 1 ] ;
  sh:property [ sh:path ex:created ; sh:datatype xsd:dateTime ; sh:minCount 1 ; sh:maxCount 1 ] ;
  sh:property [ sh:path ex:price ; sh:datatype xsd:decimal ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

  const schema: SchemaSpec = {
    name: "ExThingSchema",
    type: ["http://example.org/Thing"],
    properties: {
      age: {
        id: "http://example.org/age",
        type: "http://www.w3.org/2001/XMLSchema#integer",
      },
      active: {
        id: "http://example.org/active",
        type: "http://www.w3.org/2001/XMLSchema#boolean",
      },
      born: {
        id: "http://example.org/born",
        type: "http://www.w3.org/2001/XMLSchema#date",
      },
      created: {
        id: "http://example.org/created",
        type: "http://www.w3.org/2001/XMLSchema#dateTime",
      },
      price: {
        id: "http://example.org/price",
        type: "http://www.w3.org/2001/XMLSchema#decimal",
      },
    },
  };

  testSchema(input, schema);
});

Deno.test(
  "Scripts / SHACL to Schema / Optional property when minCount is missing",
  () => {
    const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [ sh:path ex:nickname ; sh:datatype xsd:string ; sh:maxCount 1 ] .
`;

    const schema: SchemaSpec = {
      name: "ExPersonSchema",
      type: ["http://example.org/Person"],
      properties: {
        nickname: {
          id: "http://example.org/nickname",
          optional: true,
        },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Array when maxCount is unbounded",
  () => {
    const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [ sh:path ex:tag ; sh:datatype xsd:string ; sh:minCount 1 ] ;
  sh:property [ sh:path ex:alias ; sh:datatype xsd:string ; sh:maxCount 5 ] .
`;

    const schema: SchemaSpec = {
      name: "ExPersonSchema",
      type: ["http://example.org/Person"],
      properties: {
        tag: {
          id: "http://example.org/tag",
          array: true,
        },
        alias: {
          id: "http://example.org/alias",
          optional: true,
          array: true,
        },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test("Scripts / SHACL to Schema / IRI reference via sh:nodeKind", () => {
  const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [ sh:path ex:homepage ; sh:nodeKind sh:IRI ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

  const schema: SchemaSpec = {
    name: "ExPersonSchema",
    type: ["http://example.org/Person"],
    properties: {
      homepage: {
        id: "http://example.org/homepage",
        type: "@id",
      },
    },
  };

  testSchema(input, schema);
});

Deno.test("Scripts / SHACL to Schema / Multilang via rdf:langString", () => {
  const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [ sh:path ex:bio ; sh:datatype rdf:langString ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

  const schema: SchemaSpec = {
    name: "ExPersonSchema",
    type: ["http://example.org/Person"],
    properties: {
      bio: {
        id: "http://example.org/bio",
        multilang: true,
      },
    },
  };

  testSchema(input, schema);
});

Deno.test("Scripts / SHACL to Schema / Nested shape via sh:node", () => {
  const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [
    sh:path ex:address ;
    sh:node ex:AddressShape ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] .

ex:AddressShape a sh:NodeShape ;
  sh:targetClass ex:Address ;
  sh:property [ sh:path ex:street ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

  const personSchema: SchemaSpec = {
    name: "ExPersonSchema",
    type: ["http://example.org/Person"],
    properties: {
      address: {
        id: "http://example.org/address",
        type: "@id",
      },
    },
  };

  const addressSchema: SchemaSpec = {
    name: "ExAddressSchema",
    type: ["http://example.org/Address"],
    properties: {
      street: { id: "http://example.org/street" },
    },
  };

  testSchemas(input, [personSchema, addressSchema]);
});

Deno.test(
  "Scripts / SHACL to Schema / Shape without targetClass uses shape IRI as type",
  () => {
    const input = `${PREFIXES}
ex:Memory a rdfs:Class, sh:NodeShape ;
  sh:property [ sh:path ex:label ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

    const schema: SchemaSpec = {
      name: "ExMemorySchema",
      type: ["http://example.org/Memory"],
      properties: {
        label: { id: "http://example.org/label" },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test("Scripts / SHACL to Schema / Multiple shapes in one file", () => {
  const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [ sh:path ex:name ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .

ex:CompanyShape a sh:NodeShape ;
  sh:targetClass ex:Company ;
  sh:property [ sh:path ex:name ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

  const personSchema: SchemaSpec = {
    name: "ExPersonSchema",
    type: ["http://example.org/Person"],
    properties: {
      name: { id: "http://example.org/name" },
    },
  };

  const companySchema: SchemaSpec = {
    name: "ExCompanySchema",
    type: ["http://example.org/Company"],
    properties: {
      name: { id: "http://example.org/name" },
    },
  };

  testSchemas(input, [personSchema, companySchema]);
});

Deno.test(
  "Scripts / SHACL to Schema / Realistic shape with mixed property kinds",
  () => {
    // Exercises a single shape combining: an rdfs:label literal property with
    // default xsd:string, an xsd:dateTime literal, an IRI-kind reference, a
    // nested-shape reference, and an unbounded-cardinality string array.
    const input = `${PREFIXES}
@prefix schema: <https://schema.org/> .

ex:ItemShape a sh:NodeShape ;
  sh:targetClass ex:Item ;
  sh:property [
    sh:path rdfs:label ;
    sh:datatype xsd:string ;
    sh:maxCount 1
  ] ;
  sh:property [
    sh:path schema:dateModified ;
    sh:datatype xsd:dateTime ;
    sh:maxCount 1
  ] ;
  sh:property [
    sh:path ex:status ;
    sh:nodeKind sh:IRI ;
    sh:maxCount 1
  ] ;
  sh:property [
    sh:path ex:category ;
    sh:node ex:CategoryShape ;
    sh:maxCount 1
  ] ;
  sh:property [
    sh:path ex:tags ;
    sh:datatype xsd:string
  ] .

ex:CategoryShape a sh:NodeShape ;
  sh:targetClass ex:Category ;
  sh:property [ sh:path rdfs:label ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

    const itemSchema: SchemaSpec = {
      name: "ExItemSchema",
      type: ["http://example.org/Item"],
      properties: {
        label: {
          id: "http://www.w3.org/2000/01/rdf-schema#label",
          optional: true,
        },
        dateModified: {
          id: "https://schema.org/dateModified",
          type: "http://www.w3.org/2001/XMLSchema#dateTime",
          optional: true,
        },
        status: {
          id: "http://example.org/status",
          type: "@id",
          optional: true,
        },
        category: {
          id: "http://example.org/category",
          type: "@id",
          optional: true,
        },
        tags: {
          id: "http://example.org/tags",
          optional: true,
          array: true,
        },
      },
    };

    const categorySchema: SchemaSpec = {
      name: "ExCategorySchema",
      type: ["http://example.org/Category"],
      properties: {
        label: { id: "http://www.w3.org/2000/01/rdf-schema#label" },
      },
    };

    testSchemas(input, [itemSchema, categorySchema]);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / sh:or of numeric datatypes picks widest",
  () => {
    const input = `${PREFIXES}
ex:ProductShape a sh:NodeShape ;
  sh:targetClass ex:Product ;
  sh:property [
    sh:path ex:price ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:or (
      [ sh:datatype xsd:integer ]
      [ sh:datatype xsd:decimal ]
      [ sh:datatype xsd:double ]
    )
  ] .
`;

    const schema: SchemaSpec = {
      name: "ExProductSchema",
      type: ["http://example.org/Product"],
      properties: {
        price: {
          id: "http://example.org/price",
          type: "http://www.w3.org/2001/XMLSchema#decimal",
          optional: true,
        },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / sh:or of sh:node refs reduces to untyped IRI",
  () => {
    const input = `${PREFIXES}
ex:AdShape a sh:NodeShape ;
  sh:targetClass ex:Ad ;
  sh:property [
    sh:path ex:creative ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:or (
      [ sh:node ex:ImageShape ]
      [ sh:node ex:VideoShape ]
    )
  ] .

ex:ImageShape a sh:NodeShape ;
  sh:targetClass ex:Image ;
  sh:property [ sh:path ex:url ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .

ex:VideoShape a sh:NodeShape ;
  sh:targetClass ex:Video ;
  sh:property [ sh:path ex:url ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

    const adSchema: SchemaSpec = {
      name: "ExAdSchema",
      type: ["http://example.org/Ad"],
      properties: {
        creative: {
          id: "http://example.org/creative",
          type: "@id",
          optional: true,
        },
      },
    };

    const imageSchema: SchemaSpec = {
      name: "ExImageSchema",
      type: ["http://example.org/Image"],
      properties: { url: { id: "http://example.org/url" } },
    };

    const videoSchema: SchemaSpec = {
      name: "ExVideoSchema",
      type: ["http://example.org/Video"],
      properties: { url: { id: "http://example.org/url" } },
    };

    testSchemas(input, [adSchema, imageSchema, videoSchema]);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / sh:or of validation-only branches drops to plain default",
  () => {
    const input = `${PREFIXES}
ex:LinkShape a sh:NodeShape ;
  sh:targetClass ex:Link ;
  sh:property [
    sh:path ex:href ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:or (
      [ sh:maxLength 3 ]
      [ sh:pattern "^https?://" ]
    )
  ] .
`;

    const schema: SchemaSpec = {
      name: "ExLinkSchema",
      type: ["http://example.org/Link"],
      properties: {
        href: {
          id: "http://example.org/href",
          optional: true,
        },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / sh:and merges branch constraints",
  () => {
    const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [
    sh:path ex:age ;
    sh:and (
      [ sh:datatype xsd:integer ]
      [ sh:minCount 1 ]
    ) ;
    sh:maxCount 1
  ] .
`;

    const schema: SchemaSpec = {
      name: "ExPersonSchema",
      type: ["http://example.org/Person"],
      properties: {
        age: {
          id: "http://example.org/age",
          type: "http://www.w3.org/2001/XMLSchema#integer",
          // sh:and merged the datatype constraint, but sh:minCount lives only
          // inside the sh:and branch — top-level minCount is missing, so the
          // property remains optional. (Validators would still enforce it.)
          optional: true,
        },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test("Scripts / SHACL to Schema / sh:not is silently ignored", () => {
  const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [
    sh:path ex:age ;
    sh:datatype xsd:integer ;
    sh:not [ sh:hasValue 0 ] ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] .
`;

  const schema: SchemaSpec = {
    name: "ExPersonSchema",
    type: ["http://example.org/Person"],
    properties: {
      age: {
        id: "http://example.org/age",
        type: "http://www.w3.org/2001/XMLSchema#integer",
      },
    },
  };

  testSchema(input, schema);
});

Deno.test(
  "Scripts / SHACL to Schema / sh:in with string values yields default string type",
  () => {
    const input = `${PREFIXES}
ex:TaskShape a sh:NodeShape ;
  sh:targetClass ex:Task ;
  sh:property [
    sh:path ex:status ;
    sh:in ( "active" "paused" "deleted" ) ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] .
`;

    const schema: SchemaSpec = {
      name: "ExTaskSchema",
      type: ["http://example.org/Task"],
      properties: {
        status: { id: "http://example.org/status" },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / sh:in with IRI values yields IRI reference",
  () => {
    const input = `${PREFIXES}
ex:TaskShape a sh:NodeShape ;
  sh:targetClass ex:Task ;
  sh:property [
    sh:path ex:state ;
    sh:in ( ex:Active ex:Paused ex:Deleted ) ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] .
`;

    const schema: SchemaSpec = {
      name: "ExTaskSchema",
      type: ["http://example.org/Task"],
      properties: {
        state: {
          id: "http://example.org/state",
          type: "@id",
        },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Self-referential sh:node falls back to untyped IRI",
  () => {
    // A Person shape with a `friend` property that points back at PersonShape
    // would create a circular schema dependency that LDkit's printer cannot
    // emit. The converter should detect the self-reference and fall back to
    // an untyped IRI reference rather than throwing.
    const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [
    sh:path ex:friend ;
    sh:node ex:PersonShape
  ] .
`;

    const schema: SchemaSpec = {
      name: "ExPersonSchema",
      type: ["http://example.org/Person"],
      properties: {
        friend: {
          id: "http://example.org/friend",
          type: "@id",
          optional: true,
          array: true,
        },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Schema names with hyphens are sanitized for TS",
  () => {
    // SHACL local parts with hyphens (or other non-identifier chars) must not
    // bleed into TypeScript const names. `Foo-Bar` becomes `Foo_Bar`.
    const input = `${PREFIXES}
ex:FacebookCarouselCard-InputShape a sh:NodeShape ;
  sh:targetClass ex:FacebookCarouselCard-Input ;
  sh:property [ sh:path ex:asset ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

    const schema: SchemaSpec = {
      name: "ExFacebookCarouselCard_InputSchema",
      type: ["http://example.org/FacebookCarouselCard-Input"],
      properties: {
        asset: { id: "http://example.org/asset" },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Merging sh:nodeKind sh:IRI with sh:node yields type: @id",
  () => {
    // Some SHACL files declare multiple sh:property shapes on the same path,
    // one with `sh:nodeKind sh:IRI` and another with `sh:node X`. Both
    // produce `type: "@id"` by default; the merge must keep `type: "@id"`.
    const input = `${PREFIXES}
ex:SummaryShape a sh:NodeShape ;
  sh:targetClass ex:Summary ;
  sh:property [ sh:path ex:campaign ; sh:nodeKind sh:IRI ; sh:maxCount 1 ] ;
  sh:property [ sh:path ex:campaign ; sh:node ex:CampaignShape ; sh:maxCount 1 ] .

ex:CampaignShape a sh:NodeShape ;
  sh:targetClass ex:Campaign ;
  sh:property [ sh:path ex:label ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

    const summarySchema: SchemaSpec = {
      name: "ExSummarySchema",
      type: ["http://example.org/Summary"],
      properties: {
        campaign: {
          id: "http://example.org/campaign",
          type: "@id",
          optional: true,
        },
      },
    };

    const campaignSchema: SchemaSpec = {
      name: "ExCampaignSchema",
      type: ["http://example.org/Campaign"],
      properties: {
        label: { id: "http://example.org/label" },
      },
    };

    testSchemas(input, [summarySchema, campaignSchema]);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Multiple property shapes on same path are merged",
  () => {
    // SHACL semantics: each sh:property is independently applied (AND).
    // The converter merges them into a single property spec to fit LDkit's
    // one-slot-per-property model.
    const input = `${PREFIXES}
ex:ReportShape a sh:NodeShape ;
  sh:targetClass ex:Report ;
  sh:property [
    sh:path ex:value ;
    sh:datatype xsd:integer
  ] ;
  sh:property [
    sh:path ex:value ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] .
`;

    const schema: SchemaSpec = {
      name: "ExReportSchema",
      type: ["http://example.org/Report"],
      properties: {
        value: {
          id: "http://example.org/value",
          type: "http://www.w3.org/2001/XMLSchema#integer",
        },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / sh:inversePath sets inverse flag",
  () => {
    const input = `${PREFIXES}
ex:PersonShape a sh:NodeShape ;
  sh:targetClass ex:Person ;
  sh:property [
    sh:path [ sh:inversePath ex:parent ] ;
    sh:nodeKind sh:IRI
  ] .
`;

    const schema: SchemaSpec = {
      name: "ExPersonSchema",
      type: ["http://example.org/Person"],
      properties: {
        parent: {
          id: "http://example.org/parent",
          type: "@id",
          inverse: true,
          optional: true,
          array: true,
        },
      },
    };

    testSchema(input, schema);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / prefixAliases option renames matching prefix in generated names",
  () => {
    const input = `
@prefix m: <https://example.com/vocab#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

m:CampaignShape a sh:NodeShape ;
  sh:targetClass m:Campaign ;
  sh:property [
    sh:path m:name ;
    sh:datatype xsd:string ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] .
`;

    const result = shaclToSchema(input, { prefixAliases: { m: "Test" } });

    assertEquals(result.schemas, [
      {
        name: "TestCampaignSchema",
        type: ["https://example.com/vocab#Campaign"],
        properties: {
          name: { id: "https://example.com/vocab#name" },
        },
      },
    ]);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / prefixAliases empty/unset preserves capitalize-prefix default",
  () => {
    const input = `
@prefix m: <https://example.com/vocab#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

m:CampaignShape a sh:NodeShape ;
  sh:targetClass m:Campaign ;
  sh:property [
    sh:path m:name ;
    sh:datatype xsd:string ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] .
`;

    const result = shaclToSchema(input);

    assertEquals(result.schemas[0].name, "MCampaignSchema");
  },
);

Deno.test(
  "Scripts / SHACL to Schema / prefixAliases only applies to matching prefix; others unchanged",
  () => {
    const input = `
@prefix m: <https://example.com/vocab#> .
@prefix ex: <http://example.org/vocab#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

m:WidgetShape a sh:NodeShape ;
  sh:targetClass m:Widget ;
  sh:property [ sh:path m:name ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .

ex:GadgetShape a sh:NodeShape ;
  sh:targetClass ex:Gadget ;
  sh:property [ sh:path ex:label ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

    const result = shaclToSchema(input, { prefixAliases: { m: "Example" } });

    const names = result.schemas.map((s) => s.name).sort();
    assertEquals(names, ["ExGadgetSchema", "ExampleWidgetSchema"]);
  },
);

Deno.test(
  "Scripts / SHACL to Schema / sh:node never emits schemaRef by default; emits type: @id",
  () => {
    const input = `${PREFIXES}
ex:OrderShape a sh:NodeShape ;
  sh:targetClass ex:Order ;
  sh:property [
    sh:path ex:customer ;
    sh:node ex:CustomerShape ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] ;
  sh:property [
    sh:path ex:item ;
    sh:class ex:Item ;
    sh:maxCount 1
  ] .

ex:CustomerShape a sh:NodeShape ;
  sh:targetClass ex:Customer ;
  sh:property [ sh:path ex:name ; sh:datatype xsd:string ; sh:minCount 1 ; sh:maxCount 1 ] .
`;

    const result = shaclToSchema(input);
    const order = result.schemas.find((s) => s.name === "ExOrderSchema")!;

    assertEquals(order.properties.customer, {
      id: "http://example.org/customer",
      type: "@id",
    });
    assertEquals(order.properties.item, {
      id: "http://example.org/item",
      type: "@id",
      optional: true,
    });

    for (const schema of result.schemas) {
      for (const [key, prop] of Object.entries(schema.properties)) {
        if (prop.schemaRef !== undefined) {
          throw new Error(
            `Expected no schemaRef in default output, but ${schema.name}.${key} has schemaRef=${prop.schemaRef}`,
          );
        }
      }
    }
  },
);

Deno.test(
  "Scripts / SHACL to Schema / Properties emitted in deterministic (alphabetical) order regardless of source order",
  () => {
    // Re-running the codegen against the same SHACL input must produce zero
    // diff. n3 Store quad iteration order is not guaranteed stable across
    // parses, so we sort property keys before returning the schema spec.
    const input = `${PREFIXES}
ex:ThingShape a sh:NodeShape ;
  sh:targetClass ex:Thing ;
  sh:property [ sh:path ex:zeta ; sh:datatype xsd:string ] ;
  sh:property [ sh:path ex:alpha ; sh:datatype xsd:string ] ;
  sh:property [ sh:path ex:mu ; sh:datatype xsd:integer ] ;
  sh:property [ sh:path ex:beta ; sh:datatype xsd:string ] .
`;

    const result = shaclToSchema(input);
    const keys = Object.keys(result.schemas[0].properties);

    assertEquals(keys, ["alpha", "beta", "mu", "zeta"]);
  },
);
