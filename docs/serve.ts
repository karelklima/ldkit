// deno run --allow-net --allow-read serve.ts
import Server from "lume/core/server.ts";
import expires from "lume/middlewares/expires.ts";
import cacheBusting from "lume/middlewares/cache_busting.ts";

const server = new Server({
  port: 8000,
  root: `${Deno.cwd()}/docs/_site`,
});

server.use(expires());
server.use(cacheBusting());

server.start();

console.log("Listening on http://localhost:8000");
