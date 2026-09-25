import { Elysia, t } from "elysia";

export default new Elysia()
  .get("/", async ({ query }) => {
    // Transformamos o objeto (que tem o 'q' e o que mais vier) em formato de URL (?q=xxx&format=json)
    // O 'as Record<string, string>' acalma o TypeScript dizendo que todos os valores serão strings
    // const params = new URLSearchParams({
    //   ...query,
    //   format: 'json',
    // } as Record<string, string>);
  
    const params = new URLSearchParams({
      q: query.q,
      pageno: query.page ?? "1",
      safesearch: "0",
      format: 'json',
    } as Record<string, string>);

    try {
      const response = await fetch(`http://searxng:8080/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const resp = (await response.json()) as Record<string, any>;
      const data = (resp.results ?? []).map((item: Record<string, any>) => {
        return {
          url: item.url,
          title: item.title,
          content: item.content,
          thumbnail: item.thumbnail,
        };
      });

      return { data };
      
    } catch (error: any) {
      return {
        success: false,
        message: "Erro ao buscar resultados no SearXNG",
        error: error.message
      };
    }
  }, {
    query: t.Object({
      q: t.String({ description: "O termo a ser pesquisado" }),
      // O t.Optional diz que não é obrigatório. O default preenche sozinho caso o usuário não envie!
      page: t.Optional(t.String({ description: "Página dos resultados", default: "1" })),
    }, { additionalProperties: true })
  });
