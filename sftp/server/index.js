"use strict";

// TODO: Verificar Senha da conexão
// TODO: Verificar IP da conexão
// TODO: Bloquear conexão de acordo com users.json

const fs = require("fs");
const ssh2 = require("ssh2");
const SftpServer = require("./lib/ssh2-sftp-server/index.js");

if (!fs.existsSync("./uploads/config.json")) {
  fs.writeFileSync(
    "./uploads/config.json",
    JSON.stringify(
      {
        users: [
          {
            user: "main",
            pass: "main",
            ips: [],
          },
        ],
      },
      null,
      2
    )
  );
}

const config = require("./uploads/config.json");

const options = {
  hostKeys: [fs.readFileSync(`${__dirname}/ssh/id_rsa`)],
  debug: true,
};

let srv = new ssh2.Server(options, (client) => {
  client.on("authentication", (ctx) => {
    if (ctx.method == "password") {
      config.users.map((user) => {
        if (ctx.username == user.user && ctx.password == user.pass) {
          return ctx.accept();
        }
      });
    }

    return ctx.reject();
  });

  client.on("ready", () => {
    client.on("session", (accept, reject) => {
      let session = accept();
      session.on("sftp", (accept, reject) => {
        let sftpStream = accept();
        new SftpServer(sftpStream);
      });
    });
  });
});

srv.on("close", () => null);

srv.listen(22, () => {
  console.log("Listening on port " + srv.address().port);
});
