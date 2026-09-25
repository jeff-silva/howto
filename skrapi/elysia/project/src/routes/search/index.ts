import { Elysia, t } from "elysia"
import { executeSearchUseCase } from "../../use-cases/search.usecase"

export default new Elysia()
  .get("/", async ({ query }) => {
    try {
      // Repassa a responsabilidade pro Use Case
      const data = await executeSearchUseCase(query.q, query.page ?? "1")

      return {
        success: true,
        data,
      }
    }
    catch (error: any) {
      return {
        success: false,
        message: "Erro ao buscar resultados",
        error: error.message,
      }
    }
  }, {
    query: t.Object({
      q: t.String({ description: "O termo a ser pesquisado" }),
      page: t.Optional(t.String({ description: "Página dos resultados", default: "1" })),
    }, { additionalProperties: true }),
  })
