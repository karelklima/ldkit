import { rdf, schema } from "@ldkit/namespaces";
import { $CONTEXT, $ID, $TYPE } from "@ldkit/keys";

import {
  Store,
  DataFactory,
  Quad_Object,
  Quad_Predicate,
  Quad_Subject,
} from "n3";

export const store = new Store();

const addQuad = (s: Quad_Subject, p: Quad_Predicate, o: Quad_Object) => {
  console.warn("QUAD: ", s.value, p.value, o.value);
  store.addQuad(s, p, o);
};

const n = (value: string) => DataFactory.namedNode(value);

const prefix = (value: string) => n(`https://${value}`);

const l = (value: string) => DataFactory.literal(value);

class Entity {
  s: string;
  constructor(s: string, type: string) {
    this.s = s;
    addQuad(prefix(s), n(rdf.type), n(type));
  }
  set(p: string, o: Quad_Object) {
    addQuad(prefix(this.s), n(p), o);
    return this;
  }
}

const entity = (s: string, type: string) => new Entity(s, type);

const addDirector = (id: string, name: string) =>
  entity(id, schema.Person).set(schema.name, l(name));

const addMovie = (id: string, name: string, directorId: string) =>
  entity(id, schema.Movie)
    .set(schema.name, l(name))
    .set(schema.director, prefix(directorId));

addDirector("QuentinTarantino", "Quentin Tarantino");
addDirector("StanleyKubrick", "Stanley Kubrick");

addMovie("ReservoirDogs", "Reservoir Dogs", "QuentinTarantino");
addMovie("PulpFiction", "Pulp Fiction", "QuentinTarantino");
addMovie("KillBill", "Kill Bill Vol. 1", "QuentinTarantino");
addMovie("IngloriousBasterds", "Inglourious Basterds", "QuentinTarantino");
addMovie("Hollywood", "Once Upon a Time in Hollywood", "QuentinTarantino");

addMovie("FullMetalJacket", "Full Metal Jacket", "StanleyKubrick");
addMovie("TheShining", "The Shining", "StanleyKubrick");
addMovie("2001", "2001: A Space Odyssey", "StanleyKubrick");

console.log("SIZE", store.size);

export const DirectorSchema = {
  [$TYPE]: schema.Person,
  name: schema.name,
} as const;

export const MovieSchema = {
  [$TYPE]: schema.Movie,
  name: schema.name,
  director: {
    [$ID]: schema.director,
    [$CONTEXT]: DirectorSchema,
  },
} as const;
