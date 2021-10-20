import { find } from "lodash";

import { createResource } from "@ldkit/resource";

import { Director, Movie, createStoreContext } from "../data";
import { run } from "../utils";
import { take } from "rxjs/operators";
import { firstValueFrom, lastValueFrom } from "rxjs";

const createDirector = (id: string, name: string) => ({
  "@id": id,
  name,
});

const Tarantino = createDirector(
  "https://QuentinTarantino",
  "Quentin Tarantino"
);
const Kubrick = createDirector("https://StanleyKubrick", "Stanley Kubrick");

describe("Resource basics", () => {
  const context = createStoreContext();
  const directors = createResource(Director, context);
  const movies = createResource(Movie, context);

  test("insert resources", async () => {
    const dirs = await run(
      directors.insert(Tarantino),
      directors.insert(Kubrick),
      directors.findByIris([
        "https://StanleyKubrick",
        "https://QuentinTarantino",
      ])
    );
    expect(dirs.length).toBe(2);
    expect(find(dirs, Tarantino)).toBeDefined();
    expect(find(dirs, Kubrick)).toBeDefined();
  });

  test("count resources", async () => {
    const count = await run(directors.count());
    expect(count).toBe(2);
  });

  test("list all resources", async () => {
    const dirs = await run(directors.find());
    expect(dirs.length).toBe(2);
    expect(find(dirs, Tarantino)).toBeDefined();
    expect(find(dirs, Kubrick)).toBeDefined();
  });

  test("update a resource", (done) => {
    /* directors
      .findByIri(Tarantino["@id"])
      .pipe(take(1))
      .subscribe((d) => {
        console.log(d?.name);
        done();
      }); */

    const promise = firstValueFrom(directors.findByIris([Tarantino["@id"]]));
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
      directors.findByIri(Tarantino["@id"])
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
