# RabbitMQ

Executando:

```bash
# Modo desenvolvimento
BUN_CMD=dev docker compose up -d --build --remove-orphans

# Modo produção
BUN_CMD=start docker compose up -d --build --remove-orphans
```

Executando em modo de produção:

```bash
BUN_CMD=start docker compose up -d --build --remove-orphans
```

Incluindo no compose.yml global

```yml
networks:
  default:
    name: main_network

include:
  - ./rabbitmq/compose.yml
```
