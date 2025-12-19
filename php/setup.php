<?php
/**
 * Script de instalação: cria o banco `flashcards_db` e as tabelas necessárias.
 * Execute uma vez em localhost para preparar o ambiente.
 */
$dbName = 'flashcards_db';
$dbHost = 'localhost';
$dbUser = 'root';      // ajuste se você usa outra senha/usuário no MySQL local
$dbPass = '';

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO("mysql:host=$dbHost;charset=utf8mb4", $dbUser, $dbPass, $options);
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$dbName`");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `groups` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(120) NOT NULL,
            `description` TEXT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `cards` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `group_id` INT UNSIGNED NOT NULL,
            `question` TEXT NOT NULL,
            `answer` MEDIUMTEXT NULL,
            `answer_image` VARCHAR(255) NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT `fk_cards_group` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    echo json_encode([
        'ok' => true,
        'message' => "Banco `$dbName` e tabelas criados/verificados."
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
