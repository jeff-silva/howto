import { bearer } from "@elysiajs/bearer"
import { cors } from "@elysiajs/cors"
import { html } from "@elysiajs/html"
import { jwt } from "@elysiajs/jwt"
import { serverTiming } from "@elysiajs/server-timing"
import { staticPlugin } from "@elysiajs/static"
import { swagger } from "@elysiajs/swagger"
import { Elysia } from "elysia"
import { autoload } from "elysia-autoload"
import { oauth2 } from "elysia-oauth2"
import { config } from "./config.ts"

export const app = new Elysia()
  .use(swagger())
  .use(oauth2({}))
  .use(bearer())
  .use(cors())
  .use(html())
  .use(jwt({ secret: config.JWT_SECRET }))
  .use(serverTiming())
  .use(staticPlugin())
  .use(autoload())
  // .get("/", () => "Hello World")

export type ElysiaApp = typeof app
