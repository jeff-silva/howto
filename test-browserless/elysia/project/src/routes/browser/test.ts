import { Elysia } from "elysia";
import { PuppeteerBrowserService } from "../../infrastructure/services/PuppeteerBrowserService.js";
import { BrowserTestUseCase } from "../../application/use-cases/BrowserTestUseCase.js";

export default new Elysia()
  .group("/", {
    detail: { tags: ["browser-test"] }
  }, (app) => {
    app.get("", async () => {
      // Composition Root (Onde conectamos as pecas)
      const browserService = new PuppeteerBrowserService();
      const useCase = new BrowserTestUseCase(browserService);
      const result = await useCase.execute("https://example.com");
      return result;
    }, {
      detail: {
        summary: "Executa o teste do browser no site de exemplo",
      }
    });
    
    return app;
  });
