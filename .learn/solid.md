# SOLID: Direto ao Ponto (com PHP)

## 1. [S] Single Responsibility Principle (Responsabilidade Única)
**Regra:** Uma classe faz apenas UMA coisa.

❌ **Ruim:** A classe cuida do usuário e também do banco de dados.
```php
class User {
    public function getName() { /* ... */ }
    public function saveToDatabase() { /* Conecta no BD e salva */ }
}
```

✅ **Bom:** Separe quem cuida dos dados e quem cuida do banco.
```php
class User {
    public function getName() { /* ... */ }
}

class UserRepository {
    public function save(User $user) { /* Salva no BD */ }
}
```

---

## 2. [O] Open/Closed Principle (Aberto/Fechado)
**Regra:** Adicione coisas novas criando código novo, não alterando código existente.

❌ **Ruim:** Se criar um tipo 'Premium', precisa alterar esse `if`.
```php
class Discount {
    public function calculate($type) {
        if ($type == 'VIP') return 20;
        if ($type == 'Normal') return 5;
    }
}
```

✅ **Bom:** Crie novas classes usando uma interface.
```php
interface DiscountType {
    public function calculate(): int;
}

class VipDiscount implements DiscountType {
    public function calculate(): int { return 20; }
}

class NormalDiscount implements DiscountType {
    public function calculate(): int { return 5; }
}

// 💡 Dica: Como instanciar isso sem espalhar 'ifs' pelo código? Usando uma Factory!
class DiscountFactory {
    public function create(string $type): DiscountType {
        return match($type) {
            'VIP' => new VipDiscount(),
            'Normal' => new NormalDiscount(),
            // Para adicionar o Premium, é só criar a classe e adicionar uma linha aqui!
            default => throw new Exception("Tipo de desconto inválido"),
        };
    }
}

// Uso limpo:
$factory = new DiscountFactory();
$discount = $factory->create('VIP');
echo $discount->calculate(); // 20
```

---

## 3. [L] Liskov Substitution Principle (Substituição de Liskov)
**Regra:** Se a classe filha substitui a pai, o sistema não pode quebrar.

❌ **Ruim:** O Pinguim é um Pássaro, mas não voa. Dá erro se chamarem `fly()`.
```php
class Bird {
    public function fly() { return "Voando!"; }
}

class Penguin extends Bird {
    public function fly() { throw new Exception("Não sei voar!"); }
}
```

✅ **Bom:** Nem todo pássaro voa. Melhore a abstração.
```php
class Bird { /* métodos comuns a todos pássaros */ }

interface Flyable {
    public function fly();
}

class Eagle extends Bird implements Flyable {
    public function fly() { return "Voando!"; }
}

class Penguin extends Bird {
    // Apenas nada ou anda, não implementa Flyable
}
```

---

## 4. [I] Interface Segregation Principle (Segregação de Interface)
**Regra:** Não force uma classe a implementar o que ela não usa.

❌ **Ruim:** O Robô é forçado a ter um método `comer()` inútil.
```php
interface Worker {
    public function work();
    public function eat();
}

class Robot implements Worker {
    public function work() { /* Trabalha */ }
    public function eat() { /* Robô não come, método inútil! */ }
}
```

✅ **Bom:** Crie interfaces menores e específicas.
```php
interface Workable { public function work(); }
interface Eatable { public function eat(); }

class Robot implements Workable {
    public function work() { /* Trabalha */ }
}

class Human implements Workable, Eatable {
    public function work() { /* Trabalha */ }
    public function eat() { /* Come */ }
}
```

---

## 5. [D] Dependency Inversion Principle (Inversão de Dependência)
**Regra:** Dependa de abstrações (Interfaces), não de implementações (Classes concretas).

❌ **Ruim:** A classe está "chumbada" com o MySQL. Se mudar para PostgreSQL, tem que reescrever a classe.
```php
class UserController {
    public function store() {
        $db = new MySQLConnection(); // Dependência direta!
        $db->insert();
    }
}
```

✅ **Bom:** Injete a dependência usando uma interface.
```php
interface DatabaseConnection {
    public function insert();
}

class UserController {
    private DatabaseConnection $db;

    // Recebe qualquer banco de dados que siga a interface!
    public function __construct(DatabaseConnection $db) {
        $this->db = $db;
    }

    public function store() {
        $this->db->insert();
    }
}
```
