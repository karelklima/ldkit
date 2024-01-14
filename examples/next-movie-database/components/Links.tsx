import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";

export function Links({ iri }: { iri: string }) {
  return (
    <>
      <p>
        <a href={iri} className="flex flex-row">
          DBpedia <ArrowTopRightOnSquareIcon width={16} />
        </a>
      </p>
      <p>
        <a href={getWikipediaLink(iri)} className="flex flex-row">
          Wikipedia <ArrowTopRightOnSquareIcon width={16} />
        </a>
      </p>
    </>
  );
}

function getWikipediaLink(iri: string) {
  return iri.replace(
    "http://dbpedia.org/resource/",
    "https://wikipedia.org/en/"
  );
}
