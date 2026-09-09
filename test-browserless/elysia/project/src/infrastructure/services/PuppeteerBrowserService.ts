import puppeteer, { Browser, Page } from "puppeteer-core";
import type { IBrowserService } from "../../domain/ports/IBrowserService.js";

export class PuppeteerBrowserService implements IBrowserService {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private browserUrl: string;

  constructor(browserUrl: string = "http://remote_browser:9223") {
    this.browserUrl = browserUrl;
  }

  async connect(): Promise<void> {
    try {
      this.browser = await puppeteer.connect({
        browserURL: this.browserUrl,
        defaultViewport: null,
      });
      this.page = await this.browser.newPage();
    } catch (error) {
      console.error("Erro ao conectar no remote_browser:", error);
      throw new Error("Falha na conexão com o Chromium remoto");
    }
  }

  async navigateTo(url: string): Promise<void> {
    if (!this.page) throw new Error("O navegador não está conectado.");
    await this.page.goto(url, { waitUntil: "networkidle2" });
  }

  async getTitle(): Promise<string> {
    if (!this.page) throw new Error("O navegador não está conectado.");
    return await this.page.title();
  }

  async disconnect(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.browser) {
      this.browser.disconnect();
      this.browser = null;
    }
  }
}
