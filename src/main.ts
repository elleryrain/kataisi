import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { config } from "dotenv";
import fastifyMultipart from "@fastify/multipart";
import fastifyCors from "@fastify/cors";
import { pipeline } from "node:stream";
import * as fs from "fs";

import { Telegraf } from "telegraf";
import { TelegramBot } from "./bot/bot.service";

config();

const botToken = String(process.env.BOT_TOKEN);

export const bot = new TelegramBot(botToken);

async function main() {
  const port = Number(process.env.PORT);

  bot.start();

  const app = fastify({ logger: true });

  await app.register(fastifyCors);

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // For multipart forms, the max file size in bytes
      files: 10, // Max number of file fields
      fields: 10,
    },
  });

  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), "public"),
  });

  app.get("/", (req, reply) => {
    reply.sendFile("html/index.html");
  });

  app.post("/bike", async (req, reply) => {
    try {
      const images: Buffer[] = [];
      const parts = req.parts();

      const bikeInfo: {
        model: string | undefined;
        desc: string | undefined;
        phone: string | undefined;
      } = {
        model: undefined,
        desc: undefined,
        phone: undefined,
      };
      for await (const field of parts) {
        console.log(field.type);
        if (field.type === "file") {
          const buffer = await field.toBuffer();
          images.push(buffer);
          console.log(`Файл ${field.filename} размером ${buffer.length} байт`);
        } else if (field.type === "field") {
          if (field.fieldname === "model")
            bikeInfo.model = field.value as string;
          if (field.fieldname === "desc") bikeInfo.desc = field.value as string;
          if (field.fieldname === "phone")
            bikeInfo.phone = field.value as string;
        }
      }
      await bot.sendBikeInfo(
        images,
        bikeInfo.model || "пусто",
        bikeInfo.desc || "пусто",
        bikeInfo.phone || "пусто"
      );
      return reply.send({ success: true });
    } catch (error) {
      console.error("Ошибка:", error);
      return reply.status(500).send({ error: "Ошибка загрузки" });
    }
  });

  app.listen({ host: "0.0.0.0", port: 5000 }, (err) => {
    if (err) throw err;
    console.log("[APP] app started");
  });
}

main();
