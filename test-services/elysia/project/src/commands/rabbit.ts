import {
  connectRabbitMQ,
  publishEvent,
  closeRabbitMQ,
} from "../services/rabbitmq.ts";

export default async function handle(args: string[]) {
  await connectRabbitMQ();

  const scope: Record<string, any> = {};
  scope.message = { test: "aaa" };
  scope.resp = await publishEvent("elysia_events", scope.message);
  console.log(scope);

  await closeRabbitMQ();
  process.exit(0);
}
