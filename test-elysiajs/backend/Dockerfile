# Usamos a imagem oficial do Bun, que é extremamente leve e rápida
FROM oven/bun:1

WORKDIR /app

# Copia os arquivos de configuração do Bun/NPM
COPY project/package.json ./
# COPY project/bun.lockb ./ # Descomente se for commitar o lockfile do bun

# Instala as dependências via bun
RUN bun install

# Copia o restante do projeto
COPY project/ .

# Expõe a porta padrão do Elysia
EXPOSE 3000

# O comando de inicialização padrão (pode ser sobrescrito pelo compose)
CMD ["bun", "run", "src/index.ts"]
