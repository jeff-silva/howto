# Manual Técnico do Tema Shopify

Bem-vindo ao repositório do tema Shopify! Este manual contém as instruções essenciais para você configurar seu ambiente do zero, iniciar o desenvolvimento local, entender a estrutura de pastas e publicar suas alterações na loja.

## 1. Instalação e Setup Inicial (Começando do Zero)

Se você é novo no projeto ou está configurando sua máquina, siga os passos abaixo para preparar seu ambiente e baixar os arquivos.

### Passo 1: Instalar o Shopify CLI
O Shopify CLI é a ferramenta necessária para interagir com a loja. Instale-a globalmente via npm:

```bash
npm install -g @shopify/cli @shopify/theme
```

### Passo 2: Autenticar na Loja
Faça login na loja da Shopify pelo terminal:

```bash
shopify theme dev --store labscript-test.myshopify.com
```
*(Esse comando vai pedir para você abrir o navegador e fazer login)*

### Passo 3: Baixar (Pull) o tema
Para trazer os arquivos do tema da nuvem para o seu computador, execute:

```bash
shopify theme pull --store labscript-test.myshopify.com
```
Selecione o tema desejado (ex: `test-data`) na lista que aparecer no terminal.

---

## 2. Como iniciar o modo de desenvolvimento (Dev Mode)

Para começar a trabalhar localmente e visualizar as alterações em tempo real, execute o seguinte comando na raiz do projeto:

```bash
shopify theme dev --store labscript-test.myshopify.com
```

**O que acontece durante o `shopify theme dev`?**
Quando você roda esse comando, as alterações locais sincronizam **apenas** com um tema de desenvolvimento temporário na nuvem. Ele fica invisível para visitantes normais e visível somente através do link gerado no terminal. **Nada altera o tema publicado oficial da loja** até que você envie (push) as alterações explicitamente.

## 3. Estrutura de Pastas e Sincronização

A Shopify possui uma estrutura rígida de diretórios. Somente as pastas abaixo (e seus arquivos) são sincronizadas com a nuvem:

- `assets/` (CSS, JS, imagens, fontes)
- `config/` (settings_schema.json, settings_data.json)
- `layout/` (theme.liquid, password.liquid, etc.)
- `locales/` (arquivos de tradução .json)
- `sections/` (seções modulares reutilizáveis .liquid)
- `snippets/` (partials reutilizáveis .liquid)
- `templates/` (templates de páginas .json ou .liquid)

### O que é ignorado?

- Pastas que não fazem parte da estrutura nativa da Shopify (ex: `src/`, `node_modules/`, `.git/`, `dist/`).
- Arquivos listados em um `.shopifyignore` na raiz do seu projeto (funciona exatamente como um `.gitignore`).

## 4. Como subir as alterações para valer (Publicar)

Quando você terminar de codificar e quiser transformar o que fez no tema real/oficial da loja, primeiro encerre o modo de desenvolvimento pressionando `Ctrl + C` no terminal.

Em seguida, use o comando de push para enviar as alterações locais para o tema que você baixou:

```bash
shopify theme push --store labscript-test.myshopify.com
```

O terminal perguntará em qual tema você quer sobrescrever (você pode selecionar o tema atual, como `test-data`, ou criar um novo tema não publicado).

### Publicação imediata (Live)

Se você quiser enviar as alterações e **publicar imediatamente** como o tema oficial (Live) da loja, adicione a flag `--publish`:

```bash
shopify theme push --store labscript-test.myshopify.com --publish
```
