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
│   └── project/  # Diretório do projeto (volume mapeado no Docker)
│       └── app/  # Código fonte da API em FastAPI
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

## 🧱 Modelagem de Domínio (Clean Architecture)

Seguindo os princípios do **Domain-Driven Design (DDD)** e da **Clean Architecture**, o projeto divide suas entidades em arquivos separados por contexto. No backend, a camada mais interna (`domain`) contém nossas classes puras em Python, sem dependências de banco de dados ou frameworks externos.

A estrutura de entidades para o sistema de Catálogo de Filmes ficou assim:

```text
backend/project/app/domain/entities/
├── __init__.py           
├── movie_catalog.py      
└── movie_category.py     
```

### O que é o arquivo `__init__.py` e para que serve?
O arquivo `__init__.py` é um arquivo especial do Python que sinaliza que um diretório deve ser tratado como um **pacote Python** (Package). 

Numa arquitetura limpa de alto nível, ele serve para um propósito muito importante: **Gerenciar as importações públicas do pacote (Encapsulamento)**.

Em vez de obrigar o restante do sistema a conhecer exatamente em qual arquivo cada classe mora, fazendo importações longas:
```python
# Importação "feia" e muito acoplada à estrutura de pastas interna
from src.domain.entities.movie_category import MovieCategory
from src.domain.entities.movie_catalog import MovieCatalog
```

Nós importamos as classes para dentro do `__init__.py` e as exportamos. Assim, qualquer outro arquivo no sistema pode importar de forma muito mais limpa e elegante:
```python
# Importação correta e profissional
from src.domain.entities import MovieCategory, MovieCatalog
```
Isso garante que se um dia precisarmos mover o arquivo `movie_category.py` para dentro de outra sub-pasta, não precisaremos alterar as importações no projeto inteiro; basta atualizar o `__init__.py`.

## 🗄️ Infraestrutura de Banco de Dados e ORM

Na Clean Architecture, o domínio (nossas regras de negócio e entidades) não pode saber que existe um banco de dados. Por isso, isolamos a comunicação com o banco de dados na camada de **Infraestrutura** (`infrastructure`).

### Para que servem os arquivos em `infrastructure/database/models`?
Eles servem exclusivamente para o **ORM (Object-Relational Mapper)**. 

Enquanto as classes em `domain/entities` são classes puras do Python, as classes em `models/` são representações exatas das tabelas do banco de dados relacional. Elas ditam quais são as colunas, tipos de dados (String, Integer, ForeignKey) e os relacionamentos. 

Quando salvamos um filme no sistema:
1. Recebemos e manipulamos a entidade pura (`domain`).
2. O repositório pega essa entidade e converte no modelo (`model`).
3. O modelo é entregue ao ORM, que traduz essa classe em uma query SQL (`INSERT INTO...`) e salva no banco de dados.

### Qual é o nosso ORM?
O ORM que estamos utilizando é o **SQLAlchemy 2.0**. 

Ele é absoluto padrão da indústria para aplicações empresariais e de alto nível em Python/FastAPI. A versão 2.0 trouxe suporte nativo a **programação assíncrona** e uma tipagem rigorosa (usando `Mapped` e `mapped_column`), o que nos dá autocompletar perfeito e previne erros antes mesmo de rodarmos o código.
