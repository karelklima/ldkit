# Supported data types

LDkit supports seamless two-way conversion between RDF based data types and
JavaScript / TypeScript native types. Both data and TypeScript types are
adequately converted.

Each property in LDkit [Schema](../components/schema) can be assigned a
particular type. If it is not defined, then it defaults to `xsd:string`.

In addition to regular RDF types, there is one special type `ldkit:IRI` that is
converted to a TypeScript type of `IRI`, which is an alias for string and it
represents and IRI (a value of `NamedNode`).

| RDF Type               | TypeScript type |
| ---------------------- | --------------- |
| xsd:dateTime           | Date            |
| xsd:date               | Date            |
| xsd:gDay               | Date            |
| xsd:gMonthDay          | Date            |
| xsd:gYear              | Date            |
| xsd:gYearMonth         | Date            |
| xsd:boolean            | boolean         |
| xsd:double             | number          |
| xsd:decimal            | number          |
| xsd:float              | number          |
| xsd:integer            | number          |
| xsd:long               | number          |
| xsd:int                | number          |
| xsd:byte               | number          |
| xsd:short              | number          |
| xsd:negativeInteger    | number          |
| xsd:nonNegativeInteger | number          |
| xsd:nonPositiveInteger | number          |
| xsd:positiveInteger    | number          |
| xsd:unsignedByte       | number          |
| xsd:unsignedInt        | number          |
| xsd:unsignedLong       | number          |
| xsd:unsignedShort      | number          |
| xsd:string             | string          |
| xsd:normalizedString   | string          |
| xsd:anyURI             | string          |
| xsd:base64Binary       | string          |
| xsd:language           | string          |
| xsd:Name               | string          |
| xsd:NCName             | string          |
| xsd:NMTOKEN            | string          |
| xsd:token              | string          |
| xsd:hexBinary          | string          |
| rdf:langString         | string          |
| xsd:time               | string          |
| xsd:duration           | string          |
| ldkit:IRI              | IRI             |
