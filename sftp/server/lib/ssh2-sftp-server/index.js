"use strict";

const _log = (...args) => {
  console.log(...args);
};

const os = require("os");
const path = require("path");
const fs = require("fs");

const {
  flagsToString,
  OPEN_MODE,
  STATUS_CODE,
} = require("ssh2/lib/protocol/SFTP.js");

const strftime = require("mout/date/strftime");
const pick = require("mout/object/pick");

const { wslpath, winpath } = require("./utils/");

const IS_WIN32 = os.platform() == "win32";

const errorCode = (code) => {
  if (["ENOTEMPTY", "ENOTDIR", "ENOENT"].includes(code))
    return STATUS_CODE.NO_SUCH_FILE;
  if (["EACCES", "EEXIST", "EISDIR"].includes(code))
    return STATUS_CODE.PERMISSION_DENIED;
  return STATUS_CODE.FAILURE;
};

const modeLinux = (filename, filepath) => {
  const Correspondances = [
    "---",
    "--x",
    "-w-",
    "-wx",
    "r--",
    "r-x",
    "rw-",
    "rwx",
  ];

  if (filename == "" && filepath != "/") {
    //this is root
    filename = filepath.toLowerCase().replace(":", "");
  }

  let user = "user",
    group = "user",
    uid = 1000;

  try {
    const stats = fs.statSync(filepath);
    const unixFilePermissions = (stats.mode & parseInt("777", 8)).toString(8);

    var type = stats.isDirectory() ? "d" : "-";
    let mode = "";
    for (let i = 0; i < unixFilePermissions.length; i++)
      mode = mode + Correspondances[unixFilePermissions.charAt(i)];
    var date = strftime(new Date(stats.mtime), "%b %d %H:%M"); //Jun 16 14:41
    let longname = [
      type + mode,
      stats.nlink,
      user,
      group,
      stats.size,
      date,
      filename,
    ].join(" ");
    let attrs = pick(stats, ["mode", "uid", "gid", "size", "atime", "mtime"]);
    attrs.uid = attrs.gid = uid;

    return { filename, longname, attrs };
  } catch (err) {
    return {
      filename,
      longname: `?????????? ? ? ? ? ? ? ? ${filename}`,
    };
  }
};

class SFTP {
  constructor(sftpStream, options = {}) {
    this.openFiles = {};
    this._handleCount = 0;
    this.sftpStream = sftpStream;

    this.options = {
      rootDir: "/",
      ...options,
    };

    sftpStream.on("OPEN", this.OPEN.bind(this));
    sftpStream.on("OPENDIR", this.OPENDIR.bind(this));
    sftpStream.on("READ", this.READ.bind(this));
    sftpStream.on("READDIR", this.READDIR.bind(this));
    sftpStream.on("CLOSE", this.CLOSE.bind(this));
    sftpStream.on("REALPATH", this.REALPATH.bind(this));
    sftpStream.on("STAT", this.STAT.bind(this, "statSync"));
    sftpStream.on("REMOVE", this.REMOVE.bind(this));
    sftpStream.on("RMDIR", this.RMDIR.bind(this));
    sftpStream.on("MKDIR", this.MKDIR.bind(this));
    sftpStream.on("RENAME", this.RENAME.bind(this));
    sftpStream.on("WRITE", this.WRITE.bind(this));
    sftpStream.on("LSTAT", this.STAT.bind(this, "lstatSync"));
    sftpStream.on("FSTAT", (reqID, handle) => {
      this.STAT("fstatSync", reqID, this.openFiles[handle].filepath, handle);
    });
  }

  pathRemoteToLocal(remotepath) {
    if (IS_WIN32) return winpath(remotepath);
    return remotepath.replace(/^\/app/g, this.options.rootDir);
  }

  pathLocalToRemote(localpath) {
    if (IS_WIN32) return wslpath(localpath);
    return localpath.replace(/^\/app/g, this.options.rootDir);
  }

  OPEN(reqid, filepath, flags, attrs = {}) {
    filepath = this.pathRemoteToLocal(filepath);

    _log("OPEN", { filepath });
    flags = flagsToString(flags);

    if (flags != "w" && !fs.existsSync(filepath))
      return this.sftpStream.status(reqid, STATUS_CODE.NO_SUCH_FILE);

    try {
      var handle = fs.openSync(filepath, flags);
      let stat = fs.statSync(filepath);
      handle = Buffer.from([handle]);
      this.openFiles[handle] = { filepath, flags, stat, pos: 0 };
      return this.sftpStream.handle(reqid, handle);
    } catch (err) {
      return this.sftpStream.status(reqid, errorCode(err.code));
    }
  }

  OPENDIR(reqid, remotepath) {
    let filepath = this.pathRemoteToLocal(remotepath);

    _log("OPENDIR", { filepath });

    try {
      let stat = fs.statSync(filepath);
      if (!stat.isDirectory()) {
        return this.sftpStream.status(reqid, STATUS_CODE.FAILURE);
      }
    } catch (err) {
      return this.sftpStream.status(reqid, STATUS_CODE.NO_SUCH_FILE);
    }

    return this.OPEN(reqid, remotepath, OPEN_MODE.READ);
  }

  READ(reqid, handle, offset, length) {
    _log("READ", {});
    var state = this.openFiles[handle];

    if (offset >= state.stat.size)
      return this.sftpStream.status(reqid, STATUS_CODE.EOF);

    var size =
      state.stat.size - state.pos > length
        ? length
        : state.stat.size - state.pos;
    var buffer = new Buffer.alloc(size);

    fs.readSync(handle[0], buffer, 0, size, offset);
    state.pos += size;

    this.sftpStream.data(reqid, buffer);
  }

  async READDIR(reqid, handle) {
    if (this.openFiles[handle].closed) {
      this.sftpStream.status(reqid, STATUS_CODE.EOF);
      return;
    }

    _log("READDIR", {
      openFiles: this.openFiles,
    });

    let names = fs.readdirSync(this.openFiles[handle].filepath);
    names.push(".", "..");
    names = names.map((v) =>
      modeLinux(v, path.join(this.openFiles[handle].filepath, v))
    );

    this.openFiles[handle].closed = true;
    this.sftpStream.name(reqid, names);
  }

  CLOSE(reqid, fd) {
    _log("CLOSE", {});
    fs.closeSync(fd[0]);
    this.sftpStream.status(reqid, STATUS_CODE.OK);
  }

  REALPATH(reqid, filename) {
    if (IS_WIN32)
      filename = this.pathLocalToRemote(this.pathRemoteToLocal(filename));
    else filename = path.resolve(filename);
    _log("REALPATH", { filename });

    this.sftpStream.name(reqid, [{ filename }]);
  }

  STAT(statType, reqid, remotepath, handle) {
    _log("STAT", {});
    let filepath = this.pathRemoteToLocal(remotepath);
    try {
      var fstats = fs[statType](filepath);
      let stats = pick(fstats, [
        "mode",
        "uid",
        "gid",
        "size",
        "atime",
        "mtime",
      ]);

      if (handle && this.openFiles[handle])
        this.openFiles[handle].stats = stats;
      return this.sftpStream.attrs(reqid, stats);
    } catch (err) {
      return this.sftpStream.status(reqid, errorCode(err.code));
    }
  }

  REMOVE(reqid, remotepath) {
    _log("REMOVE", {});
    let filepath = this.pathRemoteToLocal(remotepath);
    fs.unlinkSync(filepath);
    this.sftpStream.status(reqid, STATUS_CODE.OK);
  }

  RMDIR(reqid, remotepath) {
    _log("RMDIR", {});
    let filepath = this.pathRemoteToLocal(remotepath);
    fs.rmdirSync(filepath);
    this.sftpStream.status(reqid, STATUS_CODE.OK);
  }

  MKDIR(reqid, remotepath /*, attrs*/) {
    _log("MKDIR", {});
    let filepath = this.pathRemoteToLocal(remotepath);
    if (!fs.existsSync(filepath)) fs.mkdirSync(filepath);
    this.sftpStream.status(reqid, STATUS_CODE.OK);
  }

  RENAME(reqid, remotepath, newremotePath) {
    _log("RENAME", {});
    let filepath = this.pathRemoteToLocal(remotepath);
    let newfilepath = this.pathRemoteToLocal(newremotePath);
    fs.renameSync(filepath, newfilepath);
    this.sftpStream.status(reqid, STATUS_CODE.OK);
  }

  WRITE(reqid, handle, offset, data) {
    var state = this.openFiles[handle];
    _log("WRITE", { filepath: state.filepath });
    fs.writeSync(state.filepath, data.toString(), 0, data.length, offset);
    this.sftpStream.status(reqid, STATUS_CODE.OK);
  }
}

module.exports = SFTP;
