import amqp from "amqplib/callback_api.js";

export default (topic) => {
  return new Promise(async (resolve, reject) => {
    const connectQuery = "amqp://main:main@rabbitmq:5672";
    amqp.connect(connectQuery, (error0, connection) => {
      connection.createChannel((error1, channel) => {
        const exchange = "direct_logs";

        channel.assertExchange(exchange, "direct", {
          durable: false,
        });

        channel.assertQueue("", { exclusive: true }, (error2, q) => {
          console.log({ q });
          channel.consume(
            q.queue,
            (msg) => {
              console.log({ msg });
            },
            { noAck: true }
          );
        });

        // const adminQueue = "admin";
        // channel.assertQueue(adminQueue, { durable: false });
        // channel.bindQueue(adminQueue, "amq.topic", topic);
        // channel.consume(
        //   adminQueue,
        //   (msg) => {
        //     console.log({ msg });
        //   },
        //   { noAck: true }
        // );
      });
    });

    // const channel = await connection.createChannel(() => {
    //   console.log("xxx");
    // });

    // await channel.assertExchange('amq.topic', 'topic', { durable: false });

    // Amqp.connect("amqp://main:main@rabbitmq:5672", (error0, connection) => {
    //   if (error0) throw error0;

    //   connection.createChannel((error1, channel) => {
    //     if (error1) throw error1;
    //     channel.assertQueue(queue, { durable: false });

    //     resolve(
    //       new (class {
    //         constructor(queue, connection, channel) {
    //           this.queue = queue;
    //           this.channel = channel;
    //           this.connection = connection;
    //         }

    //         send(message) {
    //           message = JSON.stringify(message);
    //           channel.sendToQueue(queue, Buffer.from(message));
    //           return {
    //             queue: this.queue,
    //             message,
    //             connection: this.connection,
    //             channel: this.channel,
    //           };
    //         }

    //         onReceive(callback) {
    //           return this.channel.consume(this.queue, (msg) => {
    //             const message = msg.content.toString();
    //             callback({ ...msg, message });
    //             this.channel.ack(msg);
    //           });
    //         }
    //       })(queue, connection, channel)
    //     );
    //   });
    // });
  });
};
