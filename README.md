# HowTo

## 📚 Índice de Estudos e Serviços

### [ardour](./ardour)

O Ardour é uma estação de trabalho de áudio digital (DAW) de código aberto, usada para gravação, edição, mixagem e masterização de áudio e MIDI.

- **Como rodar:** `cd ./ardour && npm run dev`
- **Site Oficial:** [https://ardour.org/](https://ardour.org/)

---

### [azuracast](./azuracast)

O AzuraCast é um painel de controle web completo e open-source para gerenciar web rádios, incluindo auto-DJ, estatísticas e gerenciamento de mídia.

- **Como rodar:** `cd ./azuracast && npm run dev`
- **Site Oficial:** [https://www.azuracast.com/](https://www.azuracast.com/)

---

### [bevy](./bevy)

O Bevy é um motor de jogos (game engine) guiado a dados (data-driven) construído na linguagem Rust, focado em simplicidade, performance e modularidade.

- **Como rodar:** `cd ./bevy && npm run dev`
- **Site Oficial:** [https://bevyengine.org/](https://bevyengine.org/)

---

### [caddy](./caddy)

O Caddy é um servidor web poderoso e escalável focado em segurança, que provisiona e renova certificados SSL/TLS automaticamente (via Let"s Encrypt).

- **Como rodar:** `cd ./caddy && npm run dev`
- **Site Oficial:** [https://caddyserver.com/](https://caddyserver.com/)

---

### [chat](./chat)

Projeto focado em implementar um serviço de chat em tempo real, explorando o uso de websockets ou protocolos de mensageria para comunicação instantânea.

- **Como rodar:** `cd ./chat && npm run dev`

---

### [duplicati](./duplicati)

O Duplicati é um cliente de backup gratuito que armazena arquivos de forma criptografada em serviços de nuvem online, como S3, Google Drive, entre outros. - https://duplicati.com/ - https://hub.docker.com/r/linuxserver/duplicati

- **Como rodar:** `cd ./duplicati && npm run dev`
- **Site Oficial:** [https://www.duplicati.com/](https://www.duplicati.com/)

---

### [grpc](./grpc)

O gRPC (Google Remote Procedure Call) é um framework de código aberto de alta performance desenvolvido pelo Google para comunicação entre serviços (RPC - Chamada de Procedimento Remoto). Ele utiliza o **HTTP/2** para transporte e o **Protocol Buffers (Protobuf)** como linguagem de descrição de interface e formato de serialização de dados, em vez de formatos mais comuns como JSON ou XML. Principais características do gRPC: - **Alta Performance:** A combinação de Protobuf (dados binários serializados) e HTTP/2 (multiplexação, compressão de headers) torna a comunicação muito mais rápida e leve em comparação com APIs REST tradicionais. - **Contratos Fortemente Tipados:** As rotas, serviços e formatos de mensagens são estritamente definidos em arquivos `.proto`. Isso garante um contrato claro, seguro e validado entre o cliente e o servidor. - **Suporte Multi-Linguagem:** Você pode ter um microsserviço rodando em Go e outro em Node.js ou Python. O gRPC compila o arquivo `.proto` e gera automaticamente o código base para comunicação em praticamente qualquer linguagem moderna. - **Streaming Bidirecional:** Graças ao HTTP/2, o gRPC suporta nativamente streaming de dados do cliente para o servidor, do servidor para o cliente ou ambos simultaneamente.

- **Como rodar:** `cd ./grpc && npm run dev`
- **Site Oficial:** [https://grpc.io/](https://grpc.io/)

---

### [HowTo](./huggingface)

Hugging Face é uma plataforma e comunidade focada em Inteligência Artificial, fornecendo milhares de modelos pré-treinados e datasets para Machine Learning.

- **Como rodar:** `cd ./huggingface && npm run dev`
- **Site Oficial:** [https://huggingface.co/](https://huggingface.co/)

---

### [kasm](./kasm)

O Kasm (ou Kasm Workspaces) é uma plataforma de virtualização baseada em Docker que permite fazer o "streaming" de desktops virtuais, navegadores e aplicativos inteiros diretamente para o seu navegador web, de forma segura e descartável. Em vez de instalar um programa ou criar uma máquina virtual pesada (VM), o Kasm sobe um contêiner Docker isolado rodando o aplicativo desejado (no caso deste projeto, o Steam) e transmite apenas a interface gráfica para você usar pelo navegador, como se fosse um "Netflix de aplicativos". Principais vantagens do Kasm: - **Segurança (Isolamento):** Cada ambiente roda em um contêiner temporário. Se você fechar ou terminar a sessão, o contêiner é destruído e tudo some, protegendo a sua máquina principal. - **Acesso Fácil:** Você não precisa de nenhum software cliente especial (como TeamViewer, VNC ou RDP). Qualquer navegador moderno serve. - **Leveza:** Por usar contêineres em vez de Máquinas Virtuais (VMs) tradicionais com sistema operacional completo, ele consome bem menos recursos do seu sistema. - **Flexibilidade:** A biblioteca deles (Kasm Registry) possui dezenas de imagens prontas, indo de navegadores seguros até ferramentas de desenvolvimento completas e jogos (Steam).

- **Como rodar:** `cd ./kasm && npm run dev`
- **Site Oficial:** [https://kasmweb.com/](https://kasmweb.com/)

---

### [kestra](./kestra)

O Kestra é uma plataforma moderna e open-source de orquestração e agendamento de dados (data orchestration). Ele serve para criar, agendar e monitorar fluxos de trabalho (pipelines) complexos de forma declarativa, escrevendo apenas arquivos YAML. Em resumo, o Kestra: - É uma alternativa mais moderna e simples a ferramentas como o Apache Airflow. - Permite conectar facilmente bancos de dados, APIs, scripts e outros serviços em um único fluxo de trabalho automatizado. - É guiado por eventos (event-driven), podendo reagir imediatamente a gatilhos (como a chegada de um arquivo) além dos agendamentos tradicionais.

- **Como rodar:** `cd ./kestra && npm run dev`
- **Site Oficial:** [https://kestra.io/](https://kestra.io/)

---

### [keycloak](./keycloak)

O Keycloak é uma solução open-source robusta de Gerenciamento de Identidade e Acesso (IAM), mantida pela Red Hat. Ele facilita adicionar autenticação, autorização e segurança a aplicativos e serviços modernos. Em resumo: - **Single Sign-On (SSO):** Permite que usuários façam login apenas uma vez e tenham acesso a vários aplicativos diferentes. - **Padrões de Mercado:** Trabalha com os principais protocolos como OAuth 2.0, OpenID Connect e SAML 2.0. - **Autenticação Descentralizada:** Suporta login social (Google, GitHub, Facebook) e integração com LDAP/Active Directory. - **Gerenciamento Completo:** Oferece painel para administrar usuários, permissões, sessões e regras de acesso.

- **Como rodar:** `cd ./keycloak && npm run dev`
- **Site Oficial:** [https://www.keycloak.org/](https://www.keycloak.org/)

---

### [helpdesk](./laravel-base)

Uma instalação base do framework PHP Laravel, configurada como um boilerplate (ponto de partida) para acelerar o desenvolvimento de novas aplicações.

- **Como rodar:** `cd ./laravel-base && npm run dev`

---

### [Laravel + MongoDB](./laravel-mongodb)

Exemplo de integração do framework Laravel com o banco de dados NoSQL MongoDB, mostrando como configurar modelos e conexões não-relacionais. Read the Laravel Documentation: <br /> https://laravel.com/docs/12.x/mongodb Laravel MongoDB Documentation: <br /> https://www.mongodb.com/docs/drivers/php/laravel-mongodb/current/

- **Como rodar:** `cd ./laravel-mongodb && npm run dev`
- **Site Oficial:** [https://www.mongodb.com/docs/drivers/php/laravel-mongodb/](https://www.mongodb.com/docs/drivers/php/laravel-mongodb/)

---

### [laravel](./laravel)

Ambiente para testes e desenvolvimento utilizando o Laravel, o popular framework PHP moderno focado em elegância e velocidade de desenvolvimento.

- **Como rodar:** `cd ./laravel && npm run dev`
- **Site Oficial:** [https://laravel.com/](https://laravel.com/)

---

### [localstack](./localstack)

O LocalStack é um emulador de nuvem open-source que roda localmente no seu computador através de contêineres Docker. Ele recria um ambiente quase idêntico à nuvem da AWS (Amazon Web Services). Em resumo: - **Desenvolvimento Offline:** Permite criar, testar e debugar aplicações em nuvem e serverless sem precisar de conexão com a internet ou gastar com recursos da AWS. - **Emulação de Serviços:** Ele emula dezenas de serviços conhecidos da AWS, como S3 (armazenamento de arquivos), Lambda (funções), DynamoDB (banco NoSQL) e SQS (filas). - **Pronto para CI/CD:** Muito utilizado em pipelines de testes automatizados para validar fluxos complexos antes de subir para a nuvem de verdade. [Homepage](https://github.com/localstack/localstack)

- **Como rodar:** `cd ./localstack && npm run dev`
- **Site Oficial:** [https://localstack.cloud/](https://localstack.cloud/)

---

### [n8n](./n8n)

O n8n é uma ferramenta de automação de fluxo de trabalho (workflow) open-source. Ele permite conectar e integrar diversas APIs e serviços visualmente.

- **Como rodar:** `cd ./n8n && npm run dev`
- **Site Oficial:** [https://n8n.io/](https://n8n.io/)

---

### [nexe](./node2exe)

Demonstração de como compilar e empacotar uma aplicação Node.js (JavaScript) em um único arquivo executável binário (usando nexe ou ferramentas similares).

- **Como rodar:** `cd ./node2exe && npm run dev`
- **Site Oficial:** [https://github.com/nexe/nexe](https://github.com/nexe/nexe)

---

### [nuxt-capacitor](./nuxt-capacitor)

Exemplo de integração entre o Nuxt.js (framework Vue) e o Capacitor (da Ionic) para criar aplicativos móveis híbridos (Android/iOS) usando web.

- **Como rodar:** `cd ./nuxt-capacitor && npm run dev`
- **Site Oficial:** [https://capacitorjs.com/](https://capacitorjs.com/)

---

### [OSINT](./osint)

OSINT (Open-Source Intelligence), ou Inteligência de Fontes Abertas, é o processo de coleta e análise de dados provenientes de fontes públicas e acessíveis a qualquer pessoa (como sites, redes sociais, registros públicos e fóruns). No contexto de cibersegurança e Hacking Ético, o OSINT é utilizado na fase inicial de exploração ("reconhecimento") para reunir o máximo de informações possíveis sobre um alvo (como vazamentos de senhas, listagem de funcionários, e-mails ou subdomínios) sem tocá-lo ou alertá-lo ativamente. | Arquivo | Função | | ------------------ | ------------------------------------- | | sherlock.sh | Encontrar username | | linkedin-dumper.sh | Encontrar funcionários de uma empresa | Implementar https://github.com/markowanga/stweet

- **Como rodar:** `cd ./osint && npm run dev`

---

### [HowTo](./osjs)

O OS.js é um ambiente de área de trabalho (desktop) de código aberto em JavaScript que roda inteiramente dentro de um navegador web moderno.

- **Como rodar:** `cd ./osjs && npm run dev`
- **Site Oficial:** [https://www.os-js.org/](https://www.os-js.org/)

---

### [osm](./osm)

Estudos sobre OSM (OpenStreetMap) ou serviços geográficos. Relacionado a renderização de mapas locais, servidores de tiles e dados abertos de localização.

- **Como rodar:** `cd ./osm && npm run dev`
- **Site Oficial:** [https://www.openstreetmap.org/](https://www.openstreetmap.org/)

---

### [php-apache-multi](./php-apache-multi)

Ambiente Dockerizado configurado com PHP e Apache, demonstrando como hospedar múltiplos projetos ou configurar virtual hosts em um único container.

- **Como rodar:** `cd ./php-apache-multi && npm run dev`

---

### [portainer](./portainer)

O Portainer é uma interface gráfica web leve e amigável para gerenciar e monitorar ambientes, contêineres, imagens e volumes do Docker.

- **Como rodar:** `cd ./portainer && npm run dev`
- **Site Oficial:** [https://www.portainer.io/](https://www.portainer.io/)

---

### [py-klogger](./pyklogger)

Projeto em Python que implementa um Keylogger (registrador de teclas), voltado para estudos de segurança da informação e interceptação de eventos.

- **Como rodar:** `cd ./pyklogger && npm run dev`

---

### [sftpgo](./sftpgo)

O SFTPGo é um servidor SFTP/FTP/WebDAV completo de código aberto, com suporte avançado a armazenamento em nuvem (S3, GCS, Azure) como backend.

- **Como rodar:** `cd ./sftpgo && npm run dev`
- **Site Oficial:** [https://github.com/drakkan/sftpgo](https://github.com/drakkan/sftpgo)

---

### [waha](./waha)

O WAHA (WhatsApp HTTP API) é um projeto que expõe as funcionalidades do WhatsApp Web através de uma API REST, facilitando a integração de bots.

- **Como rodar:** `cd ./waha && npm run dev`
- **Site Oficial:** [https://waha.devlike.pro/](https://waha.devlike.pro/)

---

### [HowTo](./wordpress)

Ambiente básico preparado para rodar e testar o WordPress, o Sistema de Gerenciamento de Conteúdo (CMS) mais popular do mundo.

- **Como rodar:** `cd ./wordpress && npm run dev`
- **Site Oficial:** [https://wordpress.org/](https://wordpress.org/)

---

### [wwebjs](./wwebjs)

O WhatsApp Web JS (`whatsapp-web.js`) é uma biblioteca não-oficial para Node.js que permite criar clientes e bots para o WhatsApp. Ele funciona rodando o próprio WhatsApp Web em um navegador "invisível" (headless, usando Puppeteer) e automatizando as interações de forma programática. Em resumo: - **Automação e Bots:** Permite criar chatbots complexos, respostas automáticas e disparos de mensagens sem intervenção humana. - **Alternativa à API Oficial:** Como a API oficial do WhatsApp Business é paga e tem regras estritas, essa biblioteca é usada como alternativa gratuita (porém com o risco de banimento de número por ser não-oficial). - **Recursos Totais:** Suporta quase tudo que o WhatsApp normal faz: enviar texto, imagens, localização, arquivos, ler status e gerenciar grupos. Documentation: https://wwebjs.dev

- **Como rodar:** `cd ./wwebjs && npm run dev`
- **Site Oficial:** [https://wwebjs.dev/](https://wwebjs.dev/)

---

