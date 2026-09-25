import puppeteer from "puppeteer-core"
import dns from "node:dns/promises"

export async function getBrowser() {
  // O Chromium demora uns segundos para iniciar (S6-Overlay, KasmVNC, Openbox, etc).
  // Vamos implementar um sistema de tentativas (retry) para esperar ele ficar pronto.
  let res: Response | null = null;
  let retries = 5;
  
  while (retries > 0) {
    try {
      res = await fetch("http://chromium:9222/json/version", {
        headers: { Host: "127.0.0.1" }
      });
      if (res.ok) break;
    } catch (e) {
      // Ignora o erro e tenta de novo
    }
    retries--;
    if (retries > 0) await new Promise(r => setTimeout(r, 2000)); // Espera 2 segundos
  }

  if (!res || !res.ok) {
    throw new Error("Chromium não está pronto ou não respondeu na porta 9222.");
  }

  const data = await res.json() as { webSocketDebuggerUrl: string }

  // Descobre o IP real do container 'chromium' na rede do Docker
  // O Chromium SEMPRE aceita conexões via IP, mas bloqueia nomes como 'chromium' (DNS Rebinding)
  const { address } = await dns.lookup("chromium")

  const wsUrl = new URL(data.webSocketDebuggerUrl)
  // Troca o localhost devolvido pelo Chromium pelo IP real do container
  wsUrl.host = `${address}:9222`

  return await puppeteer.connect({
    browserWSEndpoint: wsUrl.toString(),
    defaultViewport: { width: 1366, height: 768 },
  })
}
