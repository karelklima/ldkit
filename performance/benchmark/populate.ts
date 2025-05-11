import { createLens } from "ldkit";
import { UPDATE_SOURCE } from "./common.ts";
import { createEntity, createSchema, Entity } from "./mocks.ts";

console.log(
  "This script will generate performance test data in the repository.",
);
console.log(
  "It will create 10,000 entities with 10 simple properties, 10 array properties, and 10 object properties.",
);

console.log(`Repository URL: ${UPDATE_SOURCE}`);

const shouldProceed = confirm(
  "Do you want to proceed?",
);

if (!shouldProceed) {
  console.log("Aborted.");
  Deno.exit(0);
}

console.log("Should proceed:", shouldProceed);

const EntitySchema = createSchema(10, 10, 10);

const UpdateEntities = createLens(EntitySchema, {
  sources: [UPDATE_SOURCE],
});

const iterations = 10;
for (let x = 1; x <= iterations; x++) {
  console.log(`Creating 1000 entities, iteration ${x}/${iterations}`);
  console.log("Generating entities...");
  const entities: Entity[] = [];
  for (let i = 0; i < 1000; i++) {
    entities.push(createEntity(10, 10, 10));
  }
  console.log("Inserting entities...");
  // deno-lint-ignore no-explicit-any
  await UpdateEntities.insert(...entities as any);
}

console.log("DONE");
