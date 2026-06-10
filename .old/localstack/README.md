# localstack

**Site Oficial:** [https://localstack.cloud/](https://localstack.cloud/)


## O que é o LocalStack?

O LocalStack é um emulador de nuvem open-source que roda localmente no seu computador através de contêineres Docker. Ele recria um ambiente quase idêntico à nuvem da AWS (Amazon Web Services).

Em resumo:
- **Desenvolvimento Offline:** Permite criar, testar e debugar aplicações em nuvem e serverless sem precisar de conexão com a internet ou gastar com recursos da AWS.
- **Emulação de Serviços:** Ele emula dezenas de serviços conhecidos da AWS, como S3 (armazenamento de arquivos), Lambda (funções), DynamoDB (banco NoSQL) e SQS (filas).
- **Pronto para CI/CD:** Muito utilizado em pipelines de testes automatizados para validar fluxos complexos antes de subir para a nuvem de verdade.

[Homepage](https://github.com/localstack/localstack)

How to run:

```bash
cd ./localstack && yarn dev
```
