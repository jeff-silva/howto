import SFTPServer from "node-sftp-server";

let myserver = new SFTPServer({
  privateKeyFile: "path_to_private_key_file",
  debug: true,
});

myserver.on("connect", () => {
  myserver.accept();
});

myserver.listen(22);
