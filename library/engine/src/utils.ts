import type { Graph, Quad } from "@ldkit/rdf";

export const quadsToObject = (quads: Quad[]) => {
  const graph: Graph = {};
  for (const quad of quads) {
    const s = quad.subject.value;
    const p = quad.predicate.value;
    if (!graph[s]) {
      graph[s] = {};
    }
    if (!graph[s][p]) {
      graph[s][p] = [];
    }
    graph[s][p].push(quad.object);
  }
  return graph;
};
