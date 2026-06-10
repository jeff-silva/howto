# Docker Compose

## 🛒 Arquitetura de Serviços Reutilizáveis (Docker Compose Includes)

Este documento explica como funciona a nossa estrutura de "supermercado de serviços". Utilizamos o recurso nativo `include` do Docker Compose para herdar configurações base de uma pasta centralizada e sobrescrever propriedades específicas (como volumes e variáveis) para cada ambiente.

---

### 📂 Estrutura de Pastas

```text
├── services/
│   └── azuracast/
│       └── compose.yml      # Base padrão (A prateleira)
└── radio_home/
    └── compose.yml          # Customização local (O carrinho)
```

---

### 🛠️ Configuração Prática

#### 1. O Serviço Base (A Prateleira)

Este arquivo contém a configuração genérica e mínima para o serviço funcionar.

```yaml
# services/azuracast/compose.yml

services:
  azuracast_radio:
    image: azuracast/azuracast:latest
    ports:
      - "80:80"
    volumes:
      - ./default_media:/var/azuracast/media
```

#### 2. O Serviço Customizado (A Instanciação)

Este arquivo importa a base através do `include` e aplica as mudanças necessárias (Merge/Override) usando o mesmo nome do serviço.

```yaml
# radio_home/compose.yml

include:
  - path: ../services/azuracast/compose.yml

services:
  # Mesmíssimo nome para aplicar o override
  azuracast_radio:
    volumes:
      # Sobrescreve o volume padrão
      - /meu/hd/externo/musicas:/var/azuracast/media
    # Adiciona nova configuração
    environment:
      - STATION_NAME=Radio_De_Casa
```

---

### 🚀 Como Executar

Para rodar a versão customizada, você não precisa mexer na pasta global de serviços. Basta entrar na pasta do seu ambiente específico e rodar o comando padrão:

```bash
cd radio_home
docker compose up -d
```

O Docker Compose vai ler o arquivo local, buscar a referência no `include`, mesclar as configurações na memória e subir o container com o seu volume customizado.

---

### 💡 Vantagens desta Abordagem

- **Zero Duplicação:** Atualizações na imagem base ou portas padrões no arquivo central refletem em todas as rádios automaticamente.
- **Isolamento:** Cada ambiente (casa, cliente X, homologação) altera apenas o que precisa no seu próprio arquivo.
- **Organização:** Facilidade extrema para adicionar novos serviços ao ecossistema.

---

## 🛠️ Comandos Básicos do Docker Compose

```bash
# Abre a configuração do arquivo compose.yml da pasta e suas configs herdadas
docker compose config
```
