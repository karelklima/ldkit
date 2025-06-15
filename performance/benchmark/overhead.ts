import results from "./results.json" with { type: "json" };

let totalLDkit = 0;
let totalQuery = 0;

for (const result of Object.values(results)) {
  const { ok, ldkit, query } = result;
  if (!ok) {
    continue;
  }
  totalLDkit += ldkit;
  totalQuery += query;
}

const overhead = totalLDkit - totalQuery;

const overheadPercentage = ((overhead / totalQuery) * 100).toFixed(2);

console.log(`Total LDkit time: ${totalLDkit}ms`);
console.log(`Total Query time: ${totalQuery}ms`);
console.log(`Overhead: ${overhead}ms`);
console.log(`Overhead percentage: ${overheadPercentage}%`);

const overheadsPerTest: number[] = [];

for (const result of Object.values(results)) {
  const { ok, ldkit, query } = result;
  if (!ok) {
    continue;
  }
  totalLDkit += ldkit;
  totalQuery += query;
  const overhead = ldkit - query;
  const overheadPercentage = overhead / query;
  overheadsPerTest.push(overheadPercentage);
}

const averageOverhead = overheadsPerTest.reduce((acc, val) => acc + val, 0) /
  overheadsPerTest.length;

console.log(
  `Average overhead per test: ${(averageOverhead * 100).toFixed(2)}%`,
);
