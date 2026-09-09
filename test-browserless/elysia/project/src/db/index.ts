import { drizzle } from "drizzle-orm/bun-sql"
import { config } from "../config.ts"
import { SQL } from "bun"

export const sql = new SQL(config.DATABASE_URL)

export const db = drizzle({
  client: sql,
  casing: "snake_case",
})