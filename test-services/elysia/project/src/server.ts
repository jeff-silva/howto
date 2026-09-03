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
} from "./services/rabbitmq.ts";

// Conectar ao RabbitMQ assim que o servidor iniciar
await connectRabbitMQ();

// Escuta pedido criado
await startConsumer("shop_order.created", async (data) => {
  const shopOrder: any = JSON.parse(data);
  console.log("shop_order.created:", shopOrder);

  await publishEvent("payment_request.created", {
    id: crypto.randomUUID(),
    user_id: shopOrder.user_id,
    amount: shopOrder.amount,
  });
});

// Escruta requisição de pagamento criada
await startConsumer("payment_request.created", async (data) => {
  const paymentRequest: any = JSON.parse(data);
  console.log("payment_request.created:", paymentRequest);
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
