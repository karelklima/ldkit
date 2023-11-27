import { assert, assertTypeSafe, Comunica, Equals } from "../test_deps.ts";

import { initStore, x } from "../test_utils.ts";

import { createLens } from "ldkit";
import { xsd } from "ldkit/namespaces";

const engine = new Comunica();

Deno.test("Data Type / Boolean / xsd:boolean", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.boolean,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: true,
  });

  assertStore(`
    x:Resource
      x:property "true"^^xsd:boolean .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, boolean>>();
  assert(typeof record.property === "boolean");
  assert(record.property === true);
});

Deno.test("Data Type / Integer / xsd:integer", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.integer,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 100,
  });

  assertStore(`
    x:Resource
      x:property "100"^^xsd:integer .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 100);
});

Deno.test("Data Type / Integer / xsd:long", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.long,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 1000000000000,
  });

  assertStore(`
    x:Resource
      x:property "1000000000000"^^xsd:long .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 1000000000000);
});

Deno.test("Data Type / Integer / xsd:int", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.int,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 1000,
  });

  assertStore(`
    x:Resource
      x:property "1000"^^xsd:int .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 1000);
});

Deno.test("Data Type / Integer / xsd:byte", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.byte,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 10,
  });

  assertStore(`
    x:Resource
      x:property "10"^^xsd:byte .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 10);
});

Deno.test("Data Type / Integer / xsd:short", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.short,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 100,
  });

  assertStore(`
    x:Resource
      x:property "100"^^xsd:short .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 100);
});

Deno.test("Data Type / Integer / xsd:negativeInteger", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.negativeInteger,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: -100,
  });

  assertStore(`
    x:Resource
      x:property "-100"^^xsd:negativeInteger .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === -100);
});

Deno.test("Data Type / Integer / xsd:nonNegativeInteger", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.nonNegativeInteger,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 100,
  });

  assertStore(`
    x:Resource
      x:property "100"^^xsd:nonNegativeInteger .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 100);
});

Deno.test("Data Type / Integer / xsd:nonPositiveInteger", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.nonPositiveInteger,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: -100,
  });

  assertStore(`
    x:Resource
      x:property "-100"^^xsd:nonPositiveInteger .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === -100);
});

Deno.test("Data Type / Integer / xsd:positiveInteger", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.positiveInteger,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 100,
  });

  assertStore(`
    x:Resource
      x:property "100"^^xsd:positiveInteger .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 100);
});

Deno.test("Data Type / Integer / xsd:unsignedByte", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.unsignedByte,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 100,
  });

  assertStore(`
    x:Resource
      x:property "100"^^xsd:unsignedByte .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 100);
});

Deno.test("Data Type / Integer / xsd:unsignedInt", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.unsignedInt,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 100,
  });

  assertStore(`
    x:Resource
      x:property "100"^^xsd:unsignedInt .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 100);
});

Deno.test("Data Type / Integer / xsd:unsignedLong", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.unsignedLong,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 100,
  });

  assertStore(`
    x:Resource
      x:property "100"^^xsd:unsignedLong .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 100);
});

Deno.test("Data Type / Integer / xsd:unsignedShort", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.unsignedShort,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 100,
  });

  assertStore(`
    x:Resource
      x:property "100"^^xsd:unsignedShort .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 100);
});

Deno.test("Data Type / Double / xsd:double", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.double,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 10.5,
  });

  assertStore(`
    x:Resource
      x:property "1.05E1"^^xsd:double .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 10.5);
});

Deno.test("Data Type / Double / xsd:decimal", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.decimal,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 10.5,
  });

  assertStore(`
    x:Resource
      x:property "1.05E1"^^xsd:decimal .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 10.5);
});

Deno.test("Data Type / Double / xsd:float", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.float,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: 10.5,
  });

  assertStore(`
    x:Resource
      x:property "1.05E1"^^xsd:float .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, number>>();
  assert(typeof record.property === "number");
  assert(record.property === 10.5);
});

Deno.test("Data Type / String / xsd:string", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.string,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "abc",
  });

  assertStore(`
    x:Resource
      x:property "abc" .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "abc");
});

Deno.test("Data Type / String / xsd:normalizedString", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.normalizedString,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "abc",
  });

  assertStore(`
    x:Resource
      x:property "abc"^^xsd:normalizedString .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "abc");
});

Deno.test("Data Type / String / xsd:anyURI", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.anyURI,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "http://example.com",
  });

  assertStore(`
    x:Resource
      x:property "http://example.com"^^xsd:anyURI .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "http://example.com");
});

Deno.test("Data Type / String / xsd:base64Binary", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.base64Binary,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "SGVsbG8gd29ybGQ=",
  });

  assertStore(`
    x:Resource
      x:property "SGVsbG8gd29ybGQ="^^xsd:base64Binary .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "SGVsbG8gd29ybGQ=");
});

Deno.test("Data Type / String / xsd:language", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.language,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "en",
  });

  assertStore(`
    x:Resource
      x:property "en"^^xsd:language .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "en");
});

Deno.test("Data Type / String / xsd:Name", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.Name,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "name",
  });

  assertStore(`
    x:Resource
      x:property "name"^^xsd:Name .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "name");
});

Deno.test("Data Type / String / xsd:NCName", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.NCName,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "ncname",
  });

  assertStore(`
    x:Resource
      x:property "ncname"^^xsd:NCName .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "ncname");
});

Deno.test("Data Type / String / xsd:NMTOKEN", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.NMTOKEN,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "nmtoken",
  });

  assertStore(`
    x:Resource
      x:property "nmtoken"^^xsd:NMTOKEN .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "nmtoken");
});

Deno.test("Data Type / String / xsd:token", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.token,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "token",
  });

  assertStore(`
    x:Resource
      x:property "token"^^xsd:token .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "token");
});

Deno.test("Data Type / String / xsd:hexBinary", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.hexBinary,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "48656C6C6F",
  });

  assertStore(`
    x:Resource
      x:property "48656C6C6F"^^xsd:hexBinary .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "48656C6C6F");
});

Deno.test("Data Type / String / xsd:time", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.time,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "00:00:00",
  });

  assertStore(`
    x:Resource
      x:property "00:00:00"^^xsd:time .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "00:00:00");
});

Deno.test("Data Type / String / xsd:duration", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.duration,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: "P2Y6M5DT12H35M30S",
  });

  assertStore(`
    x:Resource
      x:property "P2Y6M5DT12H35M30S"^^xsd:duration .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, string>>();
  assert(typeof record.property === "string");
  assert(record.property === "P2Y6M5DT12H35M30S");
});

Deno.test("Data Type / Date / xsd:dateTime", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.dateTime,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: new Date("2012-03-17T23:00:00.000Z"),
  });

  assertStore(`
    x:Resource
      x:property "2012-03-17T23:00:00.000Z"^^xsd:dateTime .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, Date>>();
  assert(typeof record.property === "object");
  assert(
    record.property.getTime() ===
      new Date("2012-03-17T23:00:00.000Z").getTime(),
  );
});

Deno.test("Data Type / Date / xsd:date", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.date,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: new Date("2012-03-17"),
  });

  assertStore(`
    x:Resource
      x:property "2012-03-17"^^xsd:date .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, Date>>();
  assert(typeof record.property === "object");
  assert(
    record.property.getTime() ===
      new Date("2012-03-17T00:00:00.000Z").getTime(),
  );
});

Deno.test("Data Type / Date / xsd:gDay", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.gDay,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: new Date(Date.UTC(0, 0, 17)),
  });

  assertStore(`
    x:Resource
      x:property "17"^^xsd:gDay .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, Date>>();
  assert(typeof record.property === "object");
  assert(record.property.getTime() === new Date(0, 0, 17).getTime());
});

Deno.test("Data Type / Date / xsd:gMonthDay", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.gMonthDay,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: new Date(Date.UTC(0, 2, 17)),
  });

  assertStore(`
    x:Resource
      x:property "3-17"^^xsd:gMonthDay .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, Date>>();
  assert(typeof record.property === "object");
  assert(record.property.getTime() === new Date(0, 2, 17).getTime());
});

Deno.test("Data Type / Date / xsd:gYear", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.gYear,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: new Date(Date.UTC(2012, 0, 1)),
  });

  assertStore(`
    x:Resource
      x:property "2012"^^xsd:gYear .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, Date>>();
  assert(typeof record.property === "object");
  assert(record.property.getTime() === Date.UTC(2012, 0, 1));
});

Deno.test("Data Type / Date / xsd:gYearMonth", async () => {
  const { context, assertStore } = initStore();
  const ResourceSchema = {
    property: {
      "@id": x.property,
      "@type": xsd.gYearMonth,
    },
  };

  const Resource = createLens(ResourceSchema, context, engine);

  await Resource.insert({
    $id: x.Resource,
    property: new Date(Date.UTC(2012, 2, 1)),
  });

  assertStore(`
    x:Resource
      x:property "2012-3"^^xsd:gYearMonth .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null);
  assertTypeSafe<Equals<typeof record.property, Date>>();
  assert(typeof record.property === "object");
  assert(record.property.getTime() === new Date(2012, 2, 1).getTime());
});
