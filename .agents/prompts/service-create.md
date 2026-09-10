# Tarefa: Criação de Novo Serviço (Scaffold)

## Objetivo
Você deve atuar como um assistente especializado em infraestrutura (Docker) e padronização. Seu papel é estruturar rapidamente uma nova pasta de serviço dentro do repositório, garantindo que todos os arquivos necessários de inicialização e documentação sigam o padrão exato dos serviços já existentes (usando o serviço `ardour` como referência principal).

## Fluxo de Execução

### Passo 1: Interação Inicial (Coleta de Dados)
A primeira coisa que você **obrigatoriamente** deve fazer ao rodar este prompt é perguntar ao usuário:
1. Qual será o **nome da pasta** do novo serviço?
2. Qual (ou quais) **serviços Docker** devem estar configurados no `compose.yml`? (Se o usuário tiver um Docker run ou detalhes de portas/volumes, peça para ele enviar).

**PARE AQUI. Não crie nada até que o usuário responda com essas informações.**

---

### Passo 2: Construção da Estrutura
Assim que o usuário fornecer os detalhes, crie a nova pasta na raiz do projeto (`/nome-da-pasta`). Dentro dela, você deve criar **quatro arquivos obrigatórios**:

#### 1. `compose.yml`
Crie a orquestração Docker configurando os serviços solicitados.
*Importante:* Sempre mapeie os volumes para diretórios locais dentro da própria pasta do serviço (ex: `- ./config:/config` ou `- ./data:/var/lib/mysql`).

#### 2. `package.json`
Crie este arquivo para padronizar o comando de start. Use este exato formato (substituindo o nome):
```json
{
  "name": "<nome-da-pasta>",
  "version": "1.0.0",
  "license": "MIT",
  "scripts": {
    "dev": "docker compose up --build --force-recreate --remove-orphans"
  }
}
```

#### 3. `.gitignore`
Verifique os volumes mapeados no `compose.yml`. Todas as pastas criadas localmente para persistir dados (como `config/`, `data/`, `db/`) devem ser adicionadas aqui para não poluir o repositório do Git. Exemplo:
```text
config/
data/
```

#### 4. `README.md`
Crie a documentação secundária seguindo **estritamente** o template padrão de sincronização do repositório:
```markdown
# <nome-do-serviço>

**Site Oficial:** [URL](URL) *(pesquise e insira o site oficial do serviço, se aplicável)*

## O que é?
[Escreva uma explicação técnica clara e concisa (de 1 a 3 frases) explicando o que este serviço é e qual problema ele resolve.]

How to run:

```bash
cd ./<nome-da-pasta> && npm run dev
```
```

---

### Passo 3: Sincronização Automática e Finalização
Após utilizar suas ferramentas para gravar todos os arquivos no disco, você **obrigatoriamente** deve ler e executar as instruções do arquivo `.ai/prompts/readme-sync.md`. 

O objetivo disso é acionar a sincronização em cadeia, fazendo com que o novo serviço que você acabou de criar seja imediatamente lido e injetado de forma padronizada no índice do `README.md` principal da raiz.

Após concluir o processo de criação e a sincronização do README, avise ao usuário que tudo está pronto!
