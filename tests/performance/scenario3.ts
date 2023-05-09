import { context, createLens, dbp, engine } from "./common.ts";

import { ExtendedBookSchema } from "./scenario2.ts";

const DoubleExtendedBookSchema = {
  ...ExtendedBookSchema,
  country: dbp.country,
  language: dbp.language,
  genre: dbp.genre,
} as const;

// Create a resource using the data schema and context above
const Lens = createLens(DoubleExtendedBookSchema, context, engine);

// Fetch 1000 resources
console.time("LDkit total time");
const entities = await Lens.find(undefined, 1000);
console.timeEnd("LDkit total time");
console.log("Number of results: ", entities.length);
console.log("Sample entity", entities[0]);
