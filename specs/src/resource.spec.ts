import { createResource } from "@ldkit/resource";

import {
  createStore,
  createStoreContext,
  run,
  ttl,
  x,
  emptyStore,
} from "./utils";
import { literal, namedNode, quad, variable } from "@ldkit/rdf";
import { rdf, xsd } from "@ldkit/namespaces";

const Instant = {
  "@type": x.Instant,
  date: {
    "@id": x.inXSDDate,
    "@type": xsd.date,
  },
} as const;

const Director = {
  "@type": x.Director,
  name: x.name,
} as const;

const Movie = {
  "@type": x.Movie,
  name: x.name,
  director: {
    "@id": x.director,
    "@context": Director,
  },
  released: {
    "@id": x.released,
    "@context": Instant,
    "@optional": true,
  },
} as const;

const defaultStoreContent = ttl(`
  x:StanleyKubrick
    a x:Director ;
    x:name "Stanley Kubrick" .
  x:QuentinTarantino
    a x:Director ;
    x:name "Quentin Tarantino" .
  x:FullMetalJacket
    a x:Movie;
    x:name "Full Metal Jacket" ;
    x:director x:StanleyKubrick .
  x:Shining
    a x:Movie;
    x:name "Shining" ;
    x:director x:StanleyKubrick .
  x:PulpFiction
    a x:Movie;
    x:name "Pulp Fiction" ;
    x:director x:QuentinTarantino .
`);

const createDirector = ($id: string, name: string) => ({
  $id: x[$id],
  $type: [x.Director],
  name,
});

const Tarantino = createDirector("QuentinTarantino", "Quentin Tarantino");
const Kubrick = createDirector("StanleyKubrick", "Stanley Kubrick");

describe("Resource", () => {
  const store = createStore();
  const context = createStoreContext(store);
  const directors = createResource(Director, context);
  const movies = createResource(Movie, context);

  const assertStore = (turtle: string) => {
    const storeQuads = store.getQuads(null, null, null, null);
    const expectedQuads = ttl(turtle);
    expect(storeQuads).toEqual(expectedQuads);
  };

  beforeEach(async () => {
    await emptyStore(store);
    store.addQuads(defaultStoreContent);
  });

  test("Get many resources", async () => {
    const result = await run(directors.find());

    expect(result.length).toBe(2);
    expect(result).toContainEqual(Tarantino);
    expect(result).toContainEqual(Kubrick);
  });

  test("Get resource by IRI", async () => {
    const result = await run(directors.findByIri(Tarantino.$id));

    expect(result).toEqual(Tarantino);
  });

  test("Get multiple resources by IRI", async () => {
    const result = await run(
      directors.findByIris([Tarantino.$id, Kubrick.$id])
    );

    expect(result).toContainEqual(Tarantino);
    expect(result).toContainEqual(Kubrick);
  });

  test("Get resource by string condition", async () => {
    const condition = `?iri <${x.name}> "Quentin Tarantino" .`;
    const result = await run(directors.find(condition));

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(Tarantino);
  });

  test("Get resource by quad condition", async () => {
    const condition = quad(
      variable("iri"),
      namedNode(x.name),
      literal("Quentin Tarantino")
    );
    const result = await run(directors.find([condition]));

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(Tarantino);
  });

  test("Count resources", async () => {
    const count = await run(directors.count());
    expect(count).toBe(2);
  });

  test("Insert multiple resources", async () => {
    await emptyStore(store);
    await run(directors.insert(Kubrick, Tarantino));

    assertStore(`
      x:StanleyKubrick
        a x:Director ;
        x:name "Stanley Kubrick" .
      x:QuentinTarantino
        a x:Director ;
        x:name "Quentin Tarantino" .
    `);
  });

  test("Insert complex resource", async () => {
    const result = await run(
      movies.insert({
        $id: x.IngloriousBasterds,
        name: "Inglorious Basterds",
        director: { $id: x.QuentinTarantino },
        released: { date: new Date("2008-01-01") },
      }),
      movies.findByIri(x.IngloriousBasterds)
    );

    expect(result?.name).toEqual("Inglorious Basterds");
    expect(result?.director).toEqual(Tarantino);
    expect(result?.released?.date).toEqual(new Date("2008-01-01"));
  });

  test("Update multiple resources", async () => {
    const result = await run(
      directors.update(
        {
          $id: Kubrick.$id,
          name: "Kubrick Stanley",
        },
        {
          $id: Tarantino.$id,
          name: "Tarantino Quentin",
        }
      ),
      directors.find()
    );

    expect(result).toContainEqual({ ...Tarantino, name: "Tarantino Quentin" });
    expect(result).toContainEqual({ ...Kubrick, name: "Kubrick Stanley" });
  });

  test.skip("Update nested property in resource", async () => {
    const result = await run(
      movies.update({
        $id: x.PulpFiction,
        released: {
          date: new Date("1994-01-01"),
        },
      }),
      movies.findByIri(x.PulpFiction)
    );

    expect(result!.released?.date).toEqual(new Date("1994-01-01"));
  });

  test("Delete multiple resources", async () => {
    const dirs = await run(
      directors.delete(Tarantino, Kubrick),
      directors.find()
    );
    expect(dirs.length).toBe(0);
  });

  test("Insert data", async () => {
    const result = await run(
      directors.insert({
        $id: x.ChristopherNolan,
      }),
      directors.insertData(
        quad(
          namedNode(x.ChristopherNolan),
          namedNode(x.name),
          literal("Christopher Nolan")
        )
      ),
      directors.findByIri(x.ChristopherNolan)
    );
    expect(result).toEqual({
      $id: x.ChristopherNolan,
      $type: [x.Director],
      name: "Christopher Nolan",
    });
  });

  test("Delete data", async () => {
    const result = await run(
      directors.insert({
        $id: x.ChristopherNolan,
        $type: [x.Director, x.CustomType],
        name: "Christopher Nolan",
      }),
      directors.deleteData(
        quad(
          namedNode(x.ChristopherNolan),
          namedNode(rdf.type),
          namedNode(x.CustomType)
        )
      ),
      directors.findByIri(x.ChristopherNolan)
    );
    expect(result).toEqual({
      $id: x.ChristopherNolan,
      $type: [x.Director],
      name: "Christopher Nolan",
    });
  });

  test("Support for custom types", async () => {
    const result = await run(
      movies.insert({
        $id: x.KillBill,
        $type: [x.TarantinoMovie],
        name: "Kill Bill",
        director: { $id: x.QuentinTarantino },
      }),
      movies.findByIri(x.KillBill)
    );

    expect(result?.$type).toEqual([x.Movie, x.TarantinoMovie]);
  });
});
