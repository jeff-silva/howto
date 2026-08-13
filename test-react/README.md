# StudyHub (Gestor de Cursos & Anotações)

Este é um projeto de teste (CRUD completo) criado para praticar e dominar os conceitos fundamentais e intermediários do React. O aplicativo permite cadastrar cursos em andamento, acompanhar o progresso das aulas e fazer anotações em tempo real.

## 🛠️ Conceitos Praticados no React

### 1. Form de Cadastro & Filtros (`useState`)
- **Aplicação:** Formulário para cadastrar novos cursos (Nome, Categoria, Total de Aulas) e filtros para buscar por categoria ("Em andamento", "Concluídos").
- **Conceito praticado:** Manipulação de formulários, estados complexos (arrays de objetos) e manipulação imutável do estado.

### 2. Persistência & API Externa (`useEffect`)
- **Aplicação:**
  - Salvar e ler os cursos no `localStorage` do navegador para manter os dados após recarregar a página.
  - Buscar citações motivacionais aleatórias em uma API pública para exibir no topo da tela.
- **Conceito praticado:** Ciclo de vida, efeitos colaterais, chamadas assíncronas com `fetch`/`axios` e tratamento de loading/error.

### 3. Timer de Foco Pomodoro & Foco do Teclado (`useRef`)
- **Aplicação:**
  - Um cronômetro Pomodoro de 25 minutos para estudo. O `useRef` guarda a referência do `setInterval` para iniciar/pausar o tempo sem perder o estado.
  - Focar automaticamente no campo de "Anotações" quando o timer iniciar.
- **Conceito praticado:** Manipulação do DOM e persistência de valores mutáveis sem disparar re-render.

### 4. Tema Global & Estatísticas (`useContext`)
- **Aplicação:** Um `UserContext` ou `ThemeContext` que guarda as preferências do usuário (Dark/Light mode e nome do aluno) acessíveis em qualquer tela.
- **Conceito praticado:** Provedores de contexto (`Provider`), compartilhamento global de dados e prevenção de prop drilling.

### 5. Cálculo do Progresso Geral (`useMemo`)
- **Aplicação:** Calcular a porcentagem total de conclusão de todos os cursos combinados (ex: "45% de todas as aulas concluídas").
- **Conceito praticado:** Evitar recálculos pesados a cada digitação no formulário, recalculando apenas quando a lista de cursos mudar.

### 6. Custom Hooks (Abstração)
- **Aplicação:** Extrair a lógica do localStorage para um hook `useLocalStorage('cursos', [])` e o cronômetro para um hook `usePomodoro()`.
- **Conceito praticado:** Reutilização e separação clara entre regra de negócio e componentes visuais.

## 🚀 Objetivo
Garantir o domínio das APIs fundamentais (Hooks) da biblioteca React em uma aplicação com utilidade real para a rotina de estudos.

## 📁 Estrutura do Projeto

Conforme definido, o projeto utilizará **Next.js** rodando sobre **Docker**. A estrutura foi pensada para manter as configurações de infraestrutura na raiz e o código da aplicação isolado:

```text
test-react/
├── compose.yml        # Configuração do Docker Compose para o ambiente de dev
├── README.md          # Documentação do projeto
└── next/              # Aplicação Next.js
    ├── src/
    │   ├── app/       # Rotas, páginas e layouts (App Router)
    │   ├── components/# Componentes reutilizáveis (Forms, Timer, Cards)
    │   ├── hooks/     # Custom hooks (usePomodoro, useLocalStorage)
    │   └── contexts/  # Providers e Contextos Globais
    ├── package.json   # Dependências do front-end
    └── next.config.js # Configurações do Next.js
```
