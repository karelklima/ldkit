export type PropertySpec = {
  id: string;
  type?: string;
  schema?: SchemaSpec;
  schemaRef?: string;
  optional?: boolean;
  array?: boolean;
  multilang?: boolean;
  inverse?: boolean;
};

export type SchemaSpec = {
  name: string;
  type: string[];
  properties: {
    [key: string]: PropertySpec;
  };
};
