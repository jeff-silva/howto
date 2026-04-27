# Tarefa: Padronização e Atualização das Documentações

## Objetivo
Você deve atuar como um agente focado em padronização e documentação técnica. Seu objetivo é garantir que todas as documentações secundárias (os `README.md` dentro de cada subpasta de serviço) sigam uma mesma estrutura. Após padronizá-las, você deve utilizar essas informações para gerar um índice unificado no `README.md` da raiz.

## 1. Padronização das Documentações Secundárias (`*/README.md`)
Percorra todas as subpastas do repositório. Para cada serviço que contiver alguma explicação/descrição técnica, certifique-se de que o arquivo `README.md` dessa pasta obedeça **exatamente** a este template estrutural:

```markdown
# [Nome do Serviço]

**Site Oficial:** [URL](URL) *(apenas se houver/for aplicável)*

## O que é?
[Explicação clara e breve de 1 a 3 frases sobre o serviço].

How to run:

```bash
cd ./pasta_do_servico && npm run dev
```
```

*Regras para as documentações secundárias:*
- Se o `README.md` não contiver uma explicação do serviço (ou estiver vazio), ignore a pasta e não a modifique.
- Se já existir explicação, mas estiver formatada de outra forma, reestruture o arquivo para se encaixar no template acima (ajustando a posição do site oficial, o título "## O que é?" e os comandos de execução).

## 2. Atualização do README Principal (`/README.md`)
Após garantir a padronização das subpastas, você deve ler as informações e injetá-las no `README.md` da raiz.

1. Localize a seção `## 📚 Índice de Estudos e Serviços`.
2. Para cada serviço que possui uma explicação válida, adicione um bloco com cabeçalho `H3 (###)`. O formato obrigatório é:

```markdown
### [Nome do Serviço](./pasta_do_servico)

[Explicação extraída da seção "## O que é?" do README secundário].

- **Como rodar:** `cd ./pasta_do_servico && npm run dev`
- **Site Oficial:** [URL](URL) *(adicionar apenas se a linha existir no README secundário)*

---
```

## Regras de Segurança
- Serviços **sem explicação** nos seus READMEs secundários devem ser totalmente ignorados e não aparecerão no índice raiz.
- No `README.md` raiz, **não apague** outras seções (como o título principal "# HowTo" ou tutoriais extras). Substitua unicamente o bloco abaixo de `## 📚 Índice de Estudos e Serviços`.
