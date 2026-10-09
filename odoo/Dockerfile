FROM odoo:latest
USER root

# Instalar dependências de sistema para o WeasyPrint
RUN apt-get update && apt-get install -y \
    libpango-1.0-0 \
    libharfbuzz0b \
    libpangoft2-1.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt e instalar dependências Python declarativamente
COPY ./addons/resumas/requirements.txt /tmp/requirements.txt
RUN pip install --break-system-packages -r /tmp/requirements.txt

USER odoo
