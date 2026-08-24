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
- **Stub:** Fornece respostas "enlatadas" e pré-programadas para que o seu código continue rodando. (Ex: "Sempre que chamar essa função, retorne True"). Ele controla o *estado*.
- **Mock:** Focado em comportamento. Você usa um mock para verificar *se* uma função foi chamada, *quantas vezes* foi chamada, e *com quais parâmetros* (Ex: verificar se o botão "Salvar" realmente chamou a API externa).

## 12. Arquitetura: Comunicação de Microsserviços
- **Problema:** Como avisar 5 sistemas diferentes (Estoque, E-mail, Faturamento) que uma compra foi feita, sem usar uma Fila tradicional (onde a mensagem some após o 1º ler)?
- **Solução:** Padrão **Publish-Subscribe (Pub/Sub)** ou Arquitetura Baseada em Eventos.
- **Como funciona:** O sistema de Compras não envia uma mensagem direta; ele "publica" um evento (Ex: `PedidoCriado`) em um **Tópico** (usando Kafka, AWS SNS ou RabbitMQ Fanout). 
- O Estoque e o E-mail são "Inscritos" (Subscribers) desse tópico. Quando o evento acontece, o Tópico clona a mensagem e entrega para todos os interessados simultaneamente!
