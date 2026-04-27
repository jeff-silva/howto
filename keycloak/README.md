# keycloak

**Site Oficial:** [https://www.keycloak.org/](https://www.keycloak.org/)


## O que é o Keycloak?

O Keycloak é uma solução open-source robusta de Gerenciamento de Identidade e Acesso (IAM), mantida pela Red Hat. Ele facilita adicionar autenticação, autorização e segurança a aplicativos e serviços modernos.

Em resumo:
- **Single Sign-On (SSO):** Permite que usuários façam login apenas uma vez e tenham acesso a vários aplicativos diferentes.
- **Padrões de Mercado:** Trabalha com os principais protocolos como OAuth 2.0, OpenID Connect e SAML 2.0.
- **Autenticação Descentralizada:** Suporta login social (Google, GitHub, Facebook) e integração com LDAP/Active Directory.
- **Gerenciamento Completo:** Oferece painel para administrar usuários, permissões, sessões e regras de acesso.

How to run:

```bash
cd ./keycloak && yarn dev
```

## Dúvidas

<dl>
  <dt>
    <strong>No Keycloak é possível "banir" usuários?</strong><br />
    Eu gostaria que quando um usuário banido fizesse login, o login falhasse
    e o usuário recebesse uma mensagem customizada com o motivo da
    não conclusão da autenticação. É possível?
  </dt>
  <dd>
    <strong>Sim, é possível, mas não nativamente.</strong>
  </dd>
</dl>
