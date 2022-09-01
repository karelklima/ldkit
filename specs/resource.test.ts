import {
  describe,
  it,
  beforeEach,
  assertEquals,
  equal,
  assert,
} from "./test_deps.ts";

import {
  createStore,
  createStoreContext,
  run,
  ttl,
  x,
  emptyStore,
} from "./test_utils.ts";

import { createResource } from "$/resource/mod.ts";
import { rdf, xsd } from "$/namespaces/mod.ts";
import { quad, variable, literal, namedNode } from "$/rdf.ts";

const assertContainsEqual = (haystack: unknown[], needle: unknown) => {
  let found = false;
  for (const item of haystack) {
    if (equal(item, needle)) {
      found = true;
      break;
    }
  }
  assert(found);
};

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
    assertEquals(storeQuads, expectedQuads);
  };

  beforeEach(async () => {
    await emptyStore(store);
    store.addQuads(defaultStoreContent);
  });

  it("Get many resources", async () => {
    const result = await run(directors.find());

    assertEquals(result.length, 2);
    assertContainsEqual(result, Tarantino);
    assertContainsEqual(result, Kubrick);
  });

  it("Get resource by IRI", async () => {
    const result = await run(directors.findByIri(Tarantino.$id));

    assertEquals(result, Tarantino);
  });

  it("Get multiple resources by IRI", async () => {
    const result = await run(
      directors.findByIris([Tarantino.$id, Kubrick.$id])
    );

    assertContainsEqual(result, Tarantino);
    assertContainsEqual(result, Kubrick);
  });

  it("Get resource by string condition", async () => {
    const condition = `?iri <${x.name}> "Quentin Tarantino" .`;
    const result = await run(directors.find(condition));

    assertEquals(result.length, 1);
    assertEquals(result[0], Tarantino);
  });

  it("Get resource by quad condition", async () => {
    const condition = quad(
      variable("iri"),
      namedNode(x.name),
      literal("Quentin Tarantino")
    );
    const result = await run(directors.find([condition]));

    assertEquals(result.length, 1);
    assertEquals(result[0], Tarantino);
  });

  it("Count resources", async () => {
    const count = await run(directors.count());
    assertEquals(count, 2);
  });

  it("Insert multiple resources", async () => {
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

  it("Insert complex resource", async () => {
    const result = await run(
      movies.insert({
        $id: x.IngloriousBasterds,
        name: "Inglorious Basterds",
        director: { $id: x.QuentinTarantino },
        released: { date: new Date("2008-01-01") },
      }),
      movies.findByIri(x.IngloriousBasterds)
    );

    assertEquals(result?.name, "Inglorious Basterds");
    assertEquals(result?.director, Tarantino);
    assertEquals(result?.released?.date, new Date("2008-01-01"));
  });

  it("Update multiple resources", async () => {
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

    assertContainsEqual(result, { ...Tarantino, name: "Tarantino Quentin" });
    assertContainsEqual(result, { ...Kubrick, name: "Kubrick Stanley" });
  });

  /*
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
  }); */

  it("Delete multiple resources", async () => {
    const dirs = await run(
      directors.delete(Tarantino, Kubrick),
      directors.find()
    );
    assertEquals(dirs.length, 0);
  });

  it("Insert data", async () => {
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
    assertEquals(result, {
      $id: x.ChristopherNolan,
      $type: [x.Director],
      name: "Christopher Nolan",
    });
  });

  it("Delete data", async () => {
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
    assertEquals(result, {
      $id: x.ChristopherNolan,
      $type: [x.Director],
      name: "Christopher Nolan",
    });
  });

  it("Support for custom types", async () => {
    const result = await run(
      movies.insert({
        $id: x.KillBill,
        $type: [x.TarantinoMovie],
        name: "Kill Bill",
        director: { $id: x.QuentinTarantino },
      }),
      movies.findByIri(x.KillBill)
    );

    assertEquals(result?.$type, [x.Movie, x.TarantinoMovie]);
  });
});
