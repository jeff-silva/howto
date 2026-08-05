# Contexto do Projeto Bevy

Este é um projeto que utiliza a engine **Bevy** (Rust). 
Todo o código-fonte desta aplicação reside dentro de `src/`.

## Ambiente de Desenvolvimento e Execução
- **Arquitetura Dockerizada:** A aplicação é configurada para rodar exclusivamente dentro de um ambiente Docker, gerenciada pelo `docker-compose.yml`.
- **Renderização Gráfica:** O ambiente Docker está customizado para suportar aplicações gráficas, mapeando o Display (X11/Wayland) e concedendo acesso à GPU host (`/dev/dri`) para renderização de hardware (essencial para a Bevy Engine).

## Regras de Código e Comportamento
1. A IA deve assumir que o ambiente de execução é o Docker. Novos scripts ou orientações de compilação devem considerar o contexto do container e do `docker compose`.
2. Siga as boas práticas, design patterns e o paradigma primário da Bevy Engine (ECS - Entity Component System).
3. Qualquer dependência que exija pacotes a nível de sistema operacional (C++ libs, etc.) deve ser instruída para ser adicionada no `Dockerfile`.
