import amqp from "amqplib";

// Como o seu usuário e senha têm '@', precisamos encodar para '%40' na URL de conexão
const RABBITMQ_URL = "amqp://main%40grr.la:main%40grr.la@rabbitmq:5672";
const QUEUE_NAME = "elysia_events";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log("🐰 Connected to RabbitMQ and asserting queue:", QUEUE_NAME);

    // Consumindo mensagens na fila
    channel.consume(QUEUE_NAME, (msg) => {
      if (msg) {
        console.log("📥 Received Event from RabbitMQ:", msg.content.toString());
        channel.ack(msg); // Confirma que a mensagem foi processada
      }
    });
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error);
  }
};

export const publishEvent = async (message: string) => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });
  console.log("📤 Published Event to RabbitMQ:", message);
};
