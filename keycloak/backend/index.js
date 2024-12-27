import express from "express";
import cors from "cors";
import amqpConnection from "./utils/amqp.js";

(async () => {
  try {
    ["KK.EVENT.#", "KK.EVENT.*.MYREALM.#"].map(async (evt) => {
      const amqp = await amqpConnection(evt);
      amqp.onReceive((message) => {
        console.log("message:", { evt, message });
      });
    });
  } catch (err) {
    console.log(err);
  }
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
