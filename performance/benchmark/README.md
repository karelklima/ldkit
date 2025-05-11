# Performance benchmark

This test suite runs a series of performance tests against local triplestore and
publishes results into the `results.json` file.

A test specification consists of a key with three numbers, e.g. `10 0 5`, which
represent the complexity of LDkit schema that is being used for the performance
test. The first number represents the number of simple properties in the schema,
the second represents a number of array properties (each array has three
elements), and the third represents a number of object properties in the schema
(each object has three properties on its own). For example, the `10 0 5` test
includes a LDkit schema with 10 simple properties and 5 object properties,
having 15 properties in total.

Each test case measures the execution time of querying 1000 entities according
to the schema for both LDkit and direct query of the triplestore, so that the
two times can be compared.

## Test results

The rest results contained in the `results.json` show average execution time for
various test cases. The test was performed on a PC with Intel Core i7-5500U CPU
@ 2.40 GHz and 8 GB RAM running Windows 10. Local installation of GraphDB
version 11.0 was used as the triplestore.

## Running the benchmark

Deno and GraphDB are required to run the test scenarios. Instead of GraphDB,
another triplestore may be used.

### 1) Install Deno

Windows:

```
irm https://deno.land/install.ps1 | iex
```

MacOS/Linux:

```
curl -fsSL https://deno.land/install.sh | sh
```

### 2) Install GraphDB

[GraphDB Desktop installation](https://graphdb.ontotext.com/documentation/11.0/graphdb-desktop-installation.html)

### 3) Populate the triplestore with data

```
deno task populate
```

The script will create 10000 entities that will be used for the performance
test.

### 4) Run the performance tests

```
deno task test
```

The results of the test are saved into `results.json` file.
