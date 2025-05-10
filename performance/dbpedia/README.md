# DBpedia performance suite

This test suite include a set of tests that query data from DBpedia SPARQL
endpoint. There are three scenarios, ranging from the most simple one to the
most complex.

Please be aware that the test scenarios may timeout unexpectedly because of rate
limiting of the public endpoint.

Deno is required to run the test scenarios.

## 1) Install Deno

Windows:

```
irm https://deno.land/install.ps1 | iex
```

MacOS/Linux:

```
curl -fsSL https://deno.land/install.sh | sh
```

## 2) Run test scenarios

```
deno task scenario1
```

```
deno task scenario2
```

```
deno task scenario3
```
