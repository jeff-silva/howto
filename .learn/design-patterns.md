# Design Patterns: Exemplos Práticos em PHP

Os Padrões de Projeto (Design Patterns) são soluções testadas e comprovadas para problemas recorrentes no desenvolvimento de software. Eles são divididos em 3 categorias principais. Abaixo, os mais utilizados no dia a dia:

---

## 🏗️ 1. Padrões Criacionais (Criação de Objetos)

### Singleton

Garante que uma classe tenha apenas **uma única instância** em toda a aplicação. Muito usado para conexões de Banco de Dados.

```php
class Database {
    private static ?Database $instance = null;

    // Construtor privado impede "new Database()"
    private function __construct() {}

    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
}

// Uso:
$db1 = Database::getInstance();
$db2 = Database::getInstance();
var_dump($db1 === $db2); // true (é exatamente a mesma instância)
```

### Factory Method

Cria objetos sem expor a lógica de instanciação. Você pede "o que" precisa, e a Factory decide "como" criar.

```php
interface Logger { public function log(string $msg); }
class FileLogger implements Logger { public function log(string $msg) { echo "Log no arquivo"; } }
class DBLogger implements Logger { public function log(string $msg) { echo "Log no banco"; } }

class LoggerFactory {
    public static function create(string $type): Logger {
        return match($type) {
            'file' => new FileLogger(),
            'database' => new DBLogger(),
            default => throw new Exception("Tipo inválido"),
        };
    }
}

// Uso:
$logger = LoggerFactory::create('file');
```

---

## 🧩 2. Padrões Estruturais (Composição de Classes e Objetos)

### Decorator

Adiciona novos comportamentos a um objeto dinamicamente sem alterar a classe original (uma ótima alternativa à herança).

```php
interface Coffee {
  public function cost(): int;
}

class BasicCoffee implements Coffee {
  public function cost(): int {
    return 5;
  }
}

// Decorator Base
abstract class CoffeeDecorator implements Coffee {
  protected Coffee $coffee;

  public function __construct(Coffee $coffee) {
    $this->coffee = $coffee;
  }
}

// Adicionando Leite
class WithMilk extends CoffeeDecorator {
  public function cost(): int {
    return $this->coffee->cost() + 2;
  }
}

// Uso:
$myCoffee = new BasicCoffee();
$myCoffee = new WithMilk($myCoffee); // Embrulha o café básico com leite
echo $myCoffee->cost(); // 7
```

---

## 🧠 3. Padrões Comportamentais (Comunicação entre Objetos)

### Strategy

Define uma família de algoritmos, encapsula cada um deles e os torna intercambiáveis. (Excelente para eliminar `ifs` gigantes).

```php
interface PaymentStrategy {
  public function pay(int $amount);
}

class CreditCardPayment implements PaymentStrategy {
  public function pay(int $amount) {
    echo "Pagou $amount no Cartão.";
  }
}

class PixPayment implements PaymentStrategy {
  public function pay(int $amount) {
    echo "Pagou $amount via PIX.";
  }
}

class Checkout {
  public function process(int $amount, PaymentStrategy $method) {
    $method->pay($amount);
  }
}

// Uso:
$checkout = new Checkout();
$checkout->process(100, new PixPayment());
```

### Observer

Define uma dependência um-para-muitos. Quando um objeto muda de estado, todos os seus dependentes (observadores) são notificados (Modelo de Eventos/Listeners).

```php
interface Observer {
  public function update(string $event);
}

class UserNotifier implements Observer {
  public function update(string $event) {
    echo "Notificando usuário sobre: $event\n";
  }
}

class Order {
  private array $observers = [];

  public function attach(Observer $observer) { $this->observers[] = $observer; }

  public function complete() {
    // Regra de negócio...
    foreach ($this->observers as $observer) {
      $observer->update("Pedido Finalizado!");
    }
  }
}

// Uso:
$order = new Order();
$order->attach(new UserNotifier()); // Inscreve o observador
$order->complete(); // Dispara a notificação automaticamente
```
