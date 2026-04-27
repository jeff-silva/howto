# Tarefa: Atualização do README Principal

## Objetivo
Você deve atuar como um agente de documentação. Seu objetivo é atualizar o arquivo `README.md` localizado na raiz do repositório para que ele sirva como um índice unificado e descritivo de todos os exemplos de serviços para estudo contidos nas subpastas.

## Instruções de Execução

1. **Escanear Diretórios:** 
   Percorra todas as pastas do diretório raiz. Procure por arquivos `README.md` localizados imediatamente dentro de cada subpasta (padrão `*/README.md`).

2. **Extrair Informações:**
   - Leia o conteúdo de cada `README.md` encontrado.
   - Identifique o nome do serviço (geralmente o título `#` no topo do arquivo).
   - Extraia a breve descrição do serviço (frequentemente contida na seção "O que é...?" ou logo abaixo do título). 
   - Extraia as instruções de como executar o serviço (geralmente sob o título "How to run:", mostrando o comando como `cd ./pasta && yarn dev`).

3. **Filtragem de Serviços:**
   - **MUITO IMPORTANTE:** Se o `README.md` do serviço **não possuir uma descrição/explicação real** (por exemplo, se o texto contiver apenas o comando de execução ou estiver vazio), **IGNORE** este serviço e **NÃO** o adicione ao índice. Só devem aparecer na documentação os serviços que tiverem uma explicação.

4. **Atualizar o README.md Raiz:**
   - Abra o arquivo `README.md` na raiz do projeto (`/README.md`).
   - Atualize a seção chamada `## 📚 Índice de Estudos e Serviços`.
   - Gere uma lista estruturada apenas com os serviços válidos. O formato obrigatório para cada item é:
     - **[Nome do Serviço](./pasta)**: *Breve explicação do que é.*
       - **Como rodar:** `cd ./pasta && yarn dev` (adicione o comando extraído).

5. **Regra de Segurança:**
   - Não apague outras seções ou instruções que já existam no `README.md` raiz. Atualize apenas a área do índice.
