import amqp from "amqplib";

// Como o seu usuário e senha têm '@', precisamos encodar para '%40' na URL de conexão
const RABBITMQ_URL = "amqp://main%40grr.la:main%40grr.la@rabbitmq:5672";

let channel: any; // Usando any para evitar erros de tipagem com ConfirmChannel
let connection: any;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    // Usamos ConfirmChannel para termos certeza de que o RabbitMQ recebeu a mensagem!
    channel = await connection.createConfirmChannel();
    console.log("🐰 Connected to RabbitMQ!");
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error);
  }
};

export const startConsumer = async (queueName: string, onMessage: (msg: string) => void) => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized before starting consumer");
  }
  
  await channel.assertQueue(queueName, { durable: true });
  console.log(`🎧 Listening for messages on queue: ${queueName}`);
  
  // Consumindo mensagens na fila
  channel.consume(queueName, (msg: any) => {
    if (msg) {
      onMessage(msg.content.toString());
      channel.ack(msg); // Confirma que a mensagem foi processada
    }
  });
};

export const publishEvent = (queueName: string, message: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!channel) {
      return reject(new Error("RabbitMQ channel not initialized"));
    }
    
    // Serializa o objeto para JSON automaticamente
    const payload = JSON.stringify(message);
    
    // Garantir que a fila existe antes de publicar
    channel.assertQueue(queueName, { durable: true }).then(() => {
      // sendToQueue no ConfirmChannel aceita um callback
      channel.sendToQueue(queueName, Buffer.from(payload), { persistent: true }, (err: any) => {
        if (err) {
          return reject(err);
        }
        console.log(`📤 Published Event to RabbitMQ on ${queueName}:`, message);
        resolve();
      });
    }).catch(reject);
  });
};

export const closeRabbitMQ = async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
  console.log("🛑 RabbitMQ connection closed.");
};
