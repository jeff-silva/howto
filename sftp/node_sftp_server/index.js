const ssh2 = require("ssh2");
const fs = require("fs");

const STATUS_CODE = ssh2.utils.sftp.STATUS_CODE;

const getRealPath = (path) =>
  path === "." || path === "/."
    ? "/"
    : path.startsWith("./")
    ? path.slice(1)
    : path.startsWith("/")
    ? path
    : `/${path}`;

const createGetDirectory = (path, host, port, ident) => ({
  type: "GET",
  payload: { path, host, port },
  meta: { ident },
});

const isObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";

const getFileRecord = (handleBuffer) => {
  // Validate that the handle buffer is the right size for a 32bit BE integer.
  if (handleBuffer.length !== 4) {
    return null;
  }

  const handle = handleBuffer.readUInt32BE(0); // Get the handle of the file from the SFTP client.

  if (!openFiles.has(handle)) {
    return null;
  }

  return openFiles.get(handle);
};

const options = {
  hostKeys: [fs.readFileSync(`${__dirname}/ssh/id_rsa`)],
  debug: true,
};

let srv = new ssh2.Server(options, (client) => {
  client.on("authentication", (ctx) => {
    return ctx.accept();
  });

  client.on("end", () => {
    console.warn("client@end");
  });

  client.on("ready", async (ctx) => {
    client.on("session", (accept, reject) => {
      const session = accept();
      let openFiles = {};
      let handleCount = 0;
      let calledReadDir = false;

      session.on("sftp", (accept, reject) => {
        const sftp = accept();

        sftp.on("OPEN", (reqid, fpath, flags, attrs) => {
          console.log("sftp@OPEN");
          const handle = Buffer.from(getRealPath(fpath));
          sftp.handle(reqid, handle);
        });

        sftp.on("CLOSE", (reqid, handle) => {
          console.log("sftp@CLOSE");
          sftp.status(reqid, STATUS_CODE.OK);
        });

        sftp.on("EXTENDED", () => {
          console.log("sftp@EXTENDED");
        });

        sftp.on("FSETSTAT", () => {
          console.log("sftp@FSETSTAT");
        });

        sftp.on("FSTAT", () => {
          console.log("sftp@FSTAT");
        });

        sftp.on("LSTAT", () => {
          console.log("sftp@LSTAT");
        });

        sftp.on("MKDIR", () => {
          console.log("sftp@MKDIR");
        });

        sftp.on("OPENDIR", (reqid, fpath) => {
          console.log("sftp@OPENDIR", fpath);
          const handle = Buffer.from(getRealPath(fpath));
          sftp.handle(reqid, handle);
        });

        sftp.on("READ", async (reqid, handle, offset, length) => {
          console.log("sftp@READ");
          const fpath = handle.toString();

          if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0, true)]) {
            return sftp.status(reqid, STATUS_CODE.FAILURE);
          }

          let state = {};
          if (state.read) {
            sftp.status(reqid, STATUS_CODE.EOF);
          } else {
            state.read = true;
            sftp.data(reqid, "bar");
            debug("Read from file at offset %d, length %d", offset, length);
          }
        });

        let sftpReaddirData = {
          eof: false,
        };
        sftp.on("READDIR", async (reqid, handle) => {
          let fpath = handle.toString();
          console.log("sftp@READDIR", { fpath });

          if (sftpReaddirData.eof) {
            return sftp.status(reqid, STATUS_CODE.EOF);
          }

          sftpReaddirData.eof = true;
          let files = fs.readdirSync(fpath).map((filename) => {
            return {
              filename,
              longname: `${fpath}/${filename}`,
              attrs: {
                mode: 777 + fs.constants.S_IFDIR,
                uid: 0,
                gid: 0,
                size: 0,
                atime: 0,
                mtime: 0,
              },
            };
          });

          sftp.name(reqid, files);
          console.log({ files });
        });

        sftp.on("READLINK", () => {
          console.log("sftp@READLINK");
        });

        sftp.on("REALPATH", (reqid, fpath) => {
          if (["/", ".", ".."].includes(fpath)) {
            fpath = `${__dirname}/tmp`;
          }
          fpath = fpath.replace(/\.$/g, "");
          console.log("sftp@REALPATH", fpath);
          sftp.name(reqid, [
            {
              filename: fpath,
              longname: fpath,
              attrs: {
                mode: ssh2.utils.sftp.OPEN_MODE,
                uid: 0,
                gid: 0,
                size: 0,
                atime: 0,
                mtime: 0,
              },
            },
          ]);
        });

        sftp.on("REMOVE", () => {
          console.log("sftp@REMOVE");
        });

        sftp.on("RENAME", () => {
          console.log("sftp@RENAME");
        });

        sftp.on("RMDIR", () => {
          console.log("sftp@RMDIR");
        });

        sftp.on("SETSTAT", () => {
          console.log("sftp@SETSTAT");
        });

        sftp.on("STAT", () => {
          console.log("sftp@STAT");
        });

        sftp.on("SYMLINK", () => {
          console.log("sftp@SYMLINK");
        });

        sftp.on("WRITE", () => {
          console.log("sftp@WRITE");
        });

        sftp.on("error", (err) => {
          console.log("sftp@error", err);
        });
      });
    });
  });

  client.on("end", () => {
    console.log("client disconnected");
  });
});

srv.on("close", () => null);

srv.listen(22, () => {
  console.log("Listening on port " + srv.address().port);
});
