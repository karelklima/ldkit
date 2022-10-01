import { sparql, type SparqlValue } from "./sparql_tag.ts";

type TTemplateBuilder = (
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => TBuilderCollection;

type TNumericBuilder = (number: number) => TBuilderCollection;

type TTerminalBuilder = () => string;

type TBuilder = TTemplateBuilder | TNumericBuilder | TTerminalBuilder;

type TBuilderCollection = Record<string, TBuilder>;

type This = { $partialQuery: string } | undefined;

const createContext = (
  self: This,
  current: string,
  builders: TBuilderCollection,
) => {
  const previousQuery = self?.$partialQuery || "";
  const context: This = { $partialQuery: previousQuery + current };
  return Object.keys(builders).reduce((acc, key) => {
    acc[key] = builders[key].bind(context);
    return acc;
  }, {} as TBuilderCollection);
};

const createTemplateBuilder = <
  TReturnType extends TBuilderCollection,
>(
  wrap: (value: string) => string,
  builders: TReturnType,
) => {
  return function (
    this: unknown,
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) {
    const self = (this as This);
    const inner = sparql(strings, ...values);
    const current = wrap(inner);
    return createContext(self, current, builders) as TReturnType;
  };
};

const createNumericBuilder = <
  TReturnType extends TBuilderCollection,
>(
  wrap: (value: number) => string,
  builders: TReturnType,
) => {
  return function (
    this: unknown,
    number: number,
  ) {
    const self = (this as This);
    const current = wrap(number);
    return createContext(self, current, builders) as TReturnType;
  };
};

const build = function (this: unknown): string {
  return (this as This)?.$partialQuery || "";
};

const OFFSET = createNumericBuilder(
  (value) => `OFFSET ${value}\n`,
  { build },
);

const LIMIT = createNumericBuilder(
  (value) => `LIMIT ${value}\n`,
  { build, OFFSET },
);

const ORDER_BY = createTemplateBuilder(
  (value) => `ORDER BY ${value}\n`,
  { build, LIMIT },
);

const HAVING = createTemplateBuilder(
  (value) => `HAVING(${value})\n`,
  { build, LIMIT },
);

const GROUP_BY = createTemplateBuilder(
  (value) => `GROUP BY ${value}\n`,
  { build, HAVING, ORDER_BY, LIMIT },
);

const WHERE = createTemplateBuilder(
  (value) => `WHERE {\n${value}\n}\n`,
  { build, GROUP_BY, ORDER_BY, LIMIT },
);

const FROM_NAMED = createTemplateBuilder(
  (value) => `FROM NAMED ${value}\n`,
  { WHERE },
);

const FROM = createTemplateBuilder(
  (value) => `FROM ${value}\n`,
  { FROM_NAMED, WHERE },
);

const _SELECT = createTemplateBuilder(
  (value) => `SELECT ${value}\n`,
  { FROM, FROM_NAMED, WHERE },
);

const DISTINCT = createTemplateBuilder(
  (value) => `SELECT DISTINCT ${value}\n`,
  { FROM, WHERE },
);

const REDUCED = createTemplateBuilder(
  (value) => `SELECT REDUCED ${value}\n`,
  {
    FROM,
    WHERE,
  },
);

export const SELECT = Object.assign(_SELECT, {
  DISTINCT,
  REDUCED,
  ALL: _SELECT`*`,
});

const _CONSTRUCT = createTemplateBuilder(
  (value) => `CONSTRUCT {\n${value}\n}\n`,
  { WHERE },
);

const _CONSTRUCT_WHERE = createTemplateBuilder(
  (value) => `CONSTRUCT WHERE {\n${value}\n}\n`,
  { build, GROUP_BY, ORDER_BY, LIMIT },
);

export const CONSTRUCT = Object.assign(_CONSTRUCT, {
  WHERE: _CONSTRUCT_WHERE,
});

const _ASK = createTemplateBuilder(
  (value) => `ASK {\n${value}\n}\n`,
  { build },
);

const _ASK_FROM = createTemplateBuilder(
  (value) => `ASK\nFROM ${value}\n`,
  { FROM_NAMED, WHERE },
);

const _ASK_FROM_NAMED = createTemplateBuilder(
  (value) => `ASK\nFROM NAMED ${value}\n`,
  { FROM_NAMED, WHERE },
);

const _ASK_WHERE = createTemplateBuilder(
  (value) => `ASK\nWHERE {\n${value}\n}\n`,
  { build, GROUP_BY, ORDER_BY, LIMIT },
);

export const ASK = Object.assign(_ASK, {
  FROM: _ASK_FROM,
  FROM_NAMED: _ASK_FROM_NAMED,
  WHERE: _ASK_WHERE,
});

export const DESCRIBE = createTemplateBuilder(
  (value) => `DESCRIBE ${value}\n`,
  { build, FROM, FROM_NAMED, WHERE },
);
