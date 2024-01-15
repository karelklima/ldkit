import { Suspense } from "react";

import { sparql as $ } from "ldkit/sparql";
import { DataFactory } from "ldkit/rdf";
import { schema } from "ldkit/namespaces";

import { Search, type SearchInterface } from "@/data/lens";
import { yago } from "@/data/namespaces";
import { Loading } from "@/components/Loading";
import { TypesView } from "@/components/TypesView";

const df = new DataFactory();

const typeIRIs = [
  yago.Actor109765278,
  yago.Director110014939,
  yago.Writer110794014,
  yago.Composer109947232,
  schema.Movie,
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { query } = searchParams;

  if (!query || query.length < 1) {
    return <h1>Search for something!</h1>;
  }

  return (
    <div className="prose max-w-full">
      <h1>Searching for &quot;{query}&quot;</h1>
      <Suspense fallback={<Loading />}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}

async function search(query: string) {
  return Search.find({
    where: {
      name: {
        $langMatches: "en",
        $filter: $`bif:contains(?value, '${df.literal(query.toLowerCase())}')`,
      },
      types: {
        $in: typeIRIs,
      },
    },
    take: 100,
  });
}

async function SearchResults({ query }: { query: string }) {
  const data = await search(query);
  const count = data.length < 100 ? data.length : "100+";
  return (
    <div>
      <h2>Found {count} results</h2>
      <ul>
        {data.map((x) => (
          <SearchResult key={x.$id} {...x} />
        ))}
      </ul>
    </div>
  );
}

function SearchResult(props: SearchInterface) {
  const mode = props.types.includes(schema.Movie) ? "movie" : "person";

  return (
    <li>
      <a href={`/${mode}?iri=${props.$id}`}>{props.name}</a>
      <br />
      <TypesView types={props.types} />
    </li>
  );
}
