import { Suspense } from "react";

import {
  Persons,
  ActorMovies,
  DirectorMovies,
  WriterMovies,
  ComposerMovies,
} from "@/data/lens";
import { Thumbnail } from "@/components/Thumbnail";
import { Loading } from "@/components/Loading";
import { TypesList, TypesView } from "@/components/TypesView";
import { yago } from "@/data/namespaces";
import { Links } from "@/components/Links";

export default async function PersonPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const { iri } = searchParams;

  if (!iri || iri.length < 1) {
    return <h1>No IRI found!</h1>;
  }

  const person = await Persons.findByIri(iri);

  if (person == null) {
    return <h1>No person found!</h1>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <article className="prose max-w-full pr-8 col-span-3">
        <h1>{person.name}</h1>
        <Suspense fallback={<Loading />}>
          <TypesList iri={iri} />
        </Suspense>
        <p>{person.abstract}</p>
        <h2>Filmography</h2>
        <Suspense fallback={<Loading />}>
          <Filmography iri={iri} />
        </Suspense>
      </article>
      <aside className="col-span-1 prose">
        <Thumbnail imageUrl={person.thumbnail} />
        {person.birthDate && <p>Born: {person.birthDate.toDateString()}</p>}
        {person.deathDate && <p>Died: {person.deathDate.toDateString()}</p>}
        <Links iri={person.$id} />
      </aside>
    </div>
  );
}

async function getFilmography(iri: string) {
  const records = await Promise.all([
    ActorMovies.findByIri(iri).then((x) => x?.isStarringIn),
    DirectorMovies.findByIri(iri).then((x) => x?.isDirecting),
    WriterMovies.findByIri(iri).then((x) => x?.isWriting),
    ComposerMovies.findByIri(iri).then((x) => x?.isComposing),
  ]);

  const filmography: Record<
    string,
    { $id: string; name: string; types: string[] }
  > = {};

  const addMovie = (movie: { $id: string; name: string }, type: string) => {
    if (!filmography[movie.$id]) {
      filmography[movie.$id] = { ...movie, types: [type] };
    } else {
      filmography[movie.$id].types.push(type);
    }
  };

  records[0]?.forEach((x) => addMovie(x, yago.Actor109765278));
  records[1]?.forEach((x) => addMovie(x, yago.Director110014939));
  records[2]?.forEach((x) => addMovie(x, yago.Writer110794014));
  records[3]?.forEach((x) => addMovie(x, yago.Composer109947232));

  return filmography;
}

async function Filmography({ iri }: { iri: string }) {
  const filmography = await getFilmography(iri);

  if (Object.values(filmography).length < 1) {
    return <p>No records found!</p>;
  }

  return (
    <ul>
      {Object.values(filmography).map((movie) => (
        <li key={movie.$id}>
          <a href={`/movie?iri=${movie.$id}`}>{movie.name}</a>&nbsp;
          <TypesView types={movie.types} />
        </li>
      ))}
    </ul>
  );
}
