#!/bin/bash

# ATENÇÃO: ESTE SCRIPT VAI DESTRUIR TUDO DO DOCKER!
# Todos os containers, imagens, volumes e redes serão apagados.

echo "🚨 Iniciando limpeza total do Docker..."

echo "🛑 Parando todos os containers em execução..."
docker stop $(docker ps -a -q) 2>/dev/null

echo "🗑️  Removendo todos os containers..."
docker rm -f $(docker ps -a -q) 2>/dev/null

echo "🧹 Removendo todas as imagens (isso inclui as gigantes de 4GB que baixamos)..."
docker rmi -f $(docker images -a -q) 2>/dev/null

echo "📦 Removendo todos os volumes associados..."
docker volume rm $(docker volume ls -q) 2>/dev/null

echo "🔥 Rodando a limpeza profunda do sistema (redes órfãs, cache de build)..."
docker system prune -a --volumes -f

echo ""
echo "✅ Pronto! O seu ambiente Docker está 100% zerado e limpo!"
