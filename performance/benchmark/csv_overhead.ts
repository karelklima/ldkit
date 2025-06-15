import { stringify } from "jsr:@std/csv";

const results = JSON.parse(Deno.readTextFileSync("results.json"));

type TestSetup = [number, number, number];

const csv = [["ID", "A", "B", "C", "AB", "ABC"]];

const a = getResults([1, 0, 0], [1, 0, 0]);

const b = getResults([0, 0, 1], [0, 0, 1]);

const c = getResults([0, 1, 0], [0, 1, 0]);

const d = getResults([1, 0, 1], [1, 0, 1]);

const e = getResults([1, 1, 1], [1, 1, 1]);

for (let i = 0; i < 10; i++) {
  csv.push([
    String(i + 1),
    a[i].toString(),
    b[i].toString(),
    c[i].toString(),
    d[i].toString(),
    e[i].toString(),
  ]);
}

Deno.writeTextFileSync("results_overhead.csv", stringify(csv));
console.log("DONE");
console.log("Results saved to results_overhead.csv");

function getResults(
  initialSetup: TestSetup,
  increment: TestSetup,
): number[] {
  let setup = initialSetup;
  const output: number[] = [];
  for (let i = 0; i < 10; i++) {
    const key = `${setup[0]} ${setup[1]} ${setup[2]}`;

    const overhead = results[key].ok
      ? Math.max(
        (results[key].ldkit - results[key].query) / results[key].query * 100,
        0,
      )
      : -1;

    output.push(overhead);

    setup = [
      setup[0] + increment[0],
      setup[1] + increment[1],
      setup[2] + increment[2],
    ];
  }
  return output;
}
