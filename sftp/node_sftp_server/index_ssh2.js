const ssh2 = require("ssh2");
const fs = require("fs");
const path = require("path");

const _log = console.log;
const STATUS_CODE = ssh2.utils.sftp.STATUS_CODE;
let FIRST_LOAD = true;

const fileData = (fpath) => {
  fpath = fs.realpathSync(fpath);
  const stats = fs.statSync(fpath);
  const mode = stats.isFile() ? fs.constants.S_IFREG : fs.constants.S_IFDIR;
  return {
    filename: fpath,
    longname: `-rwxrwxrwx 1 foo foo ${stats.size} ${stats.mtime} ${fpath}`,
    attrs: { ...stats, mode },
  };
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
    _log("client@end");
  });

  client.on("ready", async (ctx) => {
    client.on("session", (accept, reject) => {
      const session = accept();

      session.on("sftp", (accept, reject) => {
        _log("______________INIT______________");
        const sftp = accept();

        const HOME_DIR = "/app/tmp";

        sftp.on("OPEN", (reqid, fpath, flags, attrs) => {
          _log("sftp@OPEN");
          const handle = Buffer.from(fs.realpathSync(fpath));
          sftp.handle(reqid, handle);
        });

        sftp.on("CLOSE", (reqid, handle) => {
          _log("sftp@CLOSE", handle);
          sftp.status(reqid, STATUS_CODE.OK);
          sftpReaddirData.eof = false;
        });

        sftp.on("EXTENDED", () => {
          _log("sftp@EXTENDED");
        });

        sftp.on("FSETSTAT", () => {
          _log("sftp@FSETSTAT");
        });

        sftp.on("FSTAT", () => {
          _log("sftp@FSTAT");
        });

        sftp.on("LSTAT", (reqid, fpath) => {
          _log("sftp@LSTAT");
          try {
            const stats = fs.statSync(fpath);
            sftp.attrs(reqid, stats);
          } catch (err) {
            sftp.status(reqid, STATUS_CODE.FAILURE, err.message);
          }
        });

        sftp.on("MKDIR", () => {
          _log("sftp@MKDIR");
        });

        let sftpOpendir = {
          handleCount: 0,
        };
        sftp.on("OPENDIR", (reqid, fpath) => {
          _log("sftp@OPENDIR", fpath);
          const handle = Buffer.from(fs.realpathSync(fpath));
          sftp.handle(reqid, handle);
        });

        sftp.on("READ", async (reqid, handle, offset, length) => {
          _log("sftp@READ");
          // const fpath = handle.toString();

          // if (handle.length !== 4 || !openFiles[handle.readUInt32BE(0, true)]) {
          //   return sftp.status(reqid, STATUS_CODE.FAILURE);
          // }

          // let state = {};
          // if (state.read) {
          //   sftp.status(reqid, STATUS_CODE.EOF);
          // } else {
          //   state.read = true;
          //   sftp.data(reqid, "bar");
          //   debug("Read from file at offset %d, length %d", offset, length);
          // }
        });

        let sftpReaddirData = {
          eof: false,
        };
        sftp.on("READDIR", async (reqid, handle) => {
          try {
            let fpath = handle.toString();
            fpath = fs.realpathSync(fpath);

            _log("sftp@READDIR", fpath);

            if (sftpReaddirData.eof) {
              sftpReaddirData.eof = false;
              return sftp.status(reqid, STATUS_CODE.EOF);
            }

            sftpReaddirData.eof = true;
            let files = fs
              .readdirSync(fpath)
              .map((file) => fileData(`${fpath}/${file}`));

            sftp.name(reqid, files);
          } catch (err) {}
        });

        sftp.on("READLINK", () => {
          _log("sftp@READLINK");
        });

        sftp.on("REALPATH", (reqid, fpath) => {
          fpath = fs.realpathSync(fpath);
          let items = [fileData(fpath)];
          _log("sftp@REALPATH", fpath);
          sftp.name(reqid, items);
        });

        sftp.on("REMOVE", () => {
          _log("sftp@REMOVE");
        });

        sftp.on("RENAME", () => {
          _log("sftp@RENAME");
        });

        sftp.on("RMDIR", () => {
          _log("sftp@RMDIR");
        });

        sftp.on("SETSTAT", () => {
          _log("sftp@SETSTAT");
        });

        sftp.on("STAT", (reqid, fpath) => {
          _log("sftp@STAT", fpath);
          try {
            const stats = fs.statSync(fpath);
            sftp.attrs(reqid, stats);
          } catch (err) {
            sftp.status(reqid, STATUS_CODE.FAILURE, err.message);
          }
        });

        sftp.on("SYMLINK", () => {
          _log("sftp@SYMLINK");
        });

        sftp.on("WRITE", (reqid, handle, offset, data) => {
          _log("sftp@WRITE");
          try {
            const fpath = handle.toString();
            console.log(fpath);
            // fs.writeSync(fpath, data, 0, data.length, offset);
            sftp.status(reqid, STATUS_CODE.OK);
          } catch (error) {
            console.error(error);
            sftp.status(reqid, STATUS_CODE.FAILURE);
          }
        });

        sftp.on("error", (err) => {
          _log("sftp@error", err);
        });
      });
    });
  });

  client.on("end", () => {
    _log("client disconnected");
  });
});

srv.on("close", () => null);

srv.listen(22, () => {
  _log("Listening on port " + srv.address().port);
});
