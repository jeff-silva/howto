const readline = require('node:readline');
const fs = require('node:fs');
const path = require('node:path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (text) => new Promise(resolve => rl.question(text, resolve));

async function run() {
  const args = process.argv.slice(2);
  let query = args.join(" ");

  if (!query) {
    query = await askQuestion("🔎 O que você deseja buscar? (fique livre para usar aspas!)\n> ");
  }
  
  if (!query.trim()) {
    console.log("Busca cancelada ou vazia.");
    rl.close();
    return;
  }

  const maxLinksInput = await askQuestion("🔢 Quantos itens no máximo você deseja capturar? (Padrão: 100)\n> ");
  const MAX_LINKS = parseInt(maxLinksInput) || 100;
  
  rl.close();
  
  // Cria o slug
  const slug = query
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  console.log(`\nFazendo busca por: "${query}"...`);

  try {
    const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`, {
      headers: {
        "Authorization": `Bearer ${process.env.API_TOKEN}`
      }
    });

    const resp = await response.json();

    if (!response.ok) {
      console.error("❌ Erro na API:", resp);
      return;
    }

    const resultsDir = path.join(__dirname, "results");
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const outputPath = path.join(resultsDir, `${slug}.json`);

    // Inicializa todos os resultados originais com extracted: false
    resp.data = resp.data.map(item => ({ ...item, extracted: false }));

    // Salva apenas os resultados brutos da busca no formato JSON (Etapa 1)
    fs.writeFileSync(outputPath, JSON.stringify(resp.data, null, 2));
    console.log(`✅ Sucesso! Os resultados iniciais foram salvos em: ${outputPath}`);

    // Etapa 2: Fazer o extract de cada item e adicionar seus links ao JSON final
    console.log(`\nIniciando extração profunda de links (Etapa 2)...`);

    let currentItem;

    // Pega o próximo item da fila que ainda não foi visitado
    while ((currentItem = resp.data.find(item => !item.extracted))) {
      // Se já alcançamos o limite estipulado, encerramos o processo
      if (resp.data.length >= MAX_LINKS) {
        console.log(`\n🛑 Limite de segurança de ${MAX_LINKS} links atingido! Encerrando o crawler.`);
        break;
      }

      console.log(`\nExtraindo links da página: ${currentItem.title}...`);

      try {
        const extractRes = await fetch(`http://localhost:3000/extract?url=${encodeURIComponent(currentItem.url)}`, {
          headers: { "Authorization": `Bearer ${process.env.API_TOKEN}` }
        });

        const extractData = await extractRes.json();

        if (extractRes.ok && extractData.data && extractData.data.links) {
          const pageLinks = extractData.data.links;
          console.log(`-> Encontrados ${pageLinks.length} links! Inserindo no JSON...`);

          // Para cada link encontrado, formatamos e adicionamos ao nosso array principal
          for (const link of pageLinks) {
            // Trava de segurança imediata
            if (resp.data.length >= MAX_LINKS) {
              break;
            }
            
            resp.data.push({
              url: link.url,
              title: link.title,
              content: "",
              thumbnail: "",
              extracted: false // Novos links entram na fila como não visitados!
            });
          }
        } else {
          console.log(`-> Nenhum link extraído ou falha na URL.`);
        }

      } catch (err) {
        console.log(`-> Erro de rede ao tentar extrair: ${err.message}`);
      }

      // Fundamental: marca como visitado para não cair em loop infinito no MESMO item
      currentItem.extracted = true;

      // Atualiza o arquivo em tempo real (checkpoint progressivo)
      fs.writeFileSync(outputPath, JSON.stringify(resp.data, null, 2));
    }

    console.log(`\n🎉 Finalizado! O arquivo agora tem um total de ${resp.data.length} registros e está seguro em: ${outputPath}`);

  } catch (error) {
    console.error("Erro ao fazer a requisição:", error.message);
  }
}

run();