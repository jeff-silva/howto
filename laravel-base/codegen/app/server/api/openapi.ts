/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const filePath = path.join(
    process.cwd(),
    "app",
    "static",
    "openapi",
    "main.json"
  );
  const fileContent = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
});
