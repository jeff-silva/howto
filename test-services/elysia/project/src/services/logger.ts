import { appendFile, writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// Caminho absoluto para a pasta logs na raiz do projeto
const LOG_DIR = path.join(process.cwd(), "src", "logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

// Garante que a pasta existe
if (!existsSync(LOG_DIR)) {
  import("node:fs").then(fs => fs.mkdirSync(LOG_DIR, { recursive: true }));
}

const formatMessage = (level: string, msg: any) => {
  const timestamp = new Date().toISOString();
  const text = typeof msg === "object" ? JSON.stringify(msg, null, 2) : String(msg);
  return `[${timestamp}] [${level}] ${text}\n`;
};

export const Logger = {
  /**
   * Escreve no final do arquivo (Append).
   * É a forma mais rápida e padrão para logs.
   */
  async append(message: any, level = "INFO") {
    const logLine = formatMessage(level, message);
    console.log(logLine.trim()); // Opcional: printar no console também
    await appendFile(LOG_FILE, logLine, "utf-8");
  },

  /**
   * Insere no começo do arquivo (Prepend).
   * Nota: Arquivos são lidos de forma sequencial, então para inserir no começo,
   * precisamos ler o conteúdo todo e reescrever. Use com moderação em logs gigantes.
   */
  async prepend(message: any, level = "INFO") {
    const logLine = formatMessage(level, message);
    console.log(logLine.trim());
    
    let currentContent = "";
    if (existsSync(LOG_FILE)) {
      currentContent = await readFile(LOG_FILE, "utf-8");
    }
    
    await writeFile(LOG_FILE, logLine + currentContent, "utf-8");
  },

  /**
   * Limpa todo o conteúdo do arquivo de log.
   */
  async clear() {
    await writeFile(LOG_FILE, "", "utf-8");
    console.log("🧹 Arquivo de log limpo.");
  },

  // Atalhos úteis
  info: (msg: any) => Logger.append(msg, "INFO"),
  error: (msg: any) => Logger.append(msg, "ERROR"),
  warn: (msg: any) => Logger.append(msg, "WARN"),

  appendData: (msg: any, data: any) => {
    if (typeof data == 'string') data = JSON.parse(data);
    return Logger.append(msg + "\n" + JSON.stringify(data, null, 2), "WARN");
  },
};
