import { Elysia, t } from "elysia"
import { executeExtractUseCase } from "../../use-cases/extract.usecase"

export default new Elysia()
  .get("/", async ({ query }) => {
    try {
      const data = await executeExtractUseCase(query.url)

      return {
        success: true,
        data,
      }
    }
    catch (error: any) {
      return {
        success: false,
        message: "Erro ao extrair dados da URL",
        error: error.message,
      }
    }
  }, {
    query: t.Object({
      url: t.String({ description: "URL completa para extrair (ex: https://pt.wikipedia.org/wiki/Bun)" }),
    }),
  })
