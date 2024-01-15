import { Types } from "@/data/lens";
import { yago } from "@/data/namespaces";
import { schema } from "ldkit/namespaces";

async function getTypes(iri: string) {
  const entity = await Types.findByIri(iri);
  return entity?.types ?? [];
}

export async function TypesList({ iri }: { iri: string }) {
  const types = await getTypes(iri);
  return <TypesView types={types} />;
}

export function TypesView({ types }: { types: string[] }) {
  return (
    <small>
      {types
        .map(typeToLabel)
        .filter((label) => label != undefined)
        .join(" · ")}
    </small>
  );
}

function typeToLabel(type: string) {
  switch (type) {
    case yago.Actor109765278:
      return "Actor";
    case yago.Director110014939:
      return "Director";
    case yago.Writer110794014:
      return "Writer";
    case yago.Composer109947232:
      return "Composer";
    case schema.Movie:
      return "Movie";
    default:
      return undefined;
  }
}
