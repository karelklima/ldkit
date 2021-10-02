import { $ID, $TYPE, $META, $OPTIONAL, $CONTEXT, $ARRAY } from "@ldkit/keys";
import { createResource } from "@ldkit/core";
import type { SchemaInterface } from "@ldkit/core";
import { createNamespace } from "@ldkit/namespaces";
import { dcterms, xsd, schema } from "@ldkit/namespaces";

import { namedNode } from "@ldkit/rdf";

import { createDefaultContext } from "@ldkit/engine";

import { Store } from "n3";
import { lastValueFrom } from "rxjs";

export const main = async () => {
  const TodoSchema = {
    [$TYPE]: schema.Thing,
    name: schema.name,
  } as const;

  const store = new Store();

  const context = createDefaultContext(store);

  const todos = createResource(TodoSchema);

  const result = await lastValueFrom(
    todos.insert("https://1234", { name: "whoa" })
  );

  console.log(result);

  const all = await lastValueFrom(todos.find());

  for (const item of all) {
    console.log(item.name);
  }

  /*
  const workspaceVocabularies = createAccess(WorkspaceVocabularies);

  const vocabularies = createAccess(Vocabulary);

  vocabularies.findAll().subscribe((data) => {
    data.map((vocabulary) => {
      console.log("VOCABULARY");
      console.log(vocabulary);
      vocabulary.dependencies.map((dep) => {
        console.log(dep);
      });
    });
  });

  /*const fetcher = new SparqlEndpointFetcher();

const query = `CONSTRUCT { ?iri a <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext> .
    ?iri <https://slovník.gov.cz/datový/pracovní-prostor/pojem/vychází-z-verze> ?iri_0 .
    ?iri <https://slovník.gov.cz/datový/pracovní-prostor/pojem/používá-pojmy-ze-slovníku> ?iri_1 . }
    
    WHERE {
    ?iri a <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext> .
    ?iri <https://slovník.gov.cz/datový/pracovní-prostor/pojem/vychází-z-verze> ?iri_0 .
    
    OPTIONAL {
    ?iri <https://slovník.gov.cz/datový/pracovní-prostor/pojem/používá-pojmy-ze-slovníku> ?iri_1 .
    
    }
     VALUES ?iri { <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-928212665>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance719532437>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-791527635>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance2078395204>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1160878422>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance286589322>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance411162645>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-400182369>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1273413218>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance249540511>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-17830338>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-997347058>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance2045259795>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkovy-kontext/instance-2023085145>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkovy-kontext/instance1852886502>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1145283636>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1638663286>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1754840379>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-534415593>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-915785125>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-911411068>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1753100932>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance500489055>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-636890393>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1848983832>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1019577199>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1371737329>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1302524098>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1089243329>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1352599694>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-760774659>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1950371065>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1863109906>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1670765639>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance581641648>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1944551362>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1711571361>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1916517557>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance16263667>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-739992188>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1746097851>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1024061507>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance2034849226>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1355270831>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance573982663>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1548884990>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance773790554>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1549740986>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-226108161>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-483918759>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-261024062>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-988150880>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance636064570>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance492378156>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance319192802>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1616166811>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1391421828>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance814834461>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance706760607>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1528248876>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1772449392>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-183760279>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-659886623>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1243906526>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance530932879>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance935312474>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-1826036914>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance1494331221>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-2095428273>
    <https://slovník.gov.cz/datový/pracovní-prostor/pojem/slovníkový-kontext/instance-637847759> }
    }`;

const fetch = async () => {
  const tripleStream = await fetcher.fetchTriples(
    "https://graphdb.onto.fel.cvut.cz/repositories/kodi-uloziste-dev",
    query
  );
  tripleStream.on("error", (err) => {
    console.log("error");
  });
  tripleStream.on("data", (data) => {
    console.log(data);
  });
};

fetch();
*/
};
