import { createLens, type Options } from "ldkit";
import { dbo, rdfs, xsd } from "ldkit/namespaces";

// Create options for query engine
const options: Options = {
  sources: ["https://dbpedia.org/sparql"], // SPARQL endpoint
  language: "en", // Preferred language
};

// Create a schema
const PersonSchema = {
  "@type": dbo.Person,
  name: rdfs.label,
  abstract: dbo.abstract,
  birthDate: {
    "@id": dbo.birthDate,
    "@type": xsd.date,
  },
} as const;

// Create a resource using the data schema and context above
const Persons = createLens(PersonSchema, options);

// List some persons
const persons = await Persons.find({ take: 10 });
for (const person of persons) {
  console.log(person.name); // string
  console.log(person.birthDate); // Date
}

// Get a particular person identified by IRI
const ada = await Persons.findByIri("http://dbpedia.org/resource/Ada_Lovelace");
console.log(ada?.name); // string "Ada Lovelace"
console.log(ada?.birthDate); // Date object of 1815-12-10

// Get total count of all persons
const count = await Persons.count();
console.log(count); // number

// The following code will not work on DBPedia as it needs write permissions

// Insert a new person
/*
Persons.insert({
  $id: "http://dbpedia.org/resource/Alan_Turing",
  name: "Alan Turing",
  birthDate: new Date("1912-06-23"),
});
*/

// Modify a person's name
/*
Persons.update({
  $id: "http://dbpedia.org/resource/Alan_Turing",
  name: "Not Alan Turing",
});
*/

// Delete a person
/*
Persons.delete("http://dbpedia.org/resource/Alan_Turing");
*/
