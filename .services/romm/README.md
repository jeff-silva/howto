# RomM

Esta configuração de exemplo faz o RomM aproveitar a conexão com o PostgreSQL do Supabase para salvar os dados. No entanto, ele não tem uma configuração de schema, então é necessário criar um banco independente só pra ele.

Portanto, acesse o admin do Supabase e execute a query abaixo para criar seu banco:

```sql
CREATE DATABASE romm_db;
```
