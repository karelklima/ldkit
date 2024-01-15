import { Loading } from "@/components/Loading";
import { Search, SearchInterface } from "@/data/lens";
import { yago } from "@/data/namespaces";
import { schema } from "ldkit/namespaces";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <p className="text-center text-lg pb-8 pt-2">
        Use the search bar above to look for people or movies, or pick some
        selection below.
      </p>
      <div className="grid grid-cols-3">
        <section className="prose">
          <h1>Top Movies</h1>
          <Suspense fallback={<Loading />}>
            <TopMovies />
          </Suspense>
        </section>
        <section className="prose">
          <h1>Top Actors</h1>
          <Suspense fallback={<Loading />}>
            <TopActors />
          </Suspense>
        </section>
        <section className="prose">
          <h1>Top Directors</h1>
          <Suspense fallback={<Loading />}>
            <TopDirectors />
          </Suspense>
        </section>
      </div>
    </>
  );
}

async function TopMovies() {
  const movies = await search(
    [
      "http://dbpedia.org/resource/The_Shawshank_Redemption",
      "http://dbpedia.org/resource/The_Godfather",
      "http://dbpedia.org/resource/The_Dark_Knight",
      "http://dbpedia.org/resource/Pulp_Fiction",
      "http://dbpedia.org/resource/Schindler's_List",
      "http://dbpedia.org/resource/The_Matrix",
      "http://dbpedia.org/resource/Fight_Club",
      "http://dbpedia.org/resource/Goodfellas",
      "http://dbpedia.org/resource/Terminator_2:_Judgment_Day",
      "http://dbpedia.org/resource/Inception",
    ],
    schema.Movie
  );
  return <SearchResults items={movies} />;
}

async function TopActors() {
  const movies = await search(
    [
      "http://dbpedia.org/resource/Christian_Bale",
      "http://dbpedia.org/resource/Helena_Bonham_Carter",
      "http://dbpedia.org/resource/Robert_De_Niro",
      "http://dbpedia.org/resource/Al_Pacino",
      "http://dbpedia.org/resource/Tom_Hanks",
      "http://dbpedia.org/resource/Leonardo_DiCaprio",
      "http://dbpedia.org/resource/Meryl_Streep",
      "http://dbpedia.org/resource/Brad_Pitt",
      "http://dbpedia.org/resource/Tom_Cruise",
      "http://dbpedia.org/resource/Sigourney_Weaver",
    ],
    yago.Actor109765278
  );
  return <SearchResults items={movies} />;
}

async function TopDirectors() {
  const movies = await search(
    [
      "http://dbpedia.org/resource/Stanley_Kubrick",
      "http://dbpedia.org/resource/Quentin_Tarantino",
      "http://dbpedia.org/resource/Christopher_Nolan",
      "http://dbpedia.org/resource/Ridley_Scott",
      "http://dbpedia.org/resource/Steven_Spielberg",
      "http://dbpedia.org/resource/Martin_Scorsese",
      "http://dbpedia.org/resource/Alfred_Hitchcock",
      "http://dbpedia.org/resource/David_Fincher",
      "http://dbpedia.org/resource/Tim_Burton",
      "http://dbpedia.org/resource/Guillermo_del_Toro",
    ],
    yago.Director110014939
  );
  return <SearchResults items={movies} />;
}

function SearchResults({ items }: { items: SearchInterface[] }) {
  return (
    <ul>
      {items.map((x) => (
        <SearchResult key={x.$id} {...x} />
      ))}
    </ul>
  );
}

function SearchResult(props: SearchInterface) {
  const mode = props.types.includes(schema.Movie) ? "movie" : "person";

  return (
    <li>
      <a href={`/${mode}?iri=${props.$id}`}>{props.name}</a>
    </li>
  );
}

async function search(ids: string[], type: string) {
  return Search.find({
    where: {
      $id: ids,
      name: {
        $langMatches: "en",
      },
      types: {
        $in: [type],
      },
    },
  });
}
