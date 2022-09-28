import { Head } from "$fresh/runtime.ts";

import { App } from "../components/App.tsx";
import { Jumbo } from "../components/Jumbo.tsx";
import { IconArrowRight } from "../components/Icons.tsx";
import { gfm } from "../utils/markdown.ts";

export default function Home() {
  return (
    <App activeLink="/">
      <Head>
        <link rel="stylesheet" href={`/gfm.css?build=${__FRSH_BUILD_ID}`} />
      </Head>
      <div class="flex flex-col items-center">
        <Jumbo>LDkit</Jumbo>
        <p class="text-5xl font-bold leading-tight pb-10">
          <span class="text-red-800">Linked Data</span> query toolkit
          <br />
          for <span class="text-red-800">TypeScript</span> developers
        </p>
        <div class="flex flex-row">
          <pre class="p-6 bg-gray-800 text-white rounded-l-lg">npm i ldkit</pre>
          <a href="/docs" class="block bg-red-800 rounded-r-lg text-white p-6">
            <IconArrowRight />
          </a>
        </div>

        <Steps />
        <p class="text-center pt-8 pb-10">
          <a
            href="/docs"
            class="text-xl flex flex-row gap-4 bg-red-800 rounded text-white p-6"
          >
            <span>Read the documentation</span> <IconArrowRight />
          </a>
        </p>
      </div>
      <Features />
    </App>
  );
}

const step1Markdown = `
import { type Context, setDefaultContext } from "ldkit";

const context: Context = {
  sources: ["https://dbpedia.org/sparql"],
};

setDefaultContext(context);
`;

const step2Markdown = `
import { dbo, rdfs, xsd } from "ldkit/namespaces";

const PersonSchema = {
  "@type": dbo.Person,
  name: rdfs.label,
  abstract: dbo.abstract,
  birthDate: {
    "@id": dbo.birthDate,
    "@type": xsd.date,
  },
} as const;
`;

const step3Markdown = `
import { createResource } from "ldkit";

const Persons = createResource(PersonSchema);

const adaIri = "http://dbpedia.org/resource/Ada_Lovelace";
const ada = await Persons.findByIri(adaIri);

console.log(ada.name); // Ada Lovelace
console.log(ada.birthDate); // Date object of 1815-12-10
`;

function Steps() {
  return (
    <div class="mt-20 grid grid-cols-2">
      <div>
        <h2 class="pb-5 text-4xl font-black">1. Set up data source</h2>
        <p class="pl-10 pr-10 text-xl">
          Use a SPARQL query endpoint, or any other RDF data source.
        </p>
      </div>
      <div class="pb-4">
        <Markdown markdown={step1Markdown} />
      </div>
      <div>
        <h2 class="pb-5 text-4xl font-black">2. Create data schema</h2>
        <p class="pl-10 pr-10 text-xl">
          Specify entities to retrieve and their properties. Various data types,
          optional properties, arrays and language annotated literals are
          supported.
        </p>
      </div>
      <div class="pb-4">
        <Markdown markdown={step2Markdown} />
      </div>
      <div>
        <h2 class="pb-5 text-4xl font-black">3. Fetch data!</h2>
        <p class="pl-10 pr-10 text-xl">
          Convert data schema to a resource and fetch data with one line of
          code. Data gets transformed from RDF to native TypeScript
          automatically.
        </p>
      </div>
      <div class="pb-4">
        <Markdown markdown={step3Markdown} />
      </div>
    </div>
  );
}

function Markdown({ markdown }: { markdown: string }) {
  const preMarkdown = `\`\`\`ts${markdown}\`\`\``;
  const html = gfm.render(preMarkdown);
  return (
    <div class="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function Features() {
  return (
    <div class="grid grid-cols-4 gap-4 pb-20">
      <div class="p-2">
        <h2 class="text-xl font-black">Next-gen RDF abstraction</h2>
        <p>For efortless querying of RDF data from any source.</p>
      </div>
      <div class="p-2">
        <h2 class="text-xl font-black">First class TypeScript</h2>
        <p>Best in class developer experience. Fully typed workflow.</p>
      </div>
      <div class="p-2">
        <h2 class="text-xl font-black">Deploy anywhere</h2>
        <p>LDkit runs in browser, Deno and Node.</p>
      </div>
      <div class="p-2">
        <h2 class="text-xl font-black">RDF/JS compliant</h2>
        <p>Compatible or built upon all the popular RDF/JS libraries</p>
      </div>
    </div>
  );
}
