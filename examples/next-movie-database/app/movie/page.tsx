import { Suspense } from "react";

import {
  Movies,
  MoviesActors,
  MoviesDirectors,
  MoviesWriters,
  MoviesComposers,
} from "@/data/lens";
import { Thumbnail } from "@/components/Thumbnail";
import { Links } from "@/components/Links";
import { Loading } from "@/components/Loading";

export default async function MoviePage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { iri } = searchParams;

  if (!iri || iri.length < 1) {
    return <h1>No IRI found!</h1>;
  }

  const movie = await Movies.findOne({
    $id: iri,
    name: {
      $langMatches: "en",
    },
    abstract: {
      $langMatches: "en",
    },
  });

  if (movie == null) {
    return <h1>No movie found!</h1>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <article className="prose max-w-full pr-8 col-span-3">
        <h1>{movie.name}</h1>
        <p>{movie.abstract}</p>
        <h2>Director</h2>

        <Suspense fallback={<Loading />}>
          <Director iri={movie.$id} />
        </Suspense>
        <h2>Cast</h2>
        <Suspense fallback={<Loading />}>
          <Cast iri={movie.$id} />
        </Suspense>
        <h2>Writer</h2>
        <Suspense fallback={<Loading />}>
          <Writer iri={movie.$id} />
        </Suspense>
        <h2>Composer</h2>
        <Suspense fallback={<Loading />}>
          <Composer iri={movie.$id} />
        </Suspense>
      </article>
      <aside className="col-span-1 prose">
        <Thumbnail imageUrl={movie.thumbnail} />
        <Links iri={movie.$id} />
      </aside>
    </div>
  );
}

async function Director({ iri }: { iri: string }) {
  const movieWithDirectors = await MoviesDirectors.findByIri(iri);
  return <PersonList>{movieWithDirectors?.directors}</PersonList>;
}

async function Writer({ iri }: { iri: string }) {
  const movieWithWriters = await MoviesWriters.findByIri(iri);
  return <PersonList>{movieWithWriters?.writers}</PersonList>;
}

async function Composer({ iri }: { iri: string }) {
  const movieWithComposers = await MoviesComposers.findByIri(iri);
  return <PersonList>{movieWithComposers?.composers}</PersonList>;
}

async function Cast({ iri }: { iri: string }) {
  const movieWithActors = await MoviesActors.findByIri(iri);
  return <PersonList>{movieWithActors?.starring}</PersonList>;
}

function PersonList({
  children,
}: {
  children: { $id: string; name: string }[] | undefined;
}) {
  if (children === undefined || children.length < 1) {
    return <p>No records found.</p>;
  }

  return (
    <ul>
      {children.map((person) => (
        <li key={person.$id}>
          <a href={`/person?iri=${person.$id}`}>{person.name}</a>
        </li>
      ))}
    </ul>
  );
}
