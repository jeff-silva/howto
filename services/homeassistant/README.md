# Home Assistant

Não se esqueça de habilitar a capacidade de ser acessado via proxy reverso inserindo os atributos à seguir no arquivo de configuração informado:

```yaml
# config/configuration.yaml

http:
  use_x_forwarded_for: true
  trusted_proxies:
    - 10.0.0.0/8
    - 172.16.0.0/12
    - 192.168.0.0/16
    - 127.0.0.1
    - ::1
```
