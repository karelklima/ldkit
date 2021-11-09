import fs from "fs";

const run = () => {
  const content = fs.readFileSync("./input.txt", "utf-8");
  const lines = content.split("\n");
  const iris = lines.map((line) => line.substring(1, line.indexOf(">")));
  const uniqueIris = Object.keys(
    iris.reduce((acc, iri) => {
      acc[iri] = true;
      return acc;
    }, {})
  );
  //const prefix = uniqueIris[0] // prefix is always first
  //const validIris = uniqueIris.slice(1)
  const prefix = "http://schema.org/";
  const validIris = uniqueIris;
  const terms = validIris.map((iri) => iri.substring(prefix.length));
  console.log(terms);
  const termsString = terms.map((term) => `    '${term}'`).join(",\n");
  const output = `
  {
    'iri': '${prefix}',
    'prefix': '',
    'terms': [
      ${termsString}
    ]
  }
  `;
  fs.writeFileSync("./output.txt", output);
};

run();
