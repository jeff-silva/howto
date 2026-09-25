import type { SearchResultItem } from "../entities/search.entity"
import { fetchFromSearxng } from "../providers/searxng.provider"

export async function executeSearchUseCase(query: string, page: string): Promise<SearchResultItem[]> {
  // 1. Busca os dados brutos no provedor
  const rawData = await fetchFromSearxng(query, page)

  // 2. Limpa e mapeia os resultados usando a nossa tipagem da Entity
  const cleanResults: SearchResultItem[] = (rawData.results ?? []).map((item: Record<string, any>) => {
    // Helper para limpar quebras de linha e espaços duplos
    const cleanText = (text?: string) => {
      if (!text) return ""
      return text.replace(/\s+/g, " ").trim()
    }

    return {
      url: item.url,
      title: cleanText(item.title),
      content: cleanText(item.content),
      thumbnail: item.thumbnail || "",
    }
  })

  return cleanResults
}
