import fs from "fs";
import SFTPServer from "node-sftp-server";
import ReadableStreamClone from "readable-stream-clone";

let srv = new SFTPServer({
  privateKeyFile: "./ssh/id_rsa",
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

    session.on("realpath", function (path, callback) {
      callback("/tmp/");
    });

    session.on("writefile", function (path, readstream, ex) {
      let something = fs.createWriteStream("tmp");
      return readstream.pipe(something);
    });

    // return session.on ...
    session.on("readdir", function (path, responder) {
      let files, i, j, results;

      // collect the files placed in the out directory
      // it applies an async flow not clear to me
      files = function () {
        results = [];
        fs.readdir("./tmp", (err, files) => {
          (files || []).forEach((file) => {
            results.push(file);
          });
        });
        return results;
      }.apply(this);

      i = 0;
      responder.on("dir", function () {
        if (files[i]) {
          responder.file(files[i]);
          return i++;
        } else {
          return responder.end();
        }
      });
      return responder.on("end", function () {});
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
