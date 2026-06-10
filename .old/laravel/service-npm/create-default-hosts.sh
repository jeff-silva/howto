#!/bin/sh

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)

echo "Autenticando no Nginx Proxy Manager..."
token=$(curl -s -X POST http://localhost:81/api/tokens \
  -H "Content-Type: application/json" \
  -d '{"identity": "main@grr.la", "secret": "main@grr.la"}' | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$token" ]; then
    echo "Erro: Não foi possível obter o token de acesso. Verifique se o container está rodando e se as credenciais estão corretas."
    exit 1
fi

echo "Autenticado com sucesso!\n"

create_host() {
    local domain="$1"
    local forward_host="$2"
    local forward_port="$3"

    # 1. Buscar a lista de hosts cadastrados atualmente
    hosts_json=$(curl -s -X GET http://localhost:81/api/nginx/proxy-hosts \
      -H "Authorization: Bearer $token")

    # 2. Usar o Node.js (que já está instalado no sistema) para localizar o ID se o domínio existir
    existing_id=$(node -e "
      try {
        const data = JSON.parse(process.argv[1] || '[]');
        const match = data.find(h => h.domain_names && h.domain_names.includes(process.argv[2]));
        if (match) console.log(match.id);
      } catch (e) {}
    " "$hosts_json" "$domain")

    # 3. Definir método HTTP e URL com base na existência do ID (UPSERT)
    if [ -n "$existing_id" ]; then
        echo "Criando/Atualizando host: $domain (ID: $existing_id) -> http://$forward_host:$forward_port..."
        method="PUT"
        url="http://localhost:81/api/nginx/proxy-hosts/$existing_id"
    else
        echo "Criando/Atualizando host: $domain -> http://$forward_host:$forward_port..."
        method="POST"
        url="http://localhost:81/api/nginx/proxy-hosts"
    fi
    
    # 4. Executar requisição de Criação ou Atualização
    response=$(curl -s -X $method "$url" \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      -d "{
        \"domain_names\": [\"$domain\"],
        \"forward_scheme\": \"http\",
        \"forward_host\": \"$forward_host\",
        \"forward_port\": $forward_port,
        \"caching_enabled\": false,
        \"block_exploits\": true,
        \"allow_websocket_upgrade\": true,
        \"access_list_id\": 0,
        \"certificate_id\": 0,
        \"ssl_forced\": false,
        \"meta\": {
          \"letsencrypt_agree\": false,
          \"dns_challenge\": false
        },
        \"advanced_config\": \"\"
      }")

    # 5. Verificar se retornou erro ou sucesso
    if echo "$response" | grep -q '"id"'; then
        local id=$(echo "$response" | grep -o '"id":[0-9]*' | cut -d ':' -f2)
        echo "✓ Host processado com sucesso ($method)! ID: $id"
    else
        echo "❌ Erro ao processar host para $domain. Resposta do servidor:"
        echo "$response"
    fi
    echo ""
}

# # Criar hosts padrões definidos no README.md
# create_host "capp.localhost" "service-app" 80
# create_host "npm.capp.localhost" "service-npm" 81
# create_host "supabase.capp.localhost" "kong" 8000
# create_host "front.capp.localhost" "service-front" 3000
# create_host "waha.capp.localhost" "service-waha" 3000