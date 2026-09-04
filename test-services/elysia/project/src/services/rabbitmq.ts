import amqp from "amqplib";

// Como o seu usuário e senha têm '@', precisamos encodar para '%40' na URL de conexão
const RABBITMQ_URL = "amqp://main%40grr.la:main%40grr.la@rabbitmq:5672";

let channel: any; // Usando any para evitar erros de tipagem com ConfirmChannel
let connection: any;

export const connectRabbitMQ = async () => {
  for (let i = 0; i < 15; i++) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      // Usamos ConfirmChannel para termos certeza de que o RabbitMQ recebeu a mensagem!
      channel = await connection.createConfirmChannel();
      console.log("🐰 Connected to RabbitMQ!");
      return;
    } catch (error: any) {
      console.error(`❌ RabbitMQ connection error (retry ${i+1}/15)... waiting 2s`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
  console.error("❌ Failed to connect to RabbitMQ after 15 retries.");
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

export const publishToExchange = (exchangeName: string, routingKey: string, message: any, exchangeType: string = 'topic'): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!channel) {
      return reject(new Error("RabbitMQ channel not initialized"));
    }
    
    const payload = JSON.stringify(message);
    
    channel.assertExchange(exchangeName, exchangeType, { durable: true }).then(() => {
      // publish aceita callback se for um ConfirmChannel
      channel.publish(exchangeName, routingKey, Buffer.from(payload), { persistent: true }, (err: any) => {
        if (err) {
          return reject(err);
        }
        console.log(`📤 Published to Exchange '${exchangeName}' with key '${routingKey}':`, message);
        resolve();
      });
    }).catch(reject);
  });
};

export const consumeFromExchange = async (exchangeName: string, routingKey: string, onMessage: (msg: string) => void, exchangeType: string = 'topic', queueName: string = 'main') => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized before starting consumer");
  }
  
  await channel.assertExchange(exchangeName, exchangeType, { durable: true });
  
  // Se queueName for vazio, o RabbitMQ gera um nome aleatório e a fila será exclusiva (deletada ao desconectar)
  const q = await channel.assertQueue(queueName, { exclusive: queueName === '' });
  
  await channel.bindQueue(q.queue, exchangeName, routingKey);
  console.log(`🎧 Listening for messages on Exchange '${exchangeName}' (Queue: '${q.queue}', RoutingKey: '${routingKey}')`);
  
  channel.consume(q.queue, (msg: any) => {
    if (msg) {
      onMessage(msg.content.toString());
      channel.ack(msg);
    }
  });
};

export const closeRabbitMQ = async () => {
  if (channel) await channel.close();
  if (connection) await connection.close();
  console.log("🛑 RabbitMQ connection closed.");
};
