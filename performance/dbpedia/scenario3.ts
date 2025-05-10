import { createLens, dbo, dbp, options } from "./common.ts";

// Note: This test will likely fail because of DBpedia rate limiting

// Create a schema
export const PersonSchema = {
  "@type": dbo.Person,
  name: dbo.birthName,
} as const;

const DoubleExtendedBookSchema = {
  "@type": dbo.Book,
  title: dbp.title,
  author: {
    "@id": dbp.author,
    "@schema": PersonSchema,
  },
  country: dbp.country,
  language: dbp.language,
  genre: dbo.literaryGenre,
} as const;

// Create a resource using the data schema and context above
const Lens = createLens(DoubleExtendedBookSchema, options);

// Fetch 1000 resources
console.time("LDkit total time");
const entities = await Lens.find({ take: 1000 });
console.timeEnd("LDkit total time");
console.log("Number of results: ", entities.length);
console.log("Sample entity", entities[0]);
