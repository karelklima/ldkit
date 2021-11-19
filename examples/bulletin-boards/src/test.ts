import { createContext } from "@ldkit/context";
import {
  newEngine,
  IQueryResultBoolean,
  IQueryResultBindings,
  IQueryResultQuads,
} from "@comunica/actor-init-sparql";

export const main = async () => {
  const customFetch = (resource: RequestInfo, init?: RequestInit) => {
    console.log("CUSTOM FETCH FETCHING");
    const headers = init?.headers as Headers;
    const ct = (init?.headers as Headers).get("Content-type");
    console.log(ct);
    if (ct === "application/x-www-form-urlencoded") {
      headers.set(
        "Content-type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
    }
    const i: RequestInit = {
      mode: "cors",
      ...init,
    };
    return fetch(resource, i);
  };

  const context = createContext({
    source: {
      type: "file",
      value:
        "https://karel-static.netlify.app/mesto-hranice-uredni-deska.jsonld",
    },
    fetch: customFetch,
  });

  const engine = newEngine();

  const result: IQueryResultBindings = (await engine.query(
    "select * where { ?s ?p ?o } LIMIT 10",
    context
  )) as IQueryResultBindings;

  console.log("VARIABLES", result.variables);

  result.bindingsStream.on("end", () => {
    console.warn("end");
  });

  result.bindingsStream.on("error", (error) => {
    console.error(error);
  });

  result.bindingsStream.on("data", () => {
    console.log("data");
  });
};
