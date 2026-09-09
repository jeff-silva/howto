import { Elysia } from "elysia"
import { config } from "./config.ts"
import { swagger } from "@elysiajs/swagger"
import { bearer } from "@elysiajs/bearer"
import { cors } from "@elysiajs/cors"
import { jwt } from "@elysiajs/jwt"
import { autoload } from "elysia-autoload"

export const app = new Elysia()
.use(swagger())
.use(bearer())
.use(cors())
.use(jwt({ secret: config.JWT_SECRET }))
.use(await autoload())
.get("/", () => {
  return { hello: 'world' };
})

export type ElysiaApp = typeof app