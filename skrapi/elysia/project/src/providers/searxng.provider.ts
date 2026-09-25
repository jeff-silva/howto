export async function fetchFromSearxng(q: string, pageno: string = "1"): Promise<Record<string, any>> {
  const params = new URLSearchParams({
    q,
    pageno,
    safesearch: "0",
    format: "json",
  } as Record<string, string>)

  const response = await fetch(`http://searxng:8080/search?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Erro HTTP no SearXNG: ${response.status}`)
  }

  return (await response.json()) as Record<string, any>
}
