import { createLens, createNamespace, type Options } from "ldkit";
import { DataFactory, N3 } from "ldkit/rdf";
import { QueryEngine as Comunica } from "npm:@comunica/query-sparql-rdfjs@4.1.0";

// Create a custom namespace
const ns = createNamespace(
  {
    "iri": "http://ns/",
    "prefix": "ns",
    "terms": [
      "name",
      "movie",
    ],
  } as const,
);

// Create a schema
const DirectorSchema = {
  name: ns.name,
  movies: {
    "@id": ns.movie,
    "@array": true,
  },
} as const;

// Create in memory data store and options for query engine
const store = new N3.Store(undefined, {
  factory: new DataFactory(),
});
const options: Options = {
  engine: new Comunica(),
  sources: [store],
};

// Create a resource using the data schema and context above
const Directors = createLens(DirectorSchema, options);

// Add a director with a list of some movies
await Directors.insert({
  $id: "https://Quentin_Tarantino",
  name: "Quentin Tarantino",
  movies: ["Pulp Fiction", "Reservoir Dogs"],
});

// Add a movie to the list of movies
await Directors.update({
  $id: "https://Quentin_Tarantino",
  movies: {
    $add: ["Kill Bill", "Kill Bill 2"],
  },
});

// Remove a movie from the list of movies
await Directors.update({
  $id: "https://Quentin_Tarantino",
  movies: {
    $remove: ["Reservoir Dogs"],
  },
});

// Print the list of movies
const tarantino = await Directors.findByIri("https://Quentin_Tarantino");
console.log("Tarantino movies", tarantino?.movies);

// Add another director with a list of some movies
await Directors.insert({
  $id: "https://David_Fincher",
  name: "David Fincher",
  movies: ["Fight Club", "The Social Network"],
});

// Modify the list of movies for both directors
await Directors.update({
  $id: "https://Quentin_Tarantino",
  movies: {
    $set: [], // Remove all movies
  },
}, {
  $id: "https://David_Fincher",
  movies: {
    $add: ["The Curious Case of Benjamin Button"],
  },
});

// Print the list of movies of the other director
const fincher = await Directors.findByIri("https://David_Fincher");
console.log("Fincher movies", fincher?.movies);
