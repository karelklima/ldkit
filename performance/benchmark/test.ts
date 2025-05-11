import { createLens, type Schema } from "ldkit";

import { directQuery, QUERY_SOURCE } from "./common.ts";
import { createSchema } from "./mocks.ts";

console.log(
  "This script will execute performance test against the repository.",
);
console.log(
  "Make sure the repository is populated with the data before running this script.",
);

console.log(`Repository URL: ${QUERY_SOURCE}`);

const shouldProceed = confirm(
  "Do you want to proceed?",
);

if (!shouldProceed) {
  console.log("Aborted.");
  Deno.exit(0);
}

type TestSetup = [number, number, number];

type TestResult = {
  ok: boolean;
  ldkit: number;
  query: number;
};

const results: Record<string, TestResult> = {};

console.log("Running simple properties test...");
await test([1, 0, 0], [1, 0, 0]);

console.log("Running object properties test...");
await test([0, 0, 1], [0, 0, 1]);

console.log("Running array properties test...");
await test([0, 1, 0], [0, 1, 0]);

console.log("Running simple and object properties test...");
await test([1, 0, 1], [1, 0, 1]);

console.log("Running simple and object and array mixed properties test...");
await test([10, 1, 10], [0, 1, 0]);

console.log("RESULTS", results);
Deno.writeTextFileSync("results.json", JSON.stringify(results, null, 2));
console.log("DONE");
console.log("Results saved to results.json");

async function test(
  initialSetup: TestSetup,
  increment: TestSetup,
): Promise<void> {
  let setup = initialSetup;
  let skipRest = false;
  for (let i = 0; i < 10; i++) {
    const key = `${setup[0]} ${setup[1]} ${setup[2]}`;

    if (!skipRest) {
      console.log(`Testing ${key}`);
      const schema = createSchema(setup[0], setup[1], setup[2]);
      const res = await testSchema(schema);
      results[key] = res;
      if (!res.ok || res.query > 10000) {
        skipRest = true;
      }
    } else {
      console.log(`Skipping ${key} due to maximum timeout reached`);
      results[key] = {
        ok: false,
        ldkit: -1,
        query: -1,
      };
    }

    setup = [
      setup[0] + increment[0],
      setup[1] + increment[1],
      setup[2] + increment[2],
    ];
  }
}

/**
 * Calculate the average of an array of numbers, excluding the max and min values.
 * This is useful for benchmarking to avoid outliers.
 * @param arr values to calculate the average of
 * @returns average of the array
 */
function avg(arr: number[]): number {
  // Remove the max and min values from the array
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const filtered = arr.filter((v) => v !== max && v !== min);
  return filtered.reduce((acc, val) => acc + val, 0) / filtered.length;
}

/**
 * This function will execute the performance test against the repository
 * and return the average times for ldkit and query.
 * It will run 10 iterations of the test, querying 1000 entities each time.
 * @param schema schema to test
 * @returns test result with average times for ldkit and query
 */
async function testSchema(schema: Schema): Promise<TestResult> {
  const results: TestResult[] = [];
  for (let i = 0; i < 10; i++) {
    const result = await testQuery(schema, 1000, i * 1000);
    results.push(result);
  }

  if (results.find((r) => !r.ok)) {
    return {
      ok: false,
      ldkit: -1,
      query: -1,
    };
  }

  return {
    ok: true,
    ldkit: avg(results.map((r) => r.ldkit)),
    query: avg(results.map((r) => r.query)),
  };
}

/**
 * This function will execute the performance test against the repository
 * and return the times for ldkit and query.
 * It will query entities using LDkit and directly using the query string.
 * @param schema schema to test
 * @param take number of entities to take
 * @param skip number of entities to skip
 * @returns test result with ldkit and query times
 */
async function testQuery(
  schema: Schema,
  take: number,
  skip: number,
): Promise<TestResult> {
  performance.clearMarks();
  performance.clearMeasures();
  let query = "";
  let LDkitOK = false;
  let QueryOK = false;

  const Entities = createLens(schema, {
    sources: [QUERY_SOURCE],
    logQuery: (q: string) => {
      query = q;
    },
  });

  try {
    performance.mark("ldkit-start");
    await Entities.find({ take, skip });
    performance.mark("ldkit-end");
    performance.measure("ldkit", "ldkit-start", "ldkit-end");
    LDkitOK = true;
  } catch (e) {
    console.error("Error", e);
  }

  try {
    performance.mark("query-start");
    await directQuery(query);
    performance.mark("query-end");
    performance.measure("query", "query-start", "query-end");
    QueryOK = true;
  } catch (e) {
    console.error("Error", e);
  }

  if (!LDkitOK || !QueryOK) {
    return {
      ok: false,
      ldkit: -1,
      query: -1,
    };
  }

  const ldkitMeasure = performance.getEntriesByName("ldkit")[0];
  const queryMeasure = performance.getEntriesByName("query")[0];

  return {
    ok: true,
    ldkit: ldkitMeasure.duration,
    query: queryMeasure.duration,
  };
}
