import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { config } from "dotenv";
async function main() {
  const port = process.env;
  const app = fastify({ logger: true });
  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), "public"),
  });

  app.get("/", (req, reply) => {
    reply.sendFile("html/index.html");
  });

  app.listen({ host: "0.0.0.0", port: 5000 }, (err) => {
    if (err) throw err;
    console.log("[APP] app started");
  });
}

main();
