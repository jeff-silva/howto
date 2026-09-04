import {
  connectRabbitMQ,
  closeRabbitMQ,
  publishToExchange,
} from "../services/rabbitmq.ts";

import { Logger } from "../services/logger.ts";

export default async function handle(args: string[]) {
  await connectRabbitMQ();
  await Logger.clear();

  const scope: Record<string, any> = {};
  scope.order = {
    id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    amount: 100,
    created_at: new Date(),
  };

  await Logger.appendData("publish shop_order status:created", scope.order);
  await publishToExchange("shop_order", "status:created", scope.order);
  await closeRabbitMQ();
  process.exit(0);
}
