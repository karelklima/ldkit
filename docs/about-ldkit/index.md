# About LDkit

**LDkit** is Linked Data query toolkit for TypeScript developers.

LDkit lets you access, display and modify any RDF data, and it works in browser,
[Deno](https://deno.land/) and Node. It is sort of an ORM for graph databases.

## Motivation

This toolkit was created to address one prevailing issue within the world of
Linked Data - it is challenging for frontend developers to create user facing
apps, because retrieving RDF data from any source is a non-trivial task. You
need to learn how to parse and process RDF data, or learn SPARQL query language
to query graph-based data. And after you have the data, you need to figure out
how to transform it to native format so that you can display it to the user. In
short, you need to learn a lot of things to create a simple _Hello, World_
Linked Data application.

Over the years there were several attempts to address this issue, but since most
of the attempts came from academia, they are based on legacy technologies
(mostly Java) that are not that useful for modern web. Simply put, the
scientists have been trying to pioneer a pretty interesting technology, but were
unable to reach target audience - application developers that could take
advantage of Linked Data.
