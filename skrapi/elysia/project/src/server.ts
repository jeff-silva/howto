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
  .onBeforeHandle(({ bearer, set }) => {
    const requiredToken = process.env.API_TOKEN

    // Se o dono da API não configurou um token no .env, as rotas ficam 100% abertas!
    if (!requiredToken)
      return

    // Se o token foi configurado, exigimos que o usuário mande no Header: "Authorization: Bearer <token>"
    if (bearer !== requiredToken) {
      set.status = 401
      return {
        success: false,
        message: "Acesso Negado: Token da API ausente ou inválido.",
      }
    }
  })
  .use(cors())
  .use(html())
  .use(jwt({ secret: config.JWT_SECRET }))
  .use(serverTiming())
  .use(staticPlugin())
  .use(autoload())
  // .get("/", () => "Hello World")

export type ElysiaApp = typeof app
