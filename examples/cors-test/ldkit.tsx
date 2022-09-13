import React, { useEffect } from "https://esm.sh/react@17.0.2";
import type { Context } from "https://deno.land/x/ldkit@v0.5.0/mod.ts";
import { QueryEngine } from "https://deno.land/x/ldkit@v0.5.0/library/engine/query_engine.ts";

const endpoint =
  "https://xn--slovnk-7va.gov.cz/prohlizime/sluzby/db-server/repositories/termit";

const context: Context = {
  sources: [
    endpoint,
  ],
};

const engine = new QueryEngine();
const q = "select * where { ?s ?p ?o } limit 100";

export function LDkit() {
  useEffect(() => {
    async function run() {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/sparql-results+json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: new URLSearchParams({
          query: q,
        }),
      });
      //const json = await res.json();
      //const res = await engine.query(q, context);
      const json = await res.json();
      console.log("RESULT", json);
    }
    run();
  }, []);

  return <>LDkit</>;
}
