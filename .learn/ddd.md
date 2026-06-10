# Domain-Driven Design (DDD): Resumo e Conceitos Básicos

O **Domain-Driven Design** (Projeto Orientado ao Domínio) é uma abordagem de design de software focada em modelar sistemas complexos com base na realidade do negócio. Em vez de pensar primeiro no banco de dados ou no framework, o foco principal é entender e codificar o **Domínio** (o problema que o software tenta resolver).

---

## 🗣️ Linguagem Ubíqua (Ubiquitous Language)

A base do DDD. É uma **linguagem em comum** desenvolvida e usada tanto pelos especialistas do negócio (Domain Experts) quanto pelos desenvolvedores de software. 
* Se o negócio fala em "Reservar um Quarto", o código não deve ter uma função genérica `updateStatus()`, mas sim algo claro como `reservarQuarto()`.
* O código deve refletir exatamente como o negócio funciona no mundo real.

---

## 📦 Contextos Delimitados (Bounded Contexts)

Grandes sistemas não podem ter um modelo de domínio único que faça sentido para tudo. O DDD propõe dividir o sistema em **Contextos Delimitados**.
* Exemplo num E-commerce: O conceito de "Produto" no contexto de **Catálogo/Vendas** (tem foto, descrição, preço) é diferente de "Produto" no contexto de **Estoque/Logística** (tem peso, dimensões, quantidade na prateleira). Cada contexto tem seu próprio modelo isolado.

---

## 🧱 Blocos de Construção (Building Blocks)

O DDD tático nos dá alguns padrões para estruturar o código dentro do domínio:

### 1. Entidades (Entities)
Objetos que possuem uma **Identidade Única** que não muda ao longo do tempo. O que importa é "quem" o objeto é, e não apenas seus atributos.
* *Exemplo:* Um "Cliente" tem um ID. Se ele mudar o nome ou o endereço, ele ainda é o mesmo Cliente.

### 2. Objetos de Valor (Value Objects)
Objetos que **não possuem identidade**. Eles são definidos apenas por seus atributos (valores) e devem ser **imutáveis**.
* *Exemplo:* Uma "Moeda" ou um "Endereço". Se você mudar a rua do endereço, você não está atualizando o endereço, está criando um endereço totalmente novo.

### 3. Agregados (Aggregates)
Um grupo de Entidades e Objetos de Valor que são tratados como uma única unidade de dados. O **Agregado Raiz** (Aggregate Root) é a única entidade pela qual as coisas de fora podem interagir com o agregado.
* *Exemplo:* Um "Pedido" (Aggregate Root) contém vários "Itens do Pedido" (Entities/Value Objects). Ninguém pode adicionar um item diretamente; é preciso pedir ao Pedido para adicionar o item, garantindo as regras de negócio (ex: o pedido não está fechado).

### 4. Repositórios (Repositories)
Atuam como uma coleção em memória de Agregados. O domínio não sabe como salvar no banco de dados, ele apenas interage com a interface do repositório para "buscar" ou "salvar" agregados.

### 5. Serviços de Domínio (Domain Services)
Operações e regras de negócio que não se encaixam naturalmente em uma Entidade ou Objeto de Valor.
* *Exemplo:* Transferir dinheiro de uma Conta A para uma Conta B.

---

## 💻 Exemplo Simplificado em PHP

Exemplo de um **Value Object** imutável e uma **Entidade** (Aggregate Root).

```php
namespace Domain;

// Value Object: Definido apenas por seus valores e imutável.
class Money {
    private int $amount;
    private string $currency;

    public function __construct(int $amount, string $currency = 'BRL') {
        if ($amount < 0) throw new \InvalidArgumentException("Valor não pode ser negativo");
        $this->amount = $amount;
        $this->currency = $currency;
    }

    public function getAmount(): int { return $this->amount; }
}

// Entidade (Aggregate Root): Tem identidade ($id)
class Product {
    private string $id;
    private string $name;
    private Money $price;

    public function __construct(string $id, string $name, Money $price) {
        $this->id = $id;
        $this->name = $name;
        $this->price = $price;
    }

    public function changePrice(Money $newPrice): void {
        // Regra de negócio: o novo preço entra por um método claro e do domínio
        $this->price = $newPrice;
    }
}

// Uso:
$price = new Money(15000); // R$ 150,00 (trabalhando com centavos)
$product = new Product(uniqid(), "Teclado Mecânico", $price);

$newPrice = new Money(12000);
$product->changePrice($newPrice);
```

**Em suma:** O DDD tenta traduzir as complexidades do mundo real e do negócio diretamente para o design do software, separando essas regras cruciais de qualquer complicação técnica (como bancos de dados ou frameworks).
