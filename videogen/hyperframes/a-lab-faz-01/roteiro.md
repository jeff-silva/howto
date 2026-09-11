# Roteiro Completo de Animação: LabScript

**Especificações Técnicas Gerais:**
- **Arquivo Destino:** A animação GSAP completa deve ser gerada substituindo o arquivo `index.html`.
- **Áudio (Locução):** O vídeo deve carregar a tag de áudio apontando para `audio.mp3` para ser renderizado com som.
- **Áudio (Trilha Sonora BGM):** Uma segunda tag de áudio deve apontar para `bgm.mp3` para tocar em plano de fundo com volume baixo (ex: `0.15`). Nos últimos 3 segundos do vídeo, o GSAP deve animar a propriedade `volume` para `0` (Fade Out).
- **Assets Disponíveis:** A logo oficial da empresa encontra-se em `labscript.dev.png`.
- **Tecnologias:** HyperFrames, HTML, GSAP (Timeline), Tailwind CSS, Iconify (ícones da coleção 'lucide' e 'logos').
- **Estilo Visual:** Clean 2D corporate vector animation / Flat design minimalista. Nenhuma imagem realista. Os fundos não devem ser chapados: utilize uma malha quadriculada (grid) contínua em perspectiva 3D (estilo cyber/retrowave), usando os tons da paleta para dar profundidade.
- **Paleta de Cores (Baseada na Logo):** 
  - Fundo principal: Dark Indigo (`#0B0813` ou `#181423`)
  - Destaque/Neon: Neon Purple (`#8C3FFF` ou `#A855F7`)
  - Textos secundários: Slate/Cinza claro (`#cbd5e1`)
  - Textos principais: Branco (`#ffffff`)
- **Resolução:** 1080x1920 (Vertical/Reels/Shorts).
- **Tipografia:** Fonte 'Share Tech' (Google Fonts). É EXPRESSAMENTE PROIBIDO usar efeitos de "glow", `text-shadow` brilhantes ou `drop-shadow` difusos nas fontes. O design deve ser completamente flat e sólido.
- **Sincronia:** Baseada no arquivo `audio.js` (array de objetos `{word, start, end}`).

---

## Cena 1: O Cartão de Visitas
**Tempo:** 0.00s a 6.24s
**Áudio:** "O site da sua empresa não deve ser só um cartão de visitas bonitinho. Ele deve trabalhar por você."

**Ação Visual:**
1. Fundo branco simples.
2. Um cartão de visitas cinza e "chato" cai do alto girando em 3D e pousa no centro da tela (movimento de pêndulo).
3. Sombra dinâmica aparece sob o cartão quando ele se aproxima do chão.
4. No tempo 4.0s (quando fala "trabalhar por você"), um flash roxo (`#8C3FFF`) cobre a tela.
5. O fundo rasga para Dark Indigo (`#181423`), o cartão some, e o texto gigante "TRABALHAR POR VOCÊ" é esmagado na tela com forte *camera shake*.

---

## Cena 2: O Desperdício de Dinheiro
**Tempo:** 6.32s a 12.10s
**Áudio:** "Muitas empresas gastam uma fortuna para colocar um site no ar e depois deixam ele lá, parado."

**Ação Visual:**
1. Fundo Dark Indigo com listras de velocidade.
2. Um cofre no estilo flat design no centro inferior, com a porta aberta (perspectiva 3D).
3. Dezenas de notas de dinheiro verde (ícones ou flat CSS) explodem para fora do cofre. Durante o voo, cada nota de dinheiro está **visivelmente pegando fogo**. Devemos garantir que o fogo seja bem visível (usando ícones preenchidos/coloridos como `noto:fire` ou `fxemoji:fire` sobre as notas), criando um visual caótico e premium de desperdício.
4. Efeito contínuo de "Camera Shake" leve.
5. No tempo 10.6s (quando fala "lá, parado"), o dinheiro para de voar abruptamente e um cadeado gigante ou corrente roxa aparece travando tudo.

---

## Cena 3: O Panfleto Digital
**Tempo:** 12.10s a 18.18s
**Áudio:** "Um site que só tem o seu endereço e o botão do WhatsApp não é uma ferramenta. É só um panfleto digital."

**Ação Visual:**
1. Transição limpando a tela.
2. Aparece a silhueta de um smartphone no centro.
3. Dentro da tela, é desenhado um site mockado minimalista (formato *skeleton loading*), com blocos e barras cinzas para simular textos e imagens de forma bem engessada e sem graça. No canto inferior direito desse mockup, um botão verde do WhatsApp flutuante (`logos:whatsapp-icon`) pulsando.
4. Uma cruz vermelha grossa bate sobre o celular (rejeição).
5. O texto em branco "PANFLETO DIGITAL" com sombra vermelha aparece no topo.

---

## Cena 4: Soluções Reais
**Tempo:** 18.28s a 26.28s
**Áudio:** "Faça mais com a sua página. A LabScript constrói soluções sob medida que resolvem problemas reais rodando direto do seu site."

**Ação Visual:**
1. Zoom profundo mergulhando "dentro" da tela do celular da cena anterior.
2. O fundo vira o roxo neon (`#8C3FFF`).
3. Logo da `<Labscript />` surge no centro grandiosa.
4. Em vez de elementos mecânicos, uma enxurrada de ícones "humanos" preenchidos e super coloridos (como `noto:red-heart`, `noto:thumbs-up`, `noto:grinning-face-with-big-eyes`) surge brotando e **subindo pela tela na frente da logo da Labscript**. Eles devem subir continuamente e sumir (fade out) à medida que chegam ao topo, simulando perfeitamente o efeito de *reactions em uma live do Instagram*. As animações GSAP vão controlar a subida flutuante e o desvanecimento.

---

## Cena 5: A LAB FAZ (Segunda via e Pagamentos)
**Tempo:** 26.34s a 30.76s
**Áudio:** "Emissão de segunda via ou pagamentos pela web. A LAB faz."

**Ação Visual:**
1. Fundo volta a ser Dark Indigo.
2. Animação de um "boleto" digital e um cartão de crédito flutuando.
3. No tempo 29.6s (quando fala "A LAB faz"), a tela escurece e o texto "A LAB FAZ" bate no centro com força letal (Mega Camera Shake).

---

## Cena 6: A LAB FAZ (Pedidos e Arquivos)
**Tempo:** 30.86s a 34.90s
**Áudio:** "Receber pedidos de compra ou envio de arquivos. A LAB faz."

**Ação Visual:**
1. Fundo Dark Indigo.
2. Ícones gigantes de carrinho de supermercado (`lucide:shopping-cart`) e pastas de arquivos circulando a tela velozmente.
3. No tempo 34.2s, o texto "A LAB FAZ" atinge a tela com *glitch effect* roxo e branco.

---

## Cena 7: A LAB FAZ (Download e PDF)
**Tempo:** 35.46s a 39.84s
**Áudio:** "Enviar links de download por e-mail ou gerar PDF. A LAB faz."

**Ação Visual:**
1. Fundo Dark Indigo.
2. Surge na tela um mockup minimalista (formato *skeleton loading*) imitando a interface do Gmail, com linhas e blocos brancos/cinzas simulando o cabeçalho e o corpo do e-mail.
3. No fim desse e-mail, aparece em destaque um botão estilizado "Download PDF", que sofre um leve destaque ou clique simulado.
4. No tempo 39.0s, texto colidindo na tela de forma agressiva (esmagando o mockup), em escala gigantesca preenchendo a tela: "A LAB FAZ.".

---

## Cena 8: O Prejuízo
**Tempo:** 40.44s a 45.76s
**Áudio:** "Se o seu site não está automatizando a sua vida e a do seu cliente, ele está te dando prejuízo."

**Ação Visual:**
1. Cores invertem temporariamente (para dar sensação de alerta): Fundo roxo, detalhes pretos.
2. Um gráfico financeiro animado e super detalhado (usando Chart.js) preenche o centro. Ele não terá apenas a linha, mas os eixos, marcações de escala e grandes popups de porcentagem vermelha (ex: "-42%", "-89%") pipocando enquanto a linha sofre a queda livre dramática.
3. Junto com a queda do gráfico, uma tempestade de "reactions" tristes (`lucide:frown`, rostinhos chorando) despenca e flutua pela tela, no mesmo estilo da Cena 4, mas transmitindo a angústia da palavra "prejuízo".
4. O texto central em branco (esmagando o gráfico): "PREJUÍZO".

---

## Cena 9: Call to Action (Direct)
**Tempo:** 46.18s a 55.70s
**Áudio:** "Quer transformar o seu site em uma máquina de verdade? Envie um direct. A LabScript tem soluções que acompanham o tamanho e o momento da sua empresa."

**Ação Visual:**
1. Transição limpa para Dark Indigo.
2. A Logo `<Labscript />` assume o topo.
3. Aparece um botão ou balão gigante "ENVIE UM DIRECT" pulsando (Neon Purple) no centro da tela.
4. No fundo, orbes roxos flutuam lentamente (glassmorphism leve para dar ar premium de encerramento).
5. Tela congela e faz fade to black nos últimos 2 segundos.
