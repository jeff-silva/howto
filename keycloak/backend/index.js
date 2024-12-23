import express from "express";
import cors from "cors";
import amqpConnection from "./utils/amqp.js";

(async () => {
  try {
    const amqp = await amqpConnection("random");
    amqp.onReceive((message) => {
      console.log("express.ampq.receive:", message);
    });
  } catch (err) {}
})();

// const app = express();
// app.use(cors());

// app.get("/api/rabbitmq/send", async (req, res) => {
//   const amqp = await amqpConnection("random");
//   const { message } = amqp.send(Math.round(Math.random() * 9999));
//   res.json({ message });
// });

// app.listen(3001, () => {
//   console.log(`Example app listening on port 3001`);
// });
