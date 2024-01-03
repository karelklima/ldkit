import { context, createLens, dbo, dbp, engine } from "./common.ts";

import { BookSchema } from "./scenario1.ts";

// Create a schema
export const PersonSchema = {
  "@type": dbo.Person,
  name: dbo.birthName,
} as const;

export const ExtendedBookSchema = {
  ...BookSchema,
  author: {
    "@id": dbp.author,
    "@schema": PersonSchema,
  },
} as const;

// Create a resource using the data schema and context above
const Lens = createLens(ExtendedBookSchema, context, engine);

// Fetch 1000 resources
console.time("LDkit total time");
const entities = await Lens.find(undefined, 1000);
console.timeEnd("LDkit total time");
console.log("Number of results: ", entities.length);
console.log("Sample entity", entities[0]);
