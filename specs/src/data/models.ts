import { schema } from "@ldkit/namespaces";

export const Director = {
  "@type": schema.Person,
  name: schema.name,
} as const;

export const Movie = {
  "@type": schema.Movie,
  name: schema.name,
  director: {
    "@id": schema.director,
    "@context": Director,
  },
} as const;
