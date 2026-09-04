import { bearer } from "@elysiajs/bearer";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { config } from "./config.ts";

import {
  connectRabbitMQ,
  startConsumer,
  publishEvent,
  consumeFromExchange,
  publishToExchange,
} from "./services/rabbitmq.ts";
import { Logger } from "./services/logger.ts";

// Conectar ao RabbitMQ assim que o servidor iniciar
await connectRabbitMQ();

await consumeFromExchange("shop_order", "status:created", async (msg) => {
  const paymentRequest = JSON.parse(msg);
  await Logger.appendData('consume shop_order status:created', msg);
  await publishToExchange("payment_request", "status:created", {
    id: crypto.randomUUID(),
    payment_method: 'pix',
    amount: paymentRequest.amount,
    user_id: paymentRequest.user_id,
  });
});

await consumeFromExchange("payment_request", "status:created", async (msg) => {
  await Logger.appendData('consume payment_request status:created', msg);
});

// Rotas
export const app = new Elysia()
  .use(swagger())
  .use(bearer())
  .use(cors())
  .use(jwt({ secret: config.JWT_SECRET }))
  .get("/", () => {
    return { hello: "world" };
  });
