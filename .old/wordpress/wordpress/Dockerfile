FROM wordpress:latest

# Cria um grupo e usuário com UID/GID 33
# RUN groupadd -g 33 www-data && \
#   useradd -u 33 -g 33 -ms /bin/bash www-data

# Altera o dono dos diretórios para o usuário www-data
RUN chown -R www-data:www-data /var/www/html/wp-content

# Define o usuário www-data para executar o WordPress
USER www-data

COPY custom.ini $PHP_INI_DIR/conf.d/