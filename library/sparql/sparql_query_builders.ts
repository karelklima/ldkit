import {
  build,
  createNumericBuilder,
  createTemplateBuilder,
} from "./sparql_shared_builders.ts";

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
