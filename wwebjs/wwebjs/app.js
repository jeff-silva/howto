// const { Client } = require("whatsapp-web.js");
// const qrcode = require("qrcode-terminal");

import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client({
  puppeteer: {
    executablePath: "/usr/bin/google-chrome",
    args: ["--disable-gpu", "--no-sandbox"],
  },
});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  // console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
  console.log("\x1b[36m\x1b[1m%s\x1b[0m", "Scan QR on top ^^^");
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  console.log("message", msg);
  // if (msg.body == "!ping") {
  //   msg.reply("pong");
  // }
});

client.on("loading_screen", (state) => {
  console.log("loading_screen", state);
});

client.on("disconnected", (msg) => {
  console.log("disconnected", msg);
});

client.on("authenticated", (session) => {
  console.log("authenticated", session);
});

client.on("message_create", (msg) => {
  console.log("message_create", msg);
});

client.initialize();
