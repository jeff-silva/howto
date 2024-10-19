"use strict";

var ContextWrapper,
  DirectoryEmitter,
  EventEmitter,
  Readable,
  Responder,
  SFTP,
  SFTPFileStream,
  SFTPServer,
  SFTPSession,
  Statter,
  Transform,
  Writable,
  constants,
  fs,
  ssh2,
  ssh2_stream,
  extend = function (child, parent) {
    for (var key in parent) {
      if (hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

ssh2 = require("ssh2");

ssh2_stream = require("ssh2-streams");

SFTP = ssh2_stream.SFTPStream;

Readable = require("stream").Readable;

Writable = require("stream").Writable;

Transform = require("stream").Transform;

EventEmitter = require("events").EventEmitter;

fs = require("fs");

constants = require("constants");

Responder = (function (superClass) {
  extend(Responder, superClass);

  Responder.Statuses = {
    denied: "PERMISSION_DENIED",
    nofile: "NO_SUCH_FILE",
    end: "EOF",
    ok: "OK",
    fail: "FAILURE",
    bad_message: "BAD_MESSAGE",
    unsupported: "OP_UNSUPPORTED",
  };

  function Responder(req1) {
    var fn, methodname, ref, symbol;
    this.req = req1;
    ref = this.constructor.Statuses;
    fn = (function (_this) {
      return function (symbol) {
        return (_this[methodname] = function () {
          _this.done = true;
          console.warn(
            "Going to invoke " +
              symbol +
              " on behalf of req: " +
              _this.req +
              ". value: " +
              ssh2.SFTP_STATUS_CODE[symbol]
          );
          return _this.sftpStream.status(
            _this.req,
            ssh2.SFTP_STATUS_CODE[symbol]
          );
        });
      };
    })(this);
    for (methodname in ref) {
      symbol = ref[methodname];
      fn(symbol);
    }
  }

  return Responder;
})(EventEmitter);

DirectoryEmitter = (function (superClass) {
  extend(DirectoryEmitter, superClass);

  function DirectoryEmitter(sftpStream1, req1) {
    this.sftpStream = sftpStream1;
    this.req = req1 != null ? req1 : null;
    this.stopped = false;
    this.done = false;
    DirectoryEmitter.__super__.constructor.call(this, this.req);
  }

  DirectoryEmitter.prototype.request_directory = function (req) {
    this.req = req;
    console.warn("Directory entry requested! " + req);
    if (!this.done) {
      return this.emit("dir");
    } else {
      return this.end();
    }
  };

  DirectoryEmitter.prototype.file = function (name) {
    console.warn("Returning a file: " + name + " for req: " + this.req);
    this.stopped = this.sftpStream.name(this.req, {
      filename: name.toString(),
      longname: name.toString(),
      attrs: {},
    });
    if (!this.stopped && !this.done) {
      return this.emit("dir");
    }
  };

  return DirectoryEmitter;
})(Responder);

ContextWrapper = (function () {
  function ContextWrapper(ctx1, server) {
    this.ctx = ctx1;
    this.server = server;
    this.method = this.ctx.method;
    this.username = this.ctx.username;
    this.password = this.ctx.password;
  }

  ContextWrapper.prototype.reject = function () {
    return this.ctx.reject();
  };

  ContextWrapper.prototype.accept = function (callback) {
    if (callback == null) {
      callback = function () {};
    }
    console.warn("Accepting callback!!!!!");
    this.ctx.accept();
    return (this.server._session_start_callback = callback);
  };

  return ContextWrapper;
})();

module.exports = SFTPServer = (function (superClass) {
  extend(SFTPServer, superClass);

  function SFTPServer() {
    this.server = new ssh2.Server(
      {
        privateKey: fs.readFileSync("ssh_host_rsa_key"),
      },
      (function (_this) {
        return function (client, info) {
          client.on("authentication", function (ctx) {
            console.warn("Authentication!");
            _this.auth_wrapper = new ContextWrapper(ctx, _this);
            return _this.emit("connect", _this.auth_wrapper);
          });
          client.on("end", function () {
            console.warn("Disconnection!");
            return _this.emit("end");
          });
          return client.on("ready", function (channel) {
            client._sshstream.debug = function (msg) {
              return "CLIENT ssh stream debug: " + msg;
            };
            console.warn("Uhm, I guess we authenticated OK?");
            return client.on("session", function (accept, reject) {
              var session;
              session = accept();
              return session.on("sftp", function (accept, reject) {
                var sftpStream;
                console.log("Client SFTP session?!?!!?!?!?");
                sftpStream = accept();
                session = new SFTPSession(sftpStream);
                return _this._session_start_callback(session);
              });
            });
          });
        };
      })(this)
    );
  }

  SFTPServer.prototype.listen = function (port) {
    return this.server.listen(port);
  };

  return SFTPServer;
})(EventEmitter);

Statter = (function () {
  function Statter(sftpStream1, reqid1) {
    this.sftpStream = sftpStream1;
    this.reqid = reqid1;
  }

  Statter.prototype.is_file = function () {
    return (this.type = constants.S_IFREG);
  };

  Statter.prototype.is_directory = function () {
    return (this.type = constants.S_IFDIR);
  };

  Statter.prototype.file = function (attrs) {
    if (attrs == null) {
      attrs = {};
    }
    return this.sftpStream.attrs(this.reqid, this._get_statblock());
  };

  Statter.prototype.nofile = function () {
    return this.sftpStream.status(
      this.reqid,
      ssh2.SFTP_STATUS_CODE.NO_SUCH_FILE
    );
  };

  Statter.prototype._get_mode = function () {
    return this.type | this.permissions;
  };

  Statter.prototype._get_statblock = function () {
    return {
      mode: this._get_mode(),
      uid: this.uid,
      gid: this.gid,
      size: this.size,
      atime: this.atime,
      mtime: this.mtime,
    };
  };

  return Statter;
})();

SFTPFileStream = (function (superClass) {
  extend(SFTPFileStream, superClass);

  function SFTPFileStream() {
    return SFTPFileStream.__super__.constructor.apply(this, arguments);
  }

  SFTPFileStream.prototype._read = function (size) {};

  return SFTPFileStream;
})(Readable);

SFTPSession = (function (superClass) {
  extend(SFTPSession, superClass);

  SFTPSession.Events = [
    "REALPATH",
    "STAT",
    "LSTAT",
    "OPENDIR",
    "CLOSE",
    "REMOVE",
    "READDIR",
    "OPEN",
    "READ",
    "WRITE",
  ];

  function SFTPSession(sftpStream1) {
    var event, fn, i, len, ref;
    this.sftpStream = sftpStream1;
    this.max_filehandle = 0;
    this.handles = {};
    ref = this.constructor.Events;
    fn = (function (_this) {
      return function (event) {
        console.warn("Now looking at event: " + event);
        return _this.sftpStream.on(event, function () {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          console.warn(
            "UNIVERSAL EVENT DETECTED: " + event + " - reqid: " + args[0]
          );
          return _this[event].apply(_this, args);
        });
      };
    })(this);
    for (i = 0, len = ref.length; i < len; i++) {
      event = ref[i];
      fn(event);
    }
  }

  SFTPSession.prototype.fetchhandle = function () {
    var prevhandle;
    prevhandle = this.max_filehandle;
    this.max_filehandle++;
    return new Buffer(prevhandle.toString());
  };

  SFTPSession.prototype.REALPATH = function (reqid, path) {
    var callback;
    console.warn(
      "REALPATH METHOD CALLED via reqid: " + reqid + " for path: " + path
    );
    if (EventEmitter.listenerCount(this, "realpath")) {
      callback = (function (_this) {
        return function (name) {
          return _this.sftpStream.name(reqid, {
            filename: name,
            longname: "-rwxrwxrwx 1 foo foo 3 Dec 8 2009 " + name,
            attrs: {},
          });
        };
      })(this);
      return this.emit("realpath", path, callback);
    } else {
      return this.sftpStream.name(reqid, {
        filename: path,
        longname: path,
        attrs: {},
      });
    }
  };

  SFTPSession.prototype.do_stat = function (reqid, path, kind) {
    if (EventEmitter.listenerCount(this, "stat")) {
      return this.emit("stat", path, kind, new Statter(this.sftpStream, reqid));
    } else {
      console.warn(
        "WARNING: No stat function for " + kind + ", all files exist!"
      );
      return this.sftpStream.attrs(reqid, {
        filename: path,
        longname: path,
        attrs: {},
      });
    }
  };

  SFTPSession.prototype.STAT = function (reqid, path) {
    return this.do_stat(reqid, path, "STAT");
  };

  SFTPSession.prototype.LSTAT = function (reqid, path) {
    return this.do_stat(reqid, path, "LSTAT");
  };

  SFTPSession.prototype.OPENDIR = function (reqid, path) {
    var diremit;
    diremit = new DirectoryEmitter(this.sftpStream, reqid);
    diremit.on(
      "newListener",
      (function (_this) {
        return function (event, listener) {
          var handle;
          console.warn("New Listener detected!!!!! FREAK OUT!!!! " + event);
          if (event !== "dir") {
            return;
          }
          handle = _this.fetchhandle();
          _this.handles[handle] = {
            mode: "OPENDIR",
            path: path,
            loc: 0,
            responder: diremit,
          };
          return _this.sftpStream.handle(reqid, handle);
        };
      })(this)
    );
    return this.emit("readdir", path, diremit);
  };

  SFTPSession.prototype.READDIR = function (reqid, handle) {
    var ref;
    if (
      ((ref = this.handles[handle]) != null ? ref.mode : void 0) !== "OPENDIR"
    ) {
      console.warn("handle: " + handle + " is not an open directory!");
      return this.sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.NO_SUCH_FILE);
    }
    return this.handles[handle].responder.request_directory(reqid);
  };

  SFTPSession.prototype.OPEN = function (reqid, pathname, flags, attrs) {
    var handle, rs, started, stringflags, ts;
    stringflags = SFTP.flagsToString(flags);
    switch (stringflags) {
      case "r":
        ts = new Transform();
        ts._transform = function (data, encoding, callback) {
          this.push(data);
          return callback();
        };
        ts._flush = function (cb) {
          ts.eof = true;
          return cb();
        };
        handle = this.fetchhandle();
        this.handles[handle] = {
          mode: "READ",
          path: pathname,
          stream: ts,
        };
        this.emit("readfile", pathname, ts);
        return this.sftpStream.handle(reqid, handle);
      case "w":
        rs = new Readable();
        started = false;
        rs._read = (function (_this) {
          return function (bytes) {
            if (started) {
              return;
            }
            handle = _this.fetchhandle();
            console.warn(
              "INTERNAL _read METHOD INVOKED, DELAYED HANDLE IS BEING RETURNED: " +
                handle
            );
            _this.handles[handle] = {
              mode: "WRITE",
              path: pathname,
              stream: rs,
            };
            _this.sftpStream.handle(reqid, handle);
            return (started = true);
          };
        })(this);
        return this.emit("writefile", pathname, rs);
      default:
        return this.emit(
          "error",
          new Error("Unknown open flags: " + stringflags)
        );
    }
  };

  SFTPSession.prototype.READ = function (reqid, handle, offset, length) {
    var badchunk, chunk, goodchunk;
    console.warn(
      "READ REQUEST FIRED - all we're doing is...asking for reqid: " +
        reqid +
        ", offset: " +
        offset +
        ", length: " +
        length
    );
    chunk = this.handles[handle].stream.read();
    if (chunk) {
      console.warn("INSTA-CHUNK AVAIL!!!!");
      if ((chunk != null ? chunk.length : void 0) > length) {
        console.warn(
          "CHUNK IS TOOOOOOOOOOO BIIIIIIGGGGGGGG - you should split, return one, and 'unshift' the other?"
        );
        badchunk = chunk.slice(length);
        goodchunk = chunk.slice(0, length);
        chunk = goodchunk;
        this.handles[handle].stream.unshift(badchunk);
      }
      return this.sftpStream.data(reqid, chunk);
    } else {
      if (this.handles[handle].stream.eof) {
        return this.sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.EOF);
      }
      return this.handles[handle].stream.once(
        "readable",
        (function (_this) {
          return function () {
            console.warn("READABLE FIRED?!");
            chunk = _this.handles[handle].stream.read();
            if ((chunk != null ? chunk.length : void 0) > length) {
              console.warn(
                "CHUNK IS TOOOOOOOOOOO BIIIIIIGGGGGGGG - you should split, return one, and 'unshift' the other?"
              );
              badchunk = chunk.slice(length);
              goodchunk = chunk.slice(0, length);
              chunk = goodchunk;
              _this.handles[handle].stream.unshift(badchunk);
            }
            console.warn(
              "Read request gave us " +
                (chunk != null ? chunk.length : void 0) +
                " bytes!"
            );
            if (chunk) {
              _this.sftpStream.data(reqid, chunk);
              return _this.handles[handle].stream.read(0);
            } else {
              if (_this.handles[handle].stream.finished) {
                return _this.sftpStream.status(
                  reqid,
                  ssh2.SFTP_STATUS_CODE.EOF
                );
              } else {
                console.warn("RETURNING EMPTY STREAM!");
                _this.sftpStream.data(reqid, new Buffer(""));
                return _this.handles[handle].stream.read(0);
              }
            }
          };
        })(this)
      );
    }
  };

  SFTPSession.prototype.WRITE = function (reqid, handle, offset, data) {
    console.warn(
      "WRITE DETECTED: handle: " +
        handle +
        ", offset: " +
        offset +
        ", datalength: " +
        data.length
    );
    this.handles[handle].stream.push(data);
    return this.sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
  };

  SFTPSession.prototype.CLOSE = function (reqid, handle) {
    return this.sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
    if (this.handles[handle]) {
      switch (this.handles[handle].mode) {
        case "OPENDIR":
          console.warn("Closing directory for handle: " + handle);
          this.handles[handle].responder.emit("end");
          delete this.handles[handle];
          return this.sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
        case "READ":
          delete this.handles[handle];
          return this.sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
        case "WRITE":
          console.warn("CLOSE-WRITE");
          this.handles[handle].stream.push(null);
          delete this.handles[handle];
          return this.sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.OK);
        default:
          console.warn("Handle: " + handle + " has data:");
          console.dir(this.handles[handle]);
          return this.sftpStream.status(reqid, ssh2.SFTP_STATUS_CODE.FAILURE);
      }
    }
  };

  SFTPSession.prototype.REMOVE = function (reqid, handle) {
    return this.emit("delete", new Responder(reqid));
  };

  return SFTPSession;
})(EventEmitter);
