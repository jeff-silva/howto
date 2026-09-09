import type { IBrowserService } from "../../domain/ports/IBrowserService.js";

export class BrowserTestUseCase {
  constructor(private browserService: IBrowserService) {}

  async execute(targetUrl: string = "https://example.com"): Promise<{ success: boolean; title?: string; error?: string }> {
    try {
      await this.browserService.connect();
      await this.browserService.navigateTo(targetUrl);
      
      const title = await this.browserService.getTitle();
      
      return {
        success: true,
        title,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    } finally {
      // Sempre desconecta ao final do caso de uso
      await this.browserService.disconnect();
    }
  }
}
