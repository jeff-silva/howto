# Test Boti

Este diretório contém a estrutura e configuração para uma aplicação fullstack em desenvolvimento.

## 🏗️ Arquitetura

O projeto é composto por duas partes principais:

- **Backend:** Desenvolvido utilizando [FastAPI](https://fastapi.tiangolo.com/) (Python). O FastAPI foi escolhido por ser um framework moderno, rápido e focado na construção ágil de APIs RESTful.
- **Frontend:** Desenvolvido utilizando o ecossistema [Node.js](https://nodejs.org/). Ele servirá como base para a construção da interface do usuário que irá interagir com a nossa API.

## 📁 Estrutura do Projeto (Planejada)

A estrutura de diretórios prevista para este projeto seguirá o seguinte padrão:

```text
test-boti/
├── backend/      # Diretório raiz do Backend (Dockerfile, configs, etc)
│   └── src/      # Código fonte da API em FastAPI
├── frontend/     # Diretório raiz do Frontend (Dockerfile, scripts, configs)
│   └── src/      # Código fonte da aplicação React
├── compose.yml   # Configuração para orquestração de containers (Docker Compose)
└── README.md     # Este arquivo de documentação
```

## 🚀 Próximos Passos

Por enquanto estamos apenas preparando o ambiente. Os próximos passos incluirão:

1.  Criação da estrutura e inicialização do projeto backend (`backend/`).
2.  Criação da estrutura e inicialização do projeto frontend (`frontend/`).
3.  Configuração dos serviços no arquivo `compose.yml` para rodar ambos os projetos de forma integrada.
