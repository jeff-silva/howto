# Observabilidade: Resumo e Conceitos Básicos

A **Observabilidade** é uma medida de quão bem você consegue entender os estados internos de um sistema a partir do conhecimento de suas saídas externas. 

Em desenvolvimento de software, especialmente em arquiteturas complexas (como microsserviços), significa ser capaz de responder a qualquer pergunta sobre o que está acontecendo dentro do seu sistema apenas olhando para os dados que ele gera, sem precisar adicionar novos códigos de depuração ou desligar serviços.

---

## 🆚 Monitoramento vs Observabilidade

* **Monitoramento:** Te diz que algo está quebrado. (Ex: "A CPU do servidor está em 100%"). Responde a *sintomas* conhecidos.
* **Observabilidade:** Te permite descobrir **por que** algo está quebrado. (Ex: "A CPU está em 100% porque a requisição X para o banco de dados Y está em loop infinito"). Permite investigar problemas *desconhecidos*.

---

## 🏛️ Os Três Pilares da Observabilidade

Para que um sistema seja considerado observável, ele geralmente precisa exportar três tipos de dados essenciais, conhecidos como os três pilares:

### 1. Logs (Registros)
São registros imutáveis e baseados no tempo (com *timestamp*) de eventos discretos que aconteceram ao longo do tempo.
* *Para que servem:* Para você entender **o que** aconteceu detalhadamente em um momento específico.
* *Boa Prática:* Usar logs estruturados (em JSON, por exemplo), para que máquinas e ferramentas de busca possam filtrá-los facilmente.

### 2. Metrics (Métricas)
São representações numéricas de dados medidos ao longo de intervalos de tempo. 
* *Para que servem:* Para você entender o **comportamento geral** e a saúde do sistema de forma rápida (ex: uso de memória, número de requisições por segundo, taxa de erros). Como são apenas números agregados, são leves e fáceis de armazenar.

### 3. Traces (Rastreamento Distribuído)
Um *trace* representa todo o caminho (a jornada de ponta a ponta) que uma requisição percorre por todos os serviços ou componentes de um sistema distribuído.
* *Para que servem:* Para você descobrir **onde** está o gargalo ou a falha. Se o usuário clicou em "Comprar" e a resposta demorou 10 segundos, o trace vai mostrar que 9 segundos foram gastos na chamada à API de cartão de crédito.

---

## 💻 Exemplo Simplificado: Logs Estruturados em PHP

Em vez de salvar logs simples em texto, a base da observabilidade começa estruturando a informação, o que facilita buscas no futuro (usando ferramentas como Datadog, ElasticSearch, etc).

```php
// Ruim: Difícil de filtrar e pesquisar depois
error_log("Erro ao salvar o usuário " . $userId . " no banco de dados.");

// Bom: Log Estruturado (JSON)
$logData = [
    'timestamp' => date('c'),
    'level'     => 'ERROR',
    'message'   => 'Falha ao persistir usuário',
    'context'   => [
        'user_id' => $userId,
        'action'  => 'create_user',
        'db_error'=> $exception->getMessage()
    ]
];

// O sistema de observabilidade consegue indexar 'user_id' e 'action' separadamente.
echo json_encode($logData);
```

**Resumo da obra:** Observabilidade não é uma ferramenta que você instala, mas sim uma propriedade do seu sistema. Você constrói sistemas observáveis instrumentando seu código para emitir **Logs, Métricas e Traces** que permitam investigar o sistema quando as coisas derem errado em produção.
