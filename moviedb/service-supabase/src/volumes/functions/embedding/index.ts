// 1. Declare a variável vazia no topo (sem carregar o modelo ainda)
let session: any = null;

Deno.serve(async (req) => {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Missing 'text' parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 2. O modelo só é carregado na RAM quando a primeira requisição chega
    if (!session) {
      session = new Supabase.ai.Session("gte-small");
    }

    // 3. Executa a vetorização usando a API nativa
    const embeddingData = await session.run(text, {
      mean_pool: true,
      normalize: true,
    });

    // Converte o Float32Array retornado para um array convencional do JS
    const embedding = Array.from(embeddingData);

    return new Response(JSON.stringify({ embedding }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
