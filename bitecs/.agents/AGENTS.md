# Regras e Contexto do Projeto (bitECS + Three.js)

Este arquivo serve como contexto base para qualquer Inteligência Artificial que for interagir com o código desta pasta (`bitecs`). Leia atentamente as regras e decisões arquiteturais descritas aqui antes de propor ou alterar código.

## 1. Stack Tecnológico
- **Engine ECS:** `bitecs` (usado para gerenciamento de Entidades e Componentes, otimizado para arrays tipados).
- **Engine de Renderização:** `three.js` (para toda a parte gráfica e cena 3D).
- **Linguagem:** TypeScript.
- **Bundler:** Vite (configurado para fazer o output do build na pasta padrão `dist`).
- **Ambiente de Desenvolvimento:** Docker e Docker Compose.

## 2. Padrões de Código e Aprendizados (bitECS + TypeScript)

### Definição de Componentes
Sempre utilize o `defineComponent` exportado pelo `bitecs` associado com a enumeração `Types` na hora de declarar um componente.
**NUNCA** crie dicionários puros com strings (ex: `{ x: 'f32' }`), pois o TypeScript reclamará de incompatibilidade de tipos (`Type 'number' is not assignable to type 'string'`) ao tentar atribuir valores às propriedades.

**Padrão Correto:**
```typescript
import { defineComponent, Types } from 'bitecs';

export const Position = defineComponent({
  x: Types.f32,
  y: Types.f32,
  z: Types.f32
});
```

### Inicialização e Instanciação
- Lembre-se de importar o `three.js` da forma correta no TypeScript: `import * as THREE from 'three';`
- As entidades criadas no bitECS retornam um ID numérico. Use esse ID para indexar arrays tipados.
- Ao mapear posições do ECS para o Three.js, sempre forneça um fallback caso a leitura venha undefined ou para lidar com estritos do Typescript (ex: `Position.x[eid] || 0`).

## 3. Ambiente Docker e Comandos

O projeto foi construído focado no isolamento de ambiente. O hot-reload está ativado e funcionando integrado ao Vite pelo Docker.

- **Para iniciar o ambiente:** Execute `sh dev.sh` (ou `docker compose up -d --build`). O servidor ficará exposto na porta local `5173`. O script `dev.sh` garante que a execução ocorra do diretório correto.
- **Para gerar uma build de produção:** NÃO rode `npm run build` na sua máquina hospedeira. Execute sempre DENTRO do container via: `docker compose exec app npm run build`.
- **Instalação de Pacotes:** Sempre instale pacotes dentro do ambiente docker para garantir paridade (ex: `docker compose exec app npm install nome_do_pacote`).
- O volume está mapeado do repositório local `./` para `/app` no Docker. A variável `CHOKIDAR_USEPOLLING=true` está ativada no `compose.yml` para garantir que as alterações no sistema de arquivos local notifiquem o watcher do Vite pelo Docker.

## 4. Regras Gerais de Estilo
- **Sem Comentários:** NÃO adicione comentários (seja `//` ou `/* */`) nos arquivos de código do projeto. O código deve ser autoexplicativo, visando reduzir a poluição visual. Qualquer documentação ou contexto deve ser adicionada a arquivos Markdown apropriados, como este `AGENTS.md`.
- **Nomenclatura de Arquivos e Exports:** Todos os arquivos de domínios específicos e seus respectivos exports principais devem incluir sufixos correspondentes:
  - `entities/*`: sufixo `Entity` (ex: `CubeEntity.ts`, `createCubeEntity`).
  - `components/*`: sufixo `Component` (ex: `PositionComponent.ts`, `PositionComponent`).
  - `engine/*`: sufixo `Engine` (ex: `GraphicsEngine.ts`, `PhysicsEngine.ts`).

## 5. Integração RapierJS e bitECS
- **NÃO use componentes ECS para armazenar Handles do RapierJS:** Os "handles" do RapierJS podem virar números float subnormais no Javascript (como `5e-324`). Se você tentar guardar esse handle em um array tipado do bitECS (como `Types.ui32`), ele será convertido incorretamente (ex: virando `0`), o que fará as entidades misturarem corpos físicos. Sempre crie um `Map<number, RAPIER.RigidBody>` externo (como `bodyMap`) para vincular o ID da Entidade (bitECS) diretamente ao objeto RigidBody da engine de física.
