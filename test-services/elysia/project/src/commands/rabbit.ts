import {
  connectRabbitMQ,
  publishEvent,
  closeRabbitMQ,
} from "../services/rabbitmq.ts";

export default async function handle(args: string[]) {
  await connectRabbitMQ();

  const scope: Record<string, any> = {};
  scope.message = {
    id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    amount: 100,
    created_at: new Date(),
  };

  await publishEvent("shop_order.created", scope.message);
  console.log(scope);

  await closeRabbitMQ();
  process.exit(0);
}
