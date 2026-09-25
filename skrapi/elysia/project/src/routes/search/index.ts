import { Elysia, t } from "elysia";

export default new Elysia()
  .get("/", async ({ query }) => {
    // Transformamos o objeto (que tem o 'q' e o que mais vier) em formato de URL (?q=xxx&format=json)
    // O 'as Record<string, string>' acalma o TypeScript dizendo que todos os valores serão strings
    const params = new URLSearchParams({
      ...query,
      format: 'json',
    } as Record<string, string>);


    try {
      const response = await fetch(`http://searxng:8080/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      // Retorna o JSON direto do SearXNG
      const data = (await response.json()) as Record<string, any>;
      const results = (data.results ?? []).map((item: Record<string, any>) => {
        return {
          url: item.url,
          title: item.title,
          content: item.content,
          thumbnail: item.thumbnail,
        };
      });
      return results;
      
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
    }, { additionalProperties: true }) // Isso diz pro TypeBox: "Aceite o 'q' mas não jogue fora os outros parâmetros!"
  });
