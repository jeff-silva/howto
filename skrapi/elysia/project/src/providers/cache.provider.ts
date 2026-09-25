import { mkdir } from "node:fs/promises"
import { join } from "node:path"

const CACHE_DIR = join(process.cwd(), ".cache")

// Garante que a pasta existe quando o sistema iniciar
await mkdir(CACHE_DIR, { recursive: true })

export async function getOrSetFileCache<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  // Transforma a URL num nome de arquivo seguro
  const safeKey = Buffer.from(key).toString("base64url")
  const cachePath = join(CACHE_DIR, `${safeKey}.json`)

  try {
    const file = Bun.file(cachePath)
    if (await file.exists()) {
      const stat = await file.stat()
      // Se o arquivo existir e ainda estiver dentro do tempo de vida (TTL), retornamos ele!
      if (Date.now() - stat.mtimeMs < ttlMs) {
        return await file.json() as T
      }
    }
  }
  catch (e) {
    // Se der erro ao ler, ignoramos e geramos um novo
  }

  // Se não tem cache válido, chamamos a função pesada (Browser)
  const data = await fetcher()
  
  // Salva no arquivo para as próximas vezes
  await Bun.write(cachePath, JSON.stringify(data))
  
  return data
}
