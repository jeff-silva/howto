# Cola: Desafios de Arquitetura e Backend (Pleno/Sênior)

## 1. Testes: Unitário vs Integração

- **Pergunta:** Se eu testar um endpoint mas com banco de dados mockado, o que é?
- **Resposta:** **Teste Unitário**. Como não há IO real de banco de dados e as dependências estão sendo simuladas (mock/stub), a unidade lógica está sendo testada de forma isolada. Teste de integração envolveria o banco de dados real.

## 2. Resiliência: Integração com API Externa

- **Cenário:** Buscar dados numa API externa que é lenta ou cai, sem quebrar o cadastro principal.
- **Resposta Síncrona:** Criar chamada com `timeout` curto (ex: 3 segundos) dentro de um bloco `try/catch`. Se der erro (timeout ou 500), ignora silenciosamente e continua o fluxo de salvar no banco de dados.
- **Resposta Assíncrona (Ouro):** Salvar o registro, pegar o ID e mandar para uma fila (**RabbitMQ / SQS / Redis**). Processar em background (Worker).
- **Tratamento de Falhas (Fila):** Usar **Exponential Backoff** (tentar em 2s, 4s, 8s...). Se falhar X vezes seguidas, a mensagem vai para a **DLQ (Dead Letter Queue)**.
- **DLQ:** Fila "cemitério". As mensagens ficam salvas lá para você analisar o erro depois. Após corrigir o bug, você faz um **Redrive** (joga as mensagens da DLQ de volta pra fila principal).

## 3. Concorrência: Condição de Corrida (Race Condition)

- **Cenário:** Duas pessoas tentam alugar o último filme do estoque exatamento no mesmo milissegundo. Como evitar que o estoque fique negativo?
- **Solução 1 - Atômica/Otimista (Melhor Performance):** Fazer o cálculo de subtração direto no banco de dados com uma condição na query. `UPDATE catalog SET stock = stock - 1 WHERE id = 1 AND stock > 0;`. O banco garante que isso é atômico.
- **Solução 2 - Lock Pessimista (Para regras complexas):** Fazer um `SELECT FOR UPDATE` (no SQLAlchemy: `with_for_update()`). Isso "tranca" a linha no banco. A requisição B fica esperando a A terminar antes de poder ler aquele registro.

## 4. Performance ORM: O Problema do N+1

- **Cenário:** Listar 1000 filmes e exibir o nome da Categoria de cada um. O banco bate 100% de CPU. O que houve?
- **Problema (N+1):** O ORM faz 1 query para buscar os filmes, e depois (dentro do loop) faz N queries (1000 queries) para buscar o nome da categoria de cada filme individualmente.
- **Solução (Relacionamentos N para 1):** Usar **`joinedload`**. Isso faz o ORM usar um `LEFT OUTER JOIN` no banco de dados, trazendo tudo em apenas 1 query.
- **Solução (Relacionamentos 1 para N ou Listas):** Usar **`selectinload`**. Isso faz o ORM trazer os pais numa query, e depois buscar todos os filhos em uma segunda query unificada usando `SELECT ... WHERE parent_id IN (...)`. Otimizado para não estourar a memória.

## 5. Front-End: Desafios Típicos para Full Stack (React)

- **Gerenciamento de Estado e Ciclo de Vida:** Como você evita re-renderizações desnecessárias? (Uso correto de `useMemo`, `useCallback` e `React.memo`).
- **Debounce em Buscas:** Nunca disparar a requisição de `search` a cada tecla digitada (keypress). É obrigatório implementar um **Debounce** (ex: esperar 500ms após o usuário parar de digitar para chamar a API).
- **Acessibilidade (A11y) e Semântica:** E-commerces levam isso a sério. O seu componente precisa ser navegável por teclado (`tabindex`) e ter HTML semântico.
- **Tratamento de Estado de UI:** A interface deve refletir claramente os 3 estados da chamada de rede: `Loading`, `Error` (com retry), e `Success` (com os dados).

## 6. Banco de Dados: Modelagem e Performance

- **Problema:** Select muito lento por e-mail numa tabela de 5 milhões de usuários.
- **Solução:** Criar um **Índice (Index)** na coluna `email`.
- **Trade-off (O lado ruim):** Cada índice adicional deixa a escrita (`INSERT`/`UPDATE`) mais lenta e consome mais espaço em disco.

## 7. Segurança de APIs: Armazenamento de JWT

- **Problema:** Onde salvar o JWT no Frontend?
- **Solução de Ouro:** Salvar em um **Cookie HttpOnly, Secure e SameSite (Lax/Strict)**.
- **Por que não LocalStorage?** Porque o LocalStorage é vulnerável a ataques de **XSS** (Cross-Site Scripting).
- **Alternativa:** Salvar em memória (variável do JS/React).

## 8. Front-End / SEO: O problema das SPAs

- **Problema:** Site rápido em React/Vue, mas invisível no Google.
- **Causa:** SPAs entregam uma `<div>` vazia do servidor, e os robôs do Google (crawlers) têm dificuldade para indexar JS.
- **Solução:** Utilizar **SSR (Server-Side Rendering)** com ferramentas como Next.js ou Nuxt.js.

## 9. Boas Práticas HTTP REST

- **Problema:** Atualizar apenas o status de um pedido.
- **Solução:** Verbo **PATCH**.
- **Diferença:** O `PATCH` é para atualizações parciais. O `PUT` serve para sobrescrever o recurso inteiro.

## 10. Front-End: Otimização de Imagens

- **Problema:** Tela cheia de banners pesados demorando 5 segundos para carregar.
- **Solução 1:** Usar **Lazy Loading** (`loading="lazy"` na tag `<img>`). Isso faz o navegador só baixar as imagens que estão aparecendo na tela, poupando a internet do usuário no carregamento inicial.
- **Solução 2:** Converter formatos pesados (JPEG/PNG) para **WebP**, que são infinitamente mais leves.
- **Solução Extra:** Servir as imagens via **CDN** (Content Delivery Network).

## 11. Testes Automatizados: Mocks vs Stubs

- **Problema:** Qual a diferença teórica entre eles?
- **Stub:** Fornece respostas "enlatadas" e pré-programadas para que o seu código continue rodando. (Ex: "Sempre que chamar essa função, retorne True"). Ele controla o _estado_.
- **Mock:** Focado em comportamento. Você usa um mock para verificar _se_ uma função foi chamada, _quantas vezes_ foi chamada, e _com quais parâmetros_ (Ex: verificar se o botão "Salvar" realmente chamou a API externa).

## 12. Arquitetura: Comunicação de Microsserviços

- **Problema:** Como avisar 5 sistemas diferentes (Estoque, E-mail, Faturamento) que uma compra foi feita, sem usar uma Fila tradicional (onde a mensagem some após o 1º ler)?
- **Solução:** Padrão **Publish-Subscribe (Pub/Sub)** ou Arquitetura Baseada em Eventos.
- **Como funciona:** O sistema de Compras não envia uma mensagem direta; ele "publica" um evento (Ex: `PedidoCriado`) em um **Tópico** (usando Kafka, AWS SNS ou RabbitMQ Fanout).
- O Estoque e o E-mail são "Inscritos" (Subscribers) desse tópico. Quando o evento acontece, o Tópico clona a mensagem e entrega para todos os interessados simultaneamente!

---

# Resumo: Estrutura de Pastas (Clean Architecture)

Se te perguntarem como o projeto está estruturado, essa é a explicação de cada camada, da mais interna (isolada) para a mais externa:

## 1. `domain/` (O Coração)

- **O que guarda:** Regras de negócio puras, Entidades (Entities) e Value Objects.
- **Exemplo:** A classe `MovieCategory` (nome, descrição).
- **Regra de Ouro:** Não importa biblioteca externa NENHUMA. Não tem SQLAlchemy, não tem Pydantic, não tem FastAPI. É só a linguagem pura.

## 2. `application/` (O Maestro)

- **O que guarda:** Casos de Uso (Use Cases) e Interfaces/Contratos.
- **Exemplo:** `MovieCategoryDeleteUseCase` e `IMovieCategoryRepository`.
- **Regra de Ouro:** É aqui que a lógica acontece (ex: checar se categoria tem filmes antes de deletar). Ele conhece o `domain`, mas não sabe _como_ o banco salva as coisas. Ele apenas dita as regras e exige que a Infraestrutura obedeça as suas Interfaces.

## 3. `infrastructure/` (O Operário)

- **O que guarda:** A comunicação com o mundo externo (Banco de Dados, APIs Externas, Filas, AWS).
- **Exemplo:** `SQLAlchemyMovieCategoryRepository`, os `models` do banco, e a configuração do ORM.
- **Regra de Ouro:** É o código "sujo". Ele pega a interface limpinha que a Camada de Aplicação criou e faz ela funcionar de verdade usando o SQLAlchemy ou o Postgres.

## 4. `presentation/` (O Garçom)

- **O que guarda:** A porta de entrada do usuário. Controladores, Rotas, Schemas de Request/Response.
- **Exemplo:** Os arquivos do FastAPI (`routers`), os schemas do Pydantic (para validar o JSON) e as Injeções de Dependência.
- **Regra de Ouro:** Não tem lógica de negócio aqui! A Rota apenas recebe o JSON, valida, chama o Caso de Uso, pega a resposta e devolve HTTP 200 (ou 400 se der erro).

---

# Árvore de Diretórios do Projeto (Visual)

```text
app/
├── application/
│   ├── interfaces/       -> Contratos abstratos (ex: IMovieCategoryRepository.py)
│   └── use_cases/        -> Onde a lógica orquestrada vive (ex: movie_category_use_cases.py)
├── domain/
│   └── entities/         -> Modelos de domínio puros, sem frameworks (ex: entities.py)
├── infrastructure/
│   └── database/
│       ├── models/       -> Modelos do SQLAlchemy, mapeando as tabelas (ex: movie_catalog.py)
│       ├── repositories/ -> A implementação real de acesso a dados (ex: movie_catalog_repository.py)
│       └── session.py    -> Conexão física com o banco de dados
├── presentation/
│   ├── routers/          -> Os Endpoints / Controladores do FastAPI (ex: movie_catalog.py)
│   ├── schemas/          -> Modelos do Pydantic para validar entradas e saídas JSON
│   └── dependencies.py   -> O arquivo mágico de Injeção de Dependência que amarra tudo
└── main.py               -> Ponto de inicialização da API
```

## React Hooks - Resumo Básico

```tsx
/**
 * useState
 * Cria um valor variável com função para alteração posterior.
 */

const [count, setCount] = useState(0);
setCount((oldVal) => oldVal + 1);
setCount(count + 1);
```

```tsx
/**
 * useEffect
 * Executa com side effect (efeito colateral), ou seja:
 * sempre que algo mudar, o callback definido aqui é executado.
 */

// Executa quando count mudar valor
useEffect(() => console.log(count), [count]);

// Executa no começo (onMounted)
useEffect(() => console.log(count), []);

// Executa sempre que qualquer coisa mudar
useEffect(() => console.log(count));
```

```tsx
/**
 * useContext
 * Reaproveita o valor de um contexto.
 * Funciona parecido com Pinia.
 */

// para criar contexto em um arquivo.
const ThemeContext = createContext("light");

// Para usar em outro arquivo.
const theme = useContext(ThemeContext);
console.log(theme); // 'light'
```

```tsx
/**
 * useReducer
 * Uma alternativa ao useState. Ideal para
 * lógicas de estado mais complexas,
 * que envolvem múltiplos subvalores,
 * ou quando o próximo estado depende
 * fortemente do estado anterior.
 */

const initialState = { count: 0 };

function reducer(state, action) {
  if (action.type === "increment") return { count: state.count + 1 };
  return state;
}

const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: "increment" });
```

```tsx
/**
 * useCallback
 * Retorna uma função de callback memoizada.
 * Isso evita que a função seja recriada
 * a cada renderização, útil para otimizar componentes
 * filhos que dependem dessa função.
 */
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b], // Só recria a função se 'a' ou 'b' mudarem
);
```

```tsx
/**
 * useMemo
 * Diferença do useState:
 * - useState GUARDA um valor e
 *   ATUALIZA a tela quando muda.
 * - useMemo CACHEIA um cálculo
 *   pesado para não refazer a
 *   cada renderização à toa.
 */

const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b], // Só recalcula se 'a' ou 'b' mudarem
);
```

```tsx
/**
 * useRef
 * Retorna um objeto mutável com 
 * uma propriedade .current. Usado 
 * para acessar elementos do DOM 
 * diretamente ou armazenar valores 
 * persistentes sem acionar nova
 * renderização.
 */
const inputEl = useRef(null);

// Focando o input diretamente
if (inputEl.current) {
  inputEl.current.focus();
}

// Em um JSX: <input ref={inputEl} />
```

```tsx
/**
 * useImperativeHandle
 * Personaliza a instância exposta
 * a componentes pai ao usar
 * referências (ref). É utilizado
 * junto com React.forwardRef.
 */
useImperativeHandle(ref, () => ({
  focus: () => {
    inputRef.current.focus();
  },
}));
```

```tsx
/**
 * useLayoutEffect
 * Semelhante ao useEffect, mas
 * dispara de forma síncrona logo
 * após as mutações no DOM, antes
 * que o navegador pinte a tela.
 * Útil para medir o DOM.
 */
useLayoutEffect(() => {
  console.log(boxRef.current.getBoundingClientRect());
}, []);
```

```tsx
/**
 * useDebugValue
 * Permite exibir um rótulo (label)
 * personalizado no React DevTools
 * para os seus custom hooks
 * (hooks personalizados).
 */
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // Exibirá "Online" ou "Offline" no React DevTools
  useDebugValue(isOnline ? "Online" : "Offline");

  return isOnline;
}
```

## Novos Hooks (React 18+)

```tsx
/**
 * useId
 * Gera IDs únicos consistentes
 * tanto na renderização do 
 * servidor (SSR) quanto cliente.
 * Útil para acessibilidade.
 */
const id = useId();

// Uso no JSX:
// <label htmlFor={id}>Nome:</label>
// <input id={id} type="text" />
```

```tsx
/**
 * useTransition
 * Permite marcar atualizações
 * de estado como "não urgentes",
 * mantendo a interface responsiva
 * durante renderizações pesadas.
 */
const [isPending, startTransition] = useTransition();

// A interface não trava enquanto o state é atualizado
startTransition(() => {
  setQuery(input);
});
```

```tsx
/**
 * useDeferredValue
 * Obtém versão "adiada" de um 
 * valor. Útil para atrasar
 * renderização de partes menos
 * prioritárias da UI.
 */
const deferredQuery = useDeferredValue(query);

// Se 'query' mudar rapidamente (ex: digitando),
// 'deferredQuery' vai ficar defasado para não travar a tela
```
