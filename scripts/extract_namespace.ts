// This utility extracts namespace from an RDF or OWL file using pattern matching

if (Deno.args.length != 3) {
  throw new Error(
    "Namespace generator requires exactly three arguments, e.g. generate_namespace.ts dcterms http://purl.org/dc/terms/ ./dcterms.rdf",
  );
}

const [short, namespace, inputFile] = Deno.args;

console.log("Reading file", inputFile);

const fileText = Deno.readTextFileSync(inputFile);

const escapedNamespace = namespace.replaceAll("/", "\\/").replaceAll(
  ".",
  "\\.",
);
const pattern = `(<|")(${escapedNamespace})([a-zA-Z0-9_]+)(>|")`;
console.log(pattern);
const extractRegex = new RegExp(
  pattern,
  "g",
);

const terms = new Set<string>();

const matches = fileText.matchAll(extractRegex);

for (const m of matches) {
  terms.add(m[3]);
}

console.log(`Found ${terms.size} items:`);

const sortedTerms = [...terms].sort();

for (const i of sortedTerms) {
  console.log(i);
}

const outputFile = `${inputFile}.ts`;

const outputTerms = sortedTerms.map((i) => `      "${i}",`).join("\n");

const output = `import { createNamespace } from "ldkit";

export default createNamespace(
  {
    iri: "${namespace}",
    prefix: "${short}:",
    terms: [
${outputTerms}
    ],
  } as const,
);
`;

console.log("Writing namespace to file", outputFile);
Deno.writeTextFileSync(outputFile, output);

console.log("Done!");
