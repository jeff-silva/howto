# Tarefa: Sincronização e Padronização das Documentações

## Objetivo
Você deve atuar como um agente focado em padronização e documentação técnica. Seu objetivo principal é **sincronizar** as documentações: garantir que os `README.md` de cada subpasta sigam um padrão rigoroso e, em seguida, reconstruir completamente o índice do `README.md` da raiz para espelhar EXATAMENTE o estado atual do repositório (inserindo novidades e removendo serviços inexistentes).

## 1. Padronização das Documentações Secundárias (`*/README.md`)
Percorra todas as subpastas do repositório verificando os arquivos `README.md`. Para cada serviço que contiver alguma explicação/descrição técnica, certifique-se de que o arquivo obedeça **exatamente** a este template estrutural:

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
- Se já existir explicação, mas estiver fora do padrão, reestruture o arquivo para se encaixar no template acima.

## 2. Sincronização do README Principal (`/README.md`)
A sincronização significa que o índice principal não deve acumular lixo. Ele deve refletir **apenas pastas que existem no momento** e que possuem um `README.md` válido.

1. Abra o arquivo raiz `/README.md`.
2. Localize a seção `## 📚 Índice de Estudos e Serviços`.
3. **Apague o conteúdo antigo desse índice** e reconstrua a listagem do zero. Para cada serviço válido encontrado agora, adicione um bloco `H3 (###)`:

```markdown
### [Nome do Serviço](./pasta_do_servico)

[Explicação extraída da seção "## O que é?" do README secundário].

- **Como rodar:** `cd ./pasta_do_servico && npm run dev`
- **Site Oficial:** [URL](URL) *(adicionar apenas se a linha existir no README secundário)*

---
```

## Regras de Sincronização e Segurança
- **Remoção (Limpeza):** Se uma pasta (ex: `wwebjs`) foi apagada ou perdeu seu README explicativo, ela **não deve** constar no novo índice gerado. O ato de reconstruir a lista do zero garante que serviços mortos desapareçam automaticamente.
- No `README.md` raiz, **não apague** outras seções (como o título principal "# HowTo"). Substitua unicamente tudo o que estiver listado sob `## 📚 Índice de Estudos e Serviços`.
