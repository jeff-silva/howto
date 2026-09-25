const puppeteer = require('puppeteer-core');

(async () => {
  const SEARCH_TERM = `aluguel centro belo horizonte`;

  try {
    console.log('Conectando ao navegador rodando no Docker...');
    
    // Conecta usando a porta 9222 que configuramos no Docker
    const browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: null // Mantém a resolução do VNC
    });

    console.log('Conectado! Abrindo aba do Google...');
    const page = await browser.newPage();
    
    // Forçar resolução de desktop e User-Agent de desktop
    // Isso impede o Google de retornar a versão mobile/lite que esconde as URLs reais
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto('https://www.google.com.br', { waitUntil: 'networkidle2' });
    
    console.log(`Digitando "${SEARCH_TERM}"...`);
    // O campo de busca do Google (textarea ou input com name="q")
    await page.type('textarea[name="q"], input[name="q"]', SEARCH_TERM, { delay: 100 });
    
    console.log('Apertando Enter...');
    await page.keyboard.press('Enter');
    
    // Aguarda o resultado carregar
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    console.log('Extraindo todos os links da página...');
    const links = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('a'));
      
      return elements.map(a => ({
        url: a.href,
        text: a.innerText.trim()
      })).filter(link => link.url && link.text && link.url.startsWith('https://www.google.com/goto')); // Foca nos resultados
    });
    
    console.log(`Encontrados ${links.length} resultados. Descobrindo URLs originais...`);
    
    // O Node.js 20 (que estamos usando) tem fetch() nativo.
    // Vamos fazer uma requisição para cada link do /goto sem seguir o redirecionamento,
    // apenas para ler o cabeçalho "Location" que contém a URL real!
    for (const link of links) {
      try {
        const res = await fetch(link.url, { redirect: 'manual' });
        if (res.status >= 300 && res.status < 400) {
          link.url = res.headers.get('location') || link.url;
        }
      } catch (e) {
        // Se falhar, mantém a url original do google
      }
    }
    
    console.log('Lista de links reais extraídos:');
    console.log(JSON.stringify(links, null, 2));
    
    console.log('\nPesquisa concluída! Fechando a aba...');
    
    // Fecha a aba que foi aberta
    await page.close();
    
    // Desconecta o script
    await browser.disconnect();
  } catch (err) {
    console.error('Erro no script:', err);
  }
})();
