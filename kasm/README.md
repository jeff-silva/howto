# kasm

## O que é o Kasm?

O Kasm (ou Kasm Workspaces) é uma plataforma de virtualização baseada em Docker que permite fazer o "streaming" de desktops virtuais, navegadores e aplicativos inteiros diretamente para o seu navegador web, de forma segura e descartável.

Em vez de instalar um programa ou criar uma máquina virtual pesada (VM), o Kasm sobe um contêiner Docker isolado rodando o aplicativo desejado (no caso deste projeto, o Steam) e transmite apenas a interface gráfica para você usar pelo navegador, como se fosse um "Netflix de aplicativos".

Principais vantagens do Kasm:
- **Segurança (Isolamento):** Cada ambiente roda em um contêiner temporário. Se você fechar ou terminar a sessão, o contêiner é destruído e tudo some, protegendo a sua máquina principal.
- **Acesso Fácil:** Você não precisa de nenhum software cliente especial (como TeamViewer, VNC ou RDP). Qualquer navegador moderno serve.
- **Leveza:** Por usar contêineres em vez de Máquinas Virtuais (VMs) tradicionais com sistema operacional completo, ele consome bem menos recursos do seu sistema.
- **Flexibilidade:** A biblioteca deles (Kasm Registry) possui dezenas de imagens prontas, indo de navegadores seguros até ferramentas de desenvolvimento completas e jogos (Steam).


How to run:

```bash
cd ./kasm && yarn dev
```
