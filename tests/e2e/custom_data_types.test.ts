import { assert, assertTypeSafe, Equals } from "../test_deps.ts";

import { initStore, x } from "../test_utils.ts";

import {
  createLens,
  createNamespace,
  registerDataHandler,
  type Schema,
} from "ldkit";

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

declare module "ldkit" {
  interface CustomDataTypes {
    [geo.wktLiteral]: Point;
  }
}

Deno.test("Custom Data Type / Point / geo:wktLiteral", async () => {
  registerDataHandler(
    geo.wktLiteral,
    (literalValue: string) => Point.fromWKT(literalValue),
    (nativeValue: Point) => Point.toWKT(nativeValue),
  );

  const { options, assertStore } = initStore();

  const GeometrySchema = {
    "@type": geo.Geometry,
    point: {
      "@id": geo.asWKT,
      "@type": geo.wktLiteral,
    },
  } satisfies Schema;

  const Resource = createLens(GeometrySchema, options);

  await Resource.insert({
    $id: x.Resource,
    point: new Point(49.76700621977145, -7.556765719356096),
  });

  assertStore(`
    x:Resource
      a <http://www.opengis.net/ont/geosparql#Geometry> ;
      <http://www.opengis.net/ont/geosparql#asWKT>
        "<http://www.opengis.net/def/crs/EPSG/0/4326> POINT(49.76700621977145 -7.556765719356096)"^^<http://www.opengis.net/ont/geosparql#wktLiteral> .
  `);

  const record = await Resource.findByIri(x.Resource);

  assert(record !== null, "Record should not be null");
  assertTypeSafe<Equals<typeof record.point, Point>>();
  assert(typeof record.point === "object", "Point should be an object");
  assert(record.point.long === 49.76700621977145, "Longitude should match");
  assert(record.point.lat === -7.556765719356096, "Latitude should match");
});
