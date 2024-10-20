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
  // console.log(auth.method);

  return auth.accept(function (session) {
    // Conectado
    const ROOT_DIR = `${__dirname}/tmp/user`;
    console.log(ROOT_DIR);

    session.on("readfile", function (path, writestream) {
      console.log(`session.readfile: ${path}`);
      return fs.createReadStream(ROOT_DIR + path).pipe(writestream);
    });

    session.on("realpath", function (source, callback) {
      if (source == ".") source = ROOT_DIR;
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

      let x = 0;
      responder.on("dir", function () {
        if (typeof files[x] == "undefined") {
          return responder.end();
        }

        responder.file(files[x++]);
      });

      return responder.on("end", function () {
        return console.warn("Directory is done");
      });
    });

    session.on("stat", (source, statkind, statresponder) => {
      console.log(`session.stat: ${source}`);
      fs.stat(source, (err, stats) => {
        if (err) return statresponder.nofile();
        if (stats.isFile()) {
          statresponder.is_file();
        } else {
          statresponder.is_directory();
        }
        return statresponder.file();
      });
    });
  });
});

srv.on("error", function () {
  return console.warn("srv.error");
});

srv.on("end", function () {
  return console.warn("srv.end");
});
