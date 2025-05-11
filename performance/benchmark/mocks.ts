import { Schema } from "ldkit";

const x = (value: string) => `https://x/${value}`;

const uuid = () => crypto.randomUUID();

const id = () => x(uuid());

export type Entity = { [key: string]: string | string[] | Entity };

export function createEntity(
  simpleProperties: number,
  arrayProperties: number,
  objectProperties: number,
) {
  const entity: Entity = {
    $id: id(),
  };

  for (let i = 1; i <= simpleProperties; i++) {
    entity[`simpleProperty${i}`] = uuid();
  }

  for (let i = 1; i <= arrayProperties; i++) {
    entity[`arrayProperty${i}`] = [uuid(), uuid(), uuid()];
  }

  for (let i = 1; i <= objectProperties; i++) {
    entity[`objectProperty${i}`] = createEntity(3, 0, 0);
  }

  return entity;
}

export function createSchema(
  simpleProperties: number,
  arrayProperties: number,
  objectProperties: number,
  type: string = "Entity",
) {
  const schema: Schema = {
    "@type": x(type),
  };

  for (let i = 1; i <= simpleProperties; i++) {
    schema[`simpleProperty${i}`] = x(`simpleProperty${i}`);
  }
  for (let i = 1; i <= arrayProperties; i++) {
    schema[`arrayProperty${i}`] = {
      "@id": x(`arrayProperty${i}`),
      "@array": true,
    };
  }
  for (let i = 1; i <= objectProperties; i++) {
    schema[`objectProperty${i}`] = {
      "@id": x(`objectProperty${i}`),
      "@schema": createSchema(3, 0, 0, `SubEntity`),
    };
  }
  return schema;
}
