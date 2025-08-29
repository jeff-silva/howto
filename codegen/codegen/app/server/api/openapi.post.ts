import { readBody } from "h3";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  return { data };
});
