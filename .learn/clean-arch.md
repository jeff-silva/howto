# Clean Architecture: Resumo e Exemplo em PHP

A **Clean Architecture** (Arquitetura Limpa), proposta por Robert C. Martin (Uncle Bob), tem como objetivo principal a **separação de responsabilidades** e a **independência de frameworks, bancos de dados e interfaces externas**.

A regra de ouro é a **Regra de Dependência**: as dependências no código-fonte devem apontar apenas para *dentro*, em direção às regras de negócio de mais alto nível.

---

## 🏗️ As Camadas

Geralmente, dividimos a arquitetura nestas 4 camadas (de dentro para fora):

1. **Entities (Entidades):** Regras de negócio corporativas (objetos de domínio).
2. **Use Cases (Casos de Uso):** Regras de negócio da aplicação (orquestração do fluxo de dados).
3. **Interface Adapters (Controladores, Presenters, Gateways):** Convertem dados no formato mais conveniente para os Casos de Uso ou para as agências externas (Web, DB).
4. **Frameworks & Drivers (Web, DB, UI):** Detalhes externos. O banco de dados, o framework web (ex: Laravel, Symfony), etc.

---

## 💻 Exemplo em PHP

Vamos simular a criação de um Usuário.

### 1. Entidade (Entities)
Pura regra de negócio. Não conhece nada de banco de dados.

```php
namespace Domain\Entity;

class User {
    private string $id;
    private string $email;

    public function __construct(string $id, string $email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException("Email inválido.");
        }
        $this->id = $id;
        $this->email = $email;
    }

    public function getEmail(): string {
        return $this->email;
    }
}
```

### 2. Interface do Repositório (Use Cases / Interface)
Definimos o contrato que a infraestrutura deverá implementar. Os Casos de Uso dependem dessa abstração, não do banco de dados real.

```php
namespace Domain\Repository;

use Domain\Entity\User;

interface UserRepositoryInterface {
    public function save(User $user): void;
}
```

### 3. Caso de Uso (Use Cases)
Orquestra o que a aplicação deve fazer. Recebe dados (DTO), cria a entidade e usa o repositório para salvar.

```php
namespace Application\UseCase;

use Domain\Entity\User;
use Domain\Repository\UserRepositoryInterface;

class CreateUserUseCase {
    private UserRepositoryInterface $repository;

    public function __construct(UserRepositoryInterface $repository) {
        $this->repository = $repository;
    }

    public function execute(string $email): void {
        $user = new User(uniqid(), $email);
        
        // Regra da aplicação: salva o usuário usando a interface
        $this->repository->save($user);
    }
}
```

### 4. Controlador (Interface Adapters)
Recebe a requisição HTTP e chama o Caso de Uso.

```php
namespace Infrastructure\Controller;

use Application\UseCase\CreateUserUseCase;
use Infrastructure\Database\MySqlUserRepository; // Implementação real

class UserController {
    public function store(array $request) {
        $email = $request['email'];

        // A injeção de dependência normalmente cuidaria de instanciar isso:
        $repository = new MySqlUserRepository(); 
        $useCase = new CreateUserUseCase($repository);

        try {
            $useCase->execute($email);
            echo "Usuário criado com sucesso!";
        } catch (\Exception $e) {
            echo "Erro: " . $e->getMessage();
        }
    }
}
```

### 5. Repositório Real (Frameworks & Drivers / Infraestrutura)
A implementação concreta que realmente fala com o MySQL, PDO, Eloquent, etc.

```php
namespace Infrastructure\Database;

use Domain\Entity\User;
use Domain\Repository\UserRepositoryInterface;

class MySqlUserRepository implements UserRepositoryInterface {
    public function save(User $user): void {
        // Exemplo: INSERT INTO users (id, email) VALUES (...)
        // Aqui vai o código PDO, Eloquent, Doctrine, etc.
    }
}
```

**Resumo da obra:** O framework web e o banco de dados ficam nas extremidades da aplicação (camada 4 e 5 do exemplo). O `CreateUserUseCase` não faz a mínima ideia se o banco é MySQL ou MongoDB, e nem se o framework web é o Laravel ou Slim. Ele apenas dita as regras do negócio!
