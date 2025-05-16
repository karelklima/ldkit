# Custom data types

In addition to [built-in data types](./supported-data-types), LDkit supports
custom two-way conversion between RDF based data types and JavaScript /
TypeScript native types. Both data and TypeScript types are adequately
converted.

This is useful when working with complex data formats, such as geometrical
points, dates, monetary values, or domain-specific representations that require
special parsing and serialization.

In order to support custom types, you must provide a proper TypeScript type
definition and register conversion functions to translate between RDF literal
values and JavaScript primitives.

## Use Case Example: Handling Geospatial Coordinates (WKT)

In this guide, we will demonstrate how to handle geospatial coordinates using
the
[WKT (Well-Known Text)](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry)
format by mapping it to a custom `Point` class in TypeScript.

### Step 1: Create `Point` class implementation

Below is a simple class representing a geographical point with longitude and
latitude properties. Function `fromWKT` parses a WKT string and converts it into
a `Point` object. Function `toWKT` serializes a `Point` object back into a WKT
string.

```ts
class Point {
  constructor(public long: number, public lat: number) {}

  static fromWKT(wkt: string): Point {
    const match = wkt.match(/POINT\(([^ ]+) ([^ ]+)\)/);
    if (!match) {
      throw new Error("Invalid WKT format");
    }
    const [, long, lat] = match;
    return new Point(parseFloat(long), parseFloat(lat));
  }

  static toWKT(point: Point): string {
    return `<http://www.opengis.net/def/crs/EPSG/0/4326> POINT(${point.long} ${point.lat})`;
  }
}
```

### Step 2: Create a custom namespace and schema

```ts
import { createNamespace, type Schema } from "ldkit";

const geo = createNamespace(
  {
    iri: "http://www.opengis.net/ont/geosparql#",
    prefix: "geo:",
    terms: [
      "Geometry",
      "asWKT",
      "wktLiteral",
    ],
  } as const,
);

const GeometrySchema = {
  "@type": geo.Geometry,
  point: {
    "@id": geo.asWKT,
    "@type": geo.wktLiteral, // This is the custom type definition in schema
  },
} satisfies Schema;
```

### Step 3: Register the new custom type with LDkit

There are two parts to registering a new custom type. First, the
`CustomDataTypes` interface must be augmented to include a mapping from the new
type to the desired TypeScript type. Second, conversion functions must be
provided using the `registerDataHandler` function.

```ts
import { registerDataHandler } from "ldkit";

// TypeScript compile time type conversion
declare module "ldkit" {
  interface CustomDataTypes {
    [geo.wktLiteral]: Point;
  }
}

// Actual runtime data conversion
registerDataHandler(
  geo.wktLiteral,
  (literalValue: string) => Point.fromWKT(literalValue),
  (nativeValue: Point) => Point.toWKT(nativeValue),
);
```

### Step 4: Query and update data

Having registered the custom data type, you can use it directly in LDkit for
both reading and writing RDF data.

```ts
const Entities = createLens(GeometrySchema);

await Entities.insert({
  $id: "http://example.org/geometry/testGeometry",
  point: new Point(49.76700621977145, -7.556765719356096),
});

const record = await Entities.findByIri(
  "http://example.org/geometry/testGeometry",
);

console.log(record.point); // Point { long: 49.76700621977145, lat: -7.556765719356096 }
```
