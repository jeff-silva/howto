# CI/CD: Guia Básico e Introdutório

**CI/CD** é uma prática fundamental no desenvolvimento de software moderno que visa automatizar e agilizar a entrega de código, desde a sua escrita até a implantação em produção. A sigla significa **Continuous Integration** (Integração Contínua) e **Continuous Delivery/Deployment** (Entrega/Implantação Contínua).

---

## 🛠️ CI: Integração Contínua (Continuous Integration)

O objetivo da CI é automatizar a integração de código vindo de vários desenvolvedores em um único repositório centralizado de forma frequente.

* **Como funciona:** Toda vez que um desenvolvedor envia (faz *commit* e *push*) uma alteração de código para o repositório, um processo automático é acionado.
* **Principais etapas:**
  1. **Build (Construção):** O código é compilado e as dependências são instaladas.
  2. **Testes:** Testes automatizados (como testes unitários) rodam para garantir que as novas alterações não quebraram o código que já estava funcionando.
* **Maior Vantagem:** Detectar e corrigir bugs rapidamente. O código defeituoso não chega a se misturar permanentemente com o código saudável.

---

## 🚀 CD: Entrega e Implantação Contínua

A etapa de CD pega o código que já passou pela CI (ou seja, foi integrado e testado com sucesso) e o envia para os ambientes de uso (como Homologação ou Produção). O "CD" pode significar duas coisas:

### 1. Continuous Delivery (Entrega Contínua)
O código é validado, empacotado e fica **pronto para ser implantado** em produção a qualquer momento. No entanto, o ato de colocar em produção requer uma aprovação ou o clique de um botão **manual** por parte de um responsável.

### 2. Continuous Deployment (Implantação Contínua)
É a automação total. Se o código passar por todos os testes na etapa de CI, ele é **automaticamente** implantado no ambiente de produção, sem qualquer intervenção humana.

---

## 🔄 Resumo do Fluxo (Pipeline)

1. **Código:** O desenvolvedor escreve a nova funcionalidade e envia para o Git.
2. **Integração (CI):** O servidor (ex: GitHub Actions, Jenkins, GitLab CI) constrói a aplicação e roda os testes.
3. **Entrega/Implantação (CD):** O servidor empacota a aplicação e a implantação é feita no servidor final.
## 🧰 Ferramentas Mais Utilizadas no Mercado

Hoje em dia, existem plataformas poderosas que já orquestram todo esse fluxo de CI/CD. As mais conhecidas são:

1. **GitHub Actions:** Extremamente popular por já estar embutido nativamente no GitHub. Você cria as regras (workflows) usando arquivos YAML direto no seu repositório.
2. **GitLab CI/CD:** Vem integrado ao GitLab. É muito aclamado pela comunidade por ser nativo, completo e ter uma interface excelente para visualizar as etapas.
3. **Jenkins:** O "vovô" do CI/CD. É open-source, robusto e extremamente customizável (tem milhares de plugins). A desvantagem é que você precisa instalar e manter o seu próprio servidor Jenkins.
4. **CircleCI:** Focado em velocidade e alta performance. É muito comum em empresas que precisam rodar baterias de testes muito pesadas rapidamente.
5. **Bitbucket Pipelines:** A solução nativa do ecossistema Atlassian (Jira, Bitbucket).
6. **Azure DevOps / AWS CodePipeline:** Soluções corporativas nativas dos provedores de nuvem (Microsoft e Amazon, respectivamente).

---

## 🌟 Por que isso é importante?
* **Lançamentos mais rápidos:** Automatiza tarefas repetitivas.
* **Qualidade:** Evita que falhas bobas cheguem ao usuário final devido à extensa bateria de testes automáticos.
* **Feedback rápido:** O desenvolvedor sabe em poucos minutos se o que ele acabou de fazer causou algum erro.
