const fs = require("fs");
const path = require("path");
const createServer = require("sftp-server");

createServer({
  sftp: {
    port: 22,
    hostKeys: [fs.readFileSync(__dirname + "/ssh/id_rsa").toString("utf8")],
    dataDirectory: path.resolve(__dirname, "./data"),
    auth(username, password) {
      return Promise.resolve().then(() => {
        return {
          permissions: {
            MKDIR: true,
          },
        };
      });
    },
    // rateLimitTTL: 10,
  },
  api: {
    port: 8000,
    key: "yYNR8xeUGtcim7XYaUTsdfmkNuKxLHjw77MbPMkZzKoNdsAzyMryVLJEzjVMHpHM",
  },
  log: {
    console: {
      enabled: true,
    },
    file: {
      enabled: true,
      filename: "/var/log/sftp-server.log",
    },
  },
}).then((server) => {
  server.on("ready", () => {
    // ...
  });

  server.on("login", (data) => {
    // ...
  });

  server.on("upload_complete", (data) => {
    // ...
  });

  server.on("remove", (data) => {
    // ...
  });

  server.on("mkdir", (data) => {
    // ...
  });

  server.on("rmdir", (data) => {
    // ...
  });

  server.on("rename", (data) => {
    // ...
  });

  server.listen();
});
