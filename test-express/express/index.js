// import express from "express";
// import cors from "cors";

// const app = express();
// app.use(cors());

// import { Module } from "./src/Module.js";
// Module.setApp(app);

// import AppModule from "./src/app/AppModule.js";
// Module.register(AppModule);

// import AutoModule from "./src/auto/AutoModule.js";
// Module.register(AutoModule);

// Module.init();

// // app.get("/api/v1/test", async (req, res) => {
// //   const random = Math.round(Math.random() * 9999);
// //   res.json({ random });
// //   // setTimeout(() => {
// //   //   res.json({ random });
// //   // }, 1000);
// // });

// app.listen(3000, () => {
//   console.log(`Example app listening on port 3000`);
// });

import AppModule from "./src/App/AppModule.js";
import AutoModule from "./src/Auto/AutoModule.js";

import { App } from "./src/App.js";
const app = new App([AppModule, AutoModule]);
app.init();
