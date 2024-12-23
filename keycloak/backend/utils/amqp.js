import Amqp from "amqplib/callback_api.js";

export default (queue) => {
  return new Promise((resolve, reject) => {
    Amqp.connect("amqp://main:main@rabbitmq:5672", (error0, connection) => {
      if (error0) throw error0;

      connection.createChannel((error1, channel) => {
        if (error1) throw error1;
        channel.assertQueue(queue, { durable: false });

        resolve(
          new (class {
            constructor(queue, connection, channel) {
              this.queue = queue;
              this.channel = channel;
              this.connection = connection;
            }

            send(message) {
              message = JSON.stringify(message);
              channel.sendToQueue(queue, Buffer.from(message));
              return {
                queue: this.queue,
                message,
                connection: this.connection,
                channel: this.channel,
              };
            }

            onReceive(callback) {
              return this.channel.consume(this.queue, (msg) => {
                const message = msg.content.toString();
                callback({ ...msg, message });
                this.channel.ack(msg);
              });
            }
          })(queue, connection, channel)
        );
      });
    });
  });
};
