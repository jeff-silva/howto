import {
  connectRabbitMQ,
  publishEvent,
  closeRabbitMQ,
  publishToExchange,
} from "../services/rabbitmq.ts";

import { Logger } from "../services/logger.ts";

export default async function handle(args: string[]) {
  await Logger.clear();

  await connectRabbitMQ();

  const scope: Record<string, any> = {};
  scope.order = {
    id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    amount: 100,
    created_at: new Date(),
  };

  await Logger.appendData("publish shop_order status:created", scope.order);
  await publishToExchange("shop_order", "status:created", scope.order);
  // await publishEvent("shop_order.created", scope.message);

  await closeRabbitMQ();
  process.exit(0);
}
