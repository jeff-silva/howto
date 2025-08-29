import fs from "fs";
import path from "path";

(async () => {
  let file = { path: path.join(process.cwd(), "schema.json") };
  file.data = JSON.parse(await fs.promises.readFile(file.path, "utf-8"));
  console.log(file);
})();

// const schema = require("./schema.json");

// import { Edge } from "edge.js";
// const edge = Edge.create();
// edge.mount(new URL("./views", import.meta.url));
