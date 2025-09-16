/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const filePath = path.join(
    process.cwd(),
    "app",
    "static",
    "openapi",
    "main.json"
  );

  await fs.promises.writeFile(filePath, JSON.stringify(body.openapi, null, 2));
  return { openapi: body.openapi };
});
