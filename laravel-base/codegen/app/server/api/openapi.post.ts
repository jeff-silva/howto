/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return { openapi: body.openapi };
});
