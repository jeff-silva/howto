import { promises as fs } from "fs";
import { resolve } from "path";
import { readBody } from "h3";

export default defineEventHandler(async (event) => {
  const filePath = resolve(process.cwd(), "openapi.json");
  const data = await readBody(event);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  return { data };
});
