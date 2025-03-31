# NestJS Docker

1 - Create new NestJS application running install.sh in this folder: `sh install.sh`.

2 - Insert service above in main compose.yml file:

```yaml
services:
  nestjs:
    build: ./nestjs
    volumes:
      - ./nestjs/app:/app
    ports:
      - 3000:3000
```

- [ ] Verificar como fazer para que o timestamps: true faça createdAt ser created_at e o mesmo para updatedAt
- [ ] Paginação nos endpoints de list
