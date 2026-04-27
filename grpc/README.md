# grpc

**Site Oficial:** [https://grpc.io/](https://grpc.io/)


## O que é gRPC?

O gRPC (Google Remote Procedure Call) é um framework de código aberto de alta performance desenvolvido pelo Google para comunicação entre serviços (RPC - Chamada de Procedimento Remoto). Ele utiliza o **HTTP/2** para transporte e o **Protocol Buffers (Protobuf)** como linguagem de descrição de interface e formato de serialização de dados, em vez de formatos mais comuns como JSON ou XML.

Principais características do gRPC:
- **Alta Performance:** A combinação de Protobuf (dados binários serializados) e HTTP/2 (multiplexação, compressão de headers) torna a comunicação muito mais rápida e leve em comparação com APIs REST tradicionais.
- **Contratos Fortemente Tipados:** As rotas, serviços e formatos de mensagens são estritamente definidos em arquivos `.proto`. Isso garante um contrato claro, seguro e validado entre o cliente e o servidor.
- **Suporte Multi-Linguagem:** Você pode ter um microsserviço rodando em Go e outro em Node.js ou Python. O gRPC compila o arquivo `.proto` e gera automaticamente o código base para comunicação em praticamente qualquer linguagem moderna.
- **Streaming Bidirecional:** Graças ao HTTP/2, o gRPC suporta nativamente streaming de dados do cliente para o servidor, do servidor para o cliente ou ambos simultaneamente.


How to run:

```bash
cd ./grpc && yarn dev
```
