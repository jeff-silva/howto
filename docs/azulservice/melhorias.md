# Diagnóstico e Melhorias — Novo Site Azul Serviços

Comparativo entre o site anterior (`azulservice.com.br`) e a nova proposta desenvolvida em [index.html](file:///home/jeff/howto/docs/azulservice/index.html) e [cliente.html](file:///home/jeff/howto/docs/azulservice/cliente.html).

---

## 1. O que o Site Antigo Tinha vs. O que o Novo Resolve

- **Conversão e Orçamento:**
  - *Antes:* O visitante precisava procurar a página de contato ou clicar em links externos para pedir orçamento.
  - *Agora:* **Formulário de Cotação Rápida no Hero** (acima da dobra) que já monta a mensagem pronta e abre direto no WhatsApp `(31) 2520-1211`.

- **Atendimento Direto (WhatsApp):**
  - *Antes:* Sem botão flutuante visível em todas as seções.
  - *Agora:* **Botão flutuante do WhatsApp** fixo no canto inferior direito usando o número oficial `(31) 2520-1211`.

- **Navegação Desktop e Mobile:**
  - *Antes:* Menu tradicional pouco prático em telas pequenas.
  - *Agora:* **Megamenu no Desktop** (com serviços e artigos do blog) e **Menu Mobile em `<dialog>` tela cheia** com navegação por níveis (avançar/voltar).

- **Prova Social:**
  - *Antes:* Avaliações positivas do Google (4,9★ com 35 avaliações) pouco exploradas na página inicial.
  - *Agora:* **Selo de 4,9★ no Hero** e seção dedicada com depoimentos reais de clientes do Google.

- **Clareza de Serviços e Segmentos:**
  - *Antes:* Serviços dispersos em páginas ou textos longos.
  - *Agora:* **8 cards objetivos** (Limpeza e Conservação, Portaria e Vigia 24h, Zeladoria e Manutenção, Recepção, Copa e Cozinha, Manobristas, Locação de Mão de Obra e Consultoria) + **faixa de Segmentos Atendidos** (Condomínios, Empresas Privadas, Órgãos Públicos e Comércios/Indústrias).

- **Localização e Contato:**
  - *Antes:* Dados espalhados entre rodapé e páginas internas.
  - *Agora:* **Seção de Contato unificada** com endereço na Pampulha (BH), telefone, e-mail `contato@azulservice.com.br`, horário de funcionamento e **mapa interativo do Google Maps**.

- **SEO, Performance e Visual:**
  - *Antes:* Layout pesado e visual datado.
  - *Agora:* **Interface moderna e leve** (Tailwind CSS, DaisyUI, Vue 3 e Iconify), com meta tags Open Graph, Twitter Cards e dados estruturados (`LocalBusiness` JSON-LD) para ranqueamento e Lighthouse.

---

## 2. Diferencial Exclusivo: Painel Administrativo (Área do Cliente)

Criado em [cliente.html](file:///home/jeff/howto/docs/azulservice/cliente.html) (acessível pelo botão **Área do Cliente** no menu) para mostrar ao dono da conservadora como seus clientes (síndicos, empresas e órgãos públicos) podem acompanhar o serviço:

- **Visão Geral:** Resumo de contratos ativos, equipe presente no posto, próxima fatura e chamados abertos, com atalhos rápidos.
- **Equipe & Ponto:** Lista dos colaboradores alocados, funções, turnos e status.
- **2ª Via e NF-e:** Acesso rápido a boletos e notas fiscais.
- **Pedidos de Material:** Solicitação de reposição de insumos de limpeza direto para o posto.
- **Agendamentos:** Agendamento de visita técnica de supervisão, limpeza pós-obra ou lavagem de fachada.
- **Documentos & CND:** Certidões negativas (INSS, FGTS, Trabalhista) e PCMSO/PGR sempre à mão.
- **Chamados:** Abertura de solicitações operacionais (cobertura de posto, escala, financeiro).

---

## 3. Próximos Passos Sugeridos

- Conectar o formulário de cotação e a **Área do Cliente** a um backend/banco de dados real.
- Adicionar fotos reais da equipe uniformizada e da sede na Pampulha.
- Publicar no domínio oficial e configurar Google Analytics / Meta Pixel.
