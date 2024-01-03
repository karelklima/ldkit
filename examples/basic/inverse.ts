import { type Context, createLens } from "ldkit";
import { dbo, rdfs, xsd } from "ldkit/namespaces";

// Create a context for query engine
const context: Context = {
  sources: ["https://dbpedia.org/sparql"], // SPARQL endpoint
  language: "en", // Preferred language
};

// Crete a simple movie schema
const MovieSchema = {
  "@type": dbo.Film,
  name: rdfs.label,
} as const;

// Create a movie director schema
const DirectorSchema = {
  "@type": dbo.Person,
  name: rdfs.label,
  birthDate: {
    "@id": dbo.birthDate,
    "@type": xsd.date,
  },
  isDirectorOf: {
    "@id": dbo.director,
    "@inverse": true, // This is cool!
    "@array": true,
    "@schema": MovieSchema,
  },
} as const;

// Create a resource using the data schema and context above
const Persons = createLens(DirectorSchema, context);

// Get a particular person identified by IRI
const tarantino = await Persons.findByIri(
  "http://dbpedia.org/resource/Quentin_Tarantino",
);

if (tarantino === null) {
  throw new Error("Tarantino not found?!");
}

// List all movies directed by Tarantino
console.log("List of movies directed by Tarantino:");
for (const movie of tarantino.isDirectorOf) {
  console.log(movie.name);
}
