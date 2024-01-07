import { Configuration } from "$doc_components/services.ts";

const toApiPath = (url: URL) => {
  const chunks = url.pathname.split("/");
  const module = chunks[chunks.length - 1];
  return `/api/${module}`;
};

const toRemoteSourceUrl = (target: string, line?: number) => {
  const prefix = "https://deno.land/x/ldkit/";
  const lineSuffix = line ? `#L${line}` : "";
  const suffix = `?source=${lineSuffix}`;
  const chunks = target.split("/library/");
  if (chunks.length > 1) {
    return `${prefix}${chunks[1]}${suffix}`;
  }
  const smallChunks = target.split("/");
  const rootModule = smallChunks[smallChunks.length - 1];
  return `${prefix}${rootModule}${suffix}`;
};

const ignoredSymbols = [
  "Date",
  "Iterable",
  "Partial",
  "Promise",
  "Response",
  "Unite",
  "T",
  "QueryEngineProxy",
  "QueryBuilder",
  "ExpandedSchema",
];

export default {
  resolveHref(current, symbol, _namespace, property) {
    const path = toApiPath(current);
    return symbol
      ? (property ? `${path}~${symbol}.${property}` : `${path}~${symbol}`)
      : `${path}`;
  },
  lookupHref(current, namespace, symbol) {
    if (ignoredSymbols.includes(symbol)) {
      return undefined;
    }
    const path = toApiPath(current);
    return namespace ? `${path}~${namespace}.${symbol}` : `${path}~${symbol}`;
  },
  resolveSourceHref(target, line) {
    return toRemoteSourceUrl(target, line);
  },
} satisfies Configuration;
