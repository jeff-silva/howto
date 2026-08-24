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
