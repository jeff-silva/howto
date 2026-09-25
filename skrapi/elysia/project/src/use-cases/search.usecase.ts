import type { SearchResultItem } from "../entities/search.entity"
import { fetchFromSearxng } from "../providers/searxng.provider"

export async function executeSearchUseCase(query: string, page: string): Promise<SearchResultItem[]> {
  // 1. Busca os dados brutos no provedor
  const rawData = await fetchFromSearxng(query, page)

  // 2. Limpa e mapeia os resultados usando a nossa tipagem da Entity
  const cleanResults: SearchResultItem[] = (rawData.results ?? []).map((item: Record<string, any>) => ({
    url: item.url,
    title: item.title,
    content: item.content,
    thumbnail: item.thumbnail,
  }))

  return cleanResults
}
