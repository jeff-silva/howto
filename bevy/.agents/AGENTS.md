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

## Aprendizados e Solução de Problemas (Bevy Web & GLTF)
1. **Bevy Web/WASM e Pointer Lock:** No navegador, travar o mouse automaticamente ou via botão do teclado (ex: Espaço) lança um erro `NotAllowedError` devido a restrições de segurança. A trava do mouse só deve ocorrer através de um **Clique do Mouse**. Plugins como `bevy_third_person_camera` devem ter `cursor_lock_active = false` por padrão.
2. **Mixamo FBX para GLTF (Bug de Transparência):** Conversores online frequentemente configuram a opacidade de materiais Mixamo incorretamente (como `AlphaMode::Blend`), desabilitando a escrita no Depth Buffer. Isso faz o modelo 3D renderizar de dentro para fora (as costas sobrepõem a frente). **Solução:** Iterar pelos `StandardMaterial` adicionados/modificados no Bevy e forçar `alpha_mode = AlphaMode::Opaque`.
3. **Animações (GLB/GLTF):** Ao baixar animações separadas, certifique-se de que os ossos (skeleton) são estritamente idênticos. Para evitar conflitos e bugs, se o modelo base `.glb` já vier exportado com a animação embutida, prefira sempre ler a animação de dentro do modelo principal (ex: `olivia.glb#Animation0`).
4. **Escala de Modelos (Mixamo):** Alguns modelos Mixamo possuem escala em centímetros (1.0 = 100m). Ao escalar (ex: `0.01`), certifique-se de que a câmera não ficará fora da bounding box ou com o Zoom maior que o modelo inteiro (fazendo-o parecer invisível). Sempre valide a escala original no Blender ou Three.js Editor se o modelo sumir.
