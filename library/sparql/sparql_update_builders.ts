import {
  build,
  createNamedNodeBuilder,
  createTemplateBuilder,
} from "./sparql_shared_builders.ts";

const WHERE = createTemplateBuilder(
  (value) => `WHERE {\n${value}\n}\n`,
  { build },
);

const USING_NAMED = createNamedNodeBuilder(
  (value) => `USING NAMED ${value}\n`,
  { WHERE },
);

const USING = createNamedNodeBuilder(
  (value) => `USING ${value}\n`,
  { USING_NAMED, WHERE },
);

const _INSERT = createTemplateBuilder(
  (value) => `INSERT {\n${value}\n}\n`,
  { USING, USING_NAMED, WHERE },
);

const _INSERT_DATA = createTemplateBuilder(
  (value) => `INSERT DATA {\n${value}\n}\n`,
  { build },
);

export const INSERT = Object.assign(_INSERT, {
  DATA: _INSERT_DATA,
});

const _DELETE = createTemplateBuilder(
  (value) => `DELETE {\n${value}\n}\n`,
  { INSERT: _INSERT, USING, USING_NAMED, WHERE },
);

const _DELETE_DATA = createTemplateBuilder(
  (value) => `DELETE DATA {\n${value}\n}\n`,
  { build },
);

export const DELETE = Object.assign(_DELETE, {
  DATA: _DELETE_DATA,
});

export const WITH = createNamedNodeBuilder(
  (value) => `WITH ${value}\n`,
  { build, INSERT: _INSERT, DELETE: _DELETE },
);
