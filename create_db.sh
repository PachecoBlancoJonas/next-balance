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

CREATE TABLE country (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    iso_code CHAR(2) NOT NULL UNIQUE
);

INSERT INTO countries (name, iso_code) VALUES
('Åland Islands', 'AX'),
('Andorra', 'AD'),
('Australia', 'AU'),
('Austria', 'AT'),
('Belgium', 'BE'),
('Canada', 'CA'),
('Cyprus', 'CY'),
('Denmark', 'DK'),
('Estonia', 'EE'),
('Finland', 'FI'),
('France', 'FR'),
('French Guiana', 'GF'),
('Germany', 'DE'),
('Greece', 'GR'),
('Guadeloupe', 'GP'),
('Ireland', 'IE'),
('Italy', 'IT'),
('Latvia', 'LV'),
('Lithuania', 'LT'),
('Luxembourg', 'LU'),
('Malta', 'MT'),
('Martinique', 'MQ'),
('Mayotte', 'YT'),
('Monaco', 'MC'),
('Netherlands', 'NL'),
('New Zealand', 'NZ'),
('Portugal', 'PT'),
('Réunion', 'RE'),
('Saint Barthélemy', 'BL'),
('Saint Martin', 'MF'),
('Saint Pierre and Miquelon', 'PM'),
('San Marino', 'SM'),
('Slovakia', 'SK'),
('Slovenia', 'SI'),
('Spain', 'ES'),
('Sweden', 'SE'),
('United Kingdom', 'GB'),
('United States', 'US'),
('Vatican City', 'VA');

CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    iban VARCHAR(50) NOT NULL
    account_ref VARCHAR(50) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_account (account_ref, user_id)
);