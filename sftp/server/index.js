"use strict";

// TODO: Implementar conexão com chave SSH

const fs = require("fs");
const ssh2 = require("ssh2");
const SftpServer = require("./lib/ssh2-sftp-server/index.js");

const CONFIG_FILE = `${__dirname}/uploads/config.json`;

if (!fs.existsSync(CONFIG_FILE)) {
  fs.writeFileSync(
    CONFIG_FILE,
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

const config = require(CONFIG_FILE);

const options = {
  hostKeys: [fs.readFileSync(`${__dirname}/ssh/id_rsa`)],
  debug: true,
};

const sftpServerOptions = {
  rootDir: "/",
};

let srv = new ssh2.Server(options, (client, info) => {
  client.on("authentication", (ctx) => {
    let success = false;

    if (ctx.method == "password") {
      config.users.map((user) => {
        if (ctx.username == user.user && ctx.password == user.pass) {
          if (user.ips.length > 0) {
            if (!user.ips.includes(info.ip)) {
              return ctx.reject();
            }
          }
          success = true;
        }
      });
    }

    if (success) {
      sftpServerOptions.rootDir = `${__dirname}/uploads/${ctx.username}`;

      if (!fs.existsSync(sftpServerOptions.rootDir)) {
        fs.mkdirSync(sftpServerOptions.rootDir);
      }
      return ctx.accept();
    }

    return ctx.reject();
  });

  client.on("ready", () => {
    client.on("session", (accept, reject) => {
      let session = accept();
      session.on("sftp", (accept, reject) => {
        let sftpStream = accept();
        new SftpServer(sftpStream, sftpServerOptions);
      });
    });
  });
});

srv.on("close", () => null);

srv.listen(22, () => {
  console.log("Listening on port " + srv.address().port);
});
