import { createLens, dbo, dbp, options } from "./common.ts";

// Create a schema
export const BookSchema = {
  "@type": dbo.Book,
  title: dbp.title,
} as const;

// Create a resource using the data schema and context above
const Lens = createLens(BookSchema, options);

// Fetch 1000 resources
console.time("LDkit total time");
const entities = await Lens.find({ take: 1000 });
console.timeEnd("LDkit total time");
console.log("Number of results: ", entities.length);
console.log("Sample entity", entities[0]);
