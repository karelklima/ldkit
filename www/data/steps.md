# 1. Set up data source

```ts
import { type Context, setDefaultContext } from "ldkit";

const context: Context = {
  sources: ["https://dbpedia.org/sparql"],
};

setDefaultContext(context);
```

# 2. Create data schema

```ts
import { dbo, rdfs, xsd } from "ldkit/namespaces";

const PersonSchema = {
  "@type": dbo.Person,
  name: rdfs.label,
  abstract: dbo.abstract,
  birthDate: {
    "@id": dbo.birthDate,
    "@type": xsd.date,
  },
} as const;
```

# 3. Fetch data!

```ts
import { createResource } from "ldkit";

const Persons = createResource(PersonSchema);

const adaIri = "http://dbpedia.org/resource/Ada_Lovelace";
const ada = await Persons.findByIri(adaIri);

console.log(ada.name); // Ada Lovelace
console.log(ada.birthDate); // Date object of 1815-12-10
```
