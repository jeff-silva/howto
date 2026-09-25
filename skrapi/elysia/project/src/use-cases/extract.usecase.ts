import type { ExtractedData } from "../entities/extract.entity"
import { Readability } from "@mozilla/readability"
import { JSDOM } from "jsdom"
import TurndownService from "turndown"
import { getBrowser } from "../providers/puppeteer.provider"
import { getOrSetFileCache } from "../providers/cache.provider"

export async function executeExtractUseCase(url: string): Promise<ExtractedData> {
  // Envolvemos a lógica principal no nosso Cache de Arquivo!
  // Tempo de vida: 1 hora (3600000 ms)
  return await getOrSetFileCache(`extract:${url}`, 3600000, async () => {
    const browser = await getBrowser()
    let page

    try {
      page = await browser.newPage()
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 })

      const metaData = await page.evaluate(() => {
        const title = document.title
        const metaTags: Record<string, string> = {}

        document.querySelectorAll("meta").forEach((meta) => {
          const name = meta.getAttribute("name") || meta.getAttribute("property")
          const content = meta.getAttribute("content")
          if (name && content) {
            metaTags[name] = content
          }
        })

        const description = metaTags.description || metaTags["og:description"] || ""
        const html = document.documentElement.outerHTML

        return { title, description, metaTags, html }
      })

      const dom = new JSDOM(metaData.html, { url })
      const reader = new Readability(dom.window.document)
      const article = reader.parse()

      const contentHtml = article ? article.content : ""
      const contentText = article ? article.textContent : ""

      const turndownService = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
      })

      turndownService.addRule("keepLinks", {
        filter: ["a"],
        replacement: (content, node) => {
          const aNode = node as HTMLAnchorElement
          return `[${content}](${aNode.getAttribute("href")})`
        },
      })

      const contentMarkdown = contentHtml ? turndownService.turndown(contentHtml) : ""

      return {
        url,
        title: article?.title || metaData.title,
        description: metaData.description || article?.excerpt || "",
        contentHtml,
        contentText: contentText?.trim() || "",
        contentMarkdown,
        metaTags: metaData.metaTags,
      }
    }
    finally {
      if (page)
        await page.close()
      browser.disconnect()
    }
  })
}
