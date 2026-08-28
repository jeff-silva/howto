import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";

import { AppError, AppErrorType } from "../shared/errors/AppError";
import { ErrorTranslator } from "./ErrorTranslator";

import testRoutes from "../modules/test/infrastructure/http/routes";

const app = new Elysia()
  .use(openapi())
  .onError(({ error, set }) => {
    if (error instanceof AppError) {
      set.status = ErrorTranslator.toHttpCode(error);
      return { error: error.type, message: error.message };
    }
    set.status = 500;
    return { error: "INTERNAL", message: "Erro inesperado no servidor." };
  })
  .get("/", () => ({ hello: "world" }))
  .use(testRoutes)
  .listen(3000);
