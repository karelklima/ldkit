export const QUERY_SOURCE = "http://localhost:7200/repositories/bench";
export const UPDATE_SOURCE = `${QUERY_SOURCE}/statements`;

export async function directQuery(
  body: string,
): Promise<string> {
  const response = await fetch(QUERY_SOURCE, {
    method: "POST",
    headers: {
      "accept": "application/n-triples",
      "content-type": `application/sparql-query; charset=UTF-8`,
    },
    body,
  });
  const text = await response.text();
  return text;
}
