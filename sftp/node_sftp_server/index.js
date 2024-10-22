"use strict";

const fs = require("fs");
const ssh2 = require("ssh2");
const SftpServer = require("./lib/ssh2-sftp-server/index.js");
// const SftpServer = require("ssh2-sftp-server");
const _log = console.log;

const options = {
  hostKeys: [fs.readFileSync(`${__dirname}/ssh/id_rsa`)],
  debug: true,
};

let srv = new ssh2.Server(options, (client) => {
  client.on("authentication", (ctx) => {
    ctx.accept();
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
  _log("Listening on port " + srv.address().port);
});
