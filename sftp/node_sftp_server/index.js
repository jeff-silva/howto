let fs = require("fs");
let path = require("path");
// let SFTPServer = require("./src/server.js");
let SFTPServer = require("node-sftp-server");

let srv = new SFTPServer({
  privateKeyFile: `${__dirname}/ssh/id_rsa`,
  debug: false,
});

srv.on("connect", (auth) => {
  auth.accept();
});

srv.listen(22);

srv.on("connect", function (auth, info) {
  return auth.accept(function (session) {
    // Conectado

    session.on("readfile", function (path, writestream) {
      console.log(`session.readfile: ${path}`);
      return fs.createReadStream("tmp" + path).pipe(writestream);
    });

    session.on("realpath", function (source, callback) {
      if (source == ".") source = `${__dirname}/tmp`;
      source = source.replace(/\.$/, "");
      console.log(`session.realpath: ${source}`);
      callback(source);
    });

    session.on("writefile", function (file, readstream, ex) {
      console.log(`session.writefile: ${file}`);
      return readstream.pipe(fs.createWriteStream(file));
    });

    session.on("readdir", async (path, responder) => {
      let files = fs.readdirSync("./tmp");
      console.log(`session.readdir:`, files);
      responder.on("dir", () => {
        files.map((file) => responder.file(file));
        responder.end();
      });
    });

    session.on("stat", function (path, statkind, statresponder) {
      // avoid warning
    });
  });
});

srv.on("error", function () {
  return console.warn("srv.error");
});

srv.on("end", function () {
  return console.warn("srv.end");
});
