import * as tf from "@tensorflow/tfjs-node";

import express from "express";
const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.json({
    test: true,
  });
});

app.get("/test1", async (req, res) => {
  // const dataset = tf.data.csv("./assets.test.csv", { hasHeader: true });
  // const aaa = dataset.dataset;
  // res.json({ aaa });

  const getResult = async () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    await model.fit(xs, ys, { epochs: 250 });
    return model.predict(tf.tensor2d([20], [1, 1]));
  };

  const result = await getResult();
  res.json({ result });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
