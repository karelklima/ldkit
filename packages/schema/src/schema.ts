import { $ARRAY, $CONTEXT, $ID, $LAZY, $META, $OPTIONAL, $TYPE } from "./keys";

type Meta = typeof $OPTIONAL | typeof $ARRAY | typeof $LAZY;

export type PropertyPrototype = {
  [$ID]: string;
  [$TYPE]?: string;
  [$META]?: Meta | readonly Meta[];
  [$CONTEXT]?: SchemaPrototype;
};

export type SchemaPrototype = {
  [key: string]: PropertyPrototype | string | string[];
  [$TYPE]: string | string[];
};

export type Property = {
  [$ID]: string;
  [$TYPE]?: string;
  [$META]: Meta[];
  [$CONTEXT]?: Schema;
};

export type Schema = {
  [key: string]: Property | string[];
  [$TYPE]: string[];
};
