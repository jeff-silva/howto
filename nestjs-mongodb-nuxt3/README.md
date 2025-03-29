# HowTo

After install NestJS, install this dependencies: `yarn add mongoose @nestjs/mongoose`.

```typescript
/**
 * Install validator/transformer dependencies
 * yarn add class-validator class-transformer
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Then insert this block in main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
```

```typescript
/**
 * Installing TypeORM
 * yarn add typeorm @nestjs/typeorm
 *
 * Go to app.module.ts
 */
```
