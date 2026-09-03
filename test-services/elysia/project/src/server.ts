import { bearer } from "@elysiajs/bearer";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { config } from "./config.ts";

import { connectRabbitMQ, startConsumer, publishEvent } from "./services/rabbitmq.ts";

// Conectar ao RabbitMQ assim que o servidor iniciar
await connectRabbitMQ();
await startConsumer("elysia_events", (msg) => {
  console.log("📥 Received Event from RabbitMQ (elysia_events):", msg);
});

export const app = new Elysia()
  .use(swagger())
  .use(bearer())
  .use(cors())
  .use(jwt({ secret: config.JWT_SECRET }))
  .get("/", () => {
    return { hello: "world" };
  })
  .post("/send-event", async ({ body }) => {
    const payload = body || { message: "Default Event Message" };
    await publishEvent("elysia_events", payload);
    return { success: true, message: "Event pushed to RabbitMQ!" };
  });
