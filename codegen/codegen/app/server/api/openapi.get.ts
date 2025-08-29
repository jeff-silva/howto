import { promises as fs } from "fs";
import { resolve } from "path";

export default defineEventHandler(async () => {
  const filePath = resolve(process.cwd(), "openapi.json");
  let data = await fs.readFile(filePath, "utf-8");
  data = JSON.parse(data);
  return { data };
});
