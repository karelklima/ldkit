import { find } from "lodash";

import { createResource } from "@ldkit/resource";

import {
  createStore,
  createStoreContext,
  run,
  ttl,
  x,
  emptyStore,
} from "./utils";
import { take } from "rxjs/operators";
import { firstValueFrom, lastValueFrom } from "rxjs";
import type { Store } from "n3";
import type { Context } from "@ldkit/context";

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
} as const;

const defaultStoreContent = ttl(`
  x:StanleyKubrick
    a x:Director ;
    x:name "Stanley Kubrick" .
  x:QuentinTarantino
    a x:Director ;
    x:name "Quentin Tarantino" .
`);

const createDirector = ($id: string, name: string) => ({
  $id: x[$id],
  name,
});

const Tarantino = createDirector("QuentinTarantino", "Quentin Tarantino");
const Kubrick = createDirector("StanleyKubrick", "Stanley Kubrick");

describe("Resource", () => {
  const store = createStore();
  const context = createStoreContext(store);
  const directors = createResource(Director, context);
  const movies = createResource(Movie, context);

  const assertStore = (turtle: string) =>
    expect(store.getQuads(null, null, null, null)).toEqual(ttl(turtle));

  beforeEach(async () => {
    await emptyStore(store);
    store.addQuads(defaultStoreContent);
  });

  test("Insert multiple resources", async () => {
    await emptyStore(store);
    await run(directors.insert(Kubrick), directors.insert(Tarantino));

    assertStore(`
      x:StanleyKubrick
        a x:Director ;
        x:name "Stanley Kubrick" .
      x:QuentinTarantino
        a x:Director ;
        x:name "Quentin Tarantino" .
    `);
  });

  test("Count resources", async () => {
    const count = await run(
      directors.insert(Kubrick),
      directors.insert(Tarantino),
      directors.count()
    );
    expect(count).toBe(2);
  });

  test("List all resources", async () => {
    const content = ttl(`
      x:StanleyKubrick
        a schema:Person ;
        schema:name "Stanley Kubrick" .
      x:QuentinTarantino
        a schema:Person ;
        schema:name "Quentin Tarantino" .
    `);
    store.addQuads(content);

    const dirs = await run(directors.find());

    expect(dirs.length).toBe(2);
    expect(find(dirs, Tarantino)).toBeDefined();
    expect(find(dirs, Kubrick)).toBeDefined();
  });

  test.skip("update a resource", (done) => {
    /* directors
      .findByIri(Tarantino["@id"])
      .pipe(take(1))
      .subscribe((d) => {
        console.log(d?.name);
        done();
      }); */

    const promise = firstValueFrom(directors.findByIris([Tarantino.$id]));
    console.warn(promise);
    promise
      .then((val) => {
        console.log(val[0].name);
        console.log("JO");
        done();
      })
      .catch((e) => {
        console.error(e);
      });

    //const dir = await run(
    /* directors.update({
        "@id": Tarantino["@id"],
        name: "Not Quentin Tarantino",
      }), */
    //directors.findByIri(Tarantino["@id"])
    //);
    //expect(dir!.name).toEqual("Not Quentin Tarantino");
  });

  test.skip("delete a resource", async () => {
    const dir = await run(
      directors.delete(Tarantino),
      directors.findByIri(Tarantino.$id)
    );
    expect(dir).toBeUndefined();
    const count = await run(directors.count());
    expect(count).toBe(1);
    await run(directors.insert(Tarantino));
  });

  /* test("check the directors", () => {
    expect.assertions(1);
    return run(
      directors
        .findByIris(["https://StanleyKubrick", "https://QuentinTarantino"])
        .pipe(
          tap((dirs) => {
            console.warn("TAPPED");
            expect(dirs.length === 2);
            console.warn(dirs.length);
            for (const dir of dirs) {
              if (dir['@id'] === Tarantino["@id"]) {
                expect(dir.name).toBe(Tarantino.name)
              } else if ()
            }
          })
        )
    );
  }); */

  /* test("should find an entity and its properties", (done) => {
    directors.findByIri("https://QuentinTarantino").subscribe((result) => {
      expect(result.name).toBe("Quentin Tarantino");
      done();
    });
  });

  test("should list all directors", (done) => {
    directors.find().subscribe((results) => {
      expect(results.length).toBe(2);
      expect(results[0].name).not.toBe(results[1].name);
      done();
    });
  });

  test("should find movie and its director", (done) => {
    movies.findByIri(`https://2001`).subscribe((result) => {
      expect(result.name).toBe("2001: A Space Odyssey");
      expect(result.director.name).toBe("Stanley Kubrick");
      done();
    });
  });
 */
  /* test('accepts schema prototype as schema interface creates schema interface from schema prototype', () => {
    const s = expandSchema(User)
    expect(s).toEqual(UserSchema)
  })

  test('getSchemaProperties', () => {
    const properties = getSchemaProperties(UserSchema)
    const { firstName, lastName, email } = UserSchema
    const targetProperties = { firstName, lastName, email }
    expect(properties).toEqual(targetProperties)
  }) */
});
