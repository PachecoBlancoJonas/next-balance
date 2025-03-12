#!/bin/bash
set -a # Habilita la exportación automática
source .env
set +a # Deshabilita la exportación automática

# Ejecutar comandos en Mysql
mysql -u "$DB_ROOT_USER" -p"$DB_ROOT_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'${DB_HOST}' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'${DB_HOST}';
FLUSH PRIVILEGES;
EOF

mysql -u "$DB_USER" -p"$DB_PASSWORD" ${DB_NAME} <<EOF
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL,
    gocardless_id VARCHAR(255),
    gocardless_key VARCHAR(255)
);
EOF
