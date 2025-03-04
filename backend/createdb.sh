#!/bin/bash

# Cargar variables desde el archivo .env
export $(cat .env | grep -v '^#' | xargs)

# Ingresar a MariaDB y ejecutar el comando para crear el usuario
mysql -u $DB_ROOT_USER -p$DB_ROOT_PASSWORD -e "
CREATE USER '${DB_USER}'@'${DB_HOST}' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'${DB_HOST}';
FLUSH PRIVILEGES;
"