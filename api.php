<?php
header('Content-Type: application/json; charset=utf-8');

$dbName = 'flashcards_db';
$dbHost = 'localhost';
$dbUser = 'root';      // ajuste conforme seu MySQL local
$dbPass = '';
$uploadDir = __DIR__ . '/photos';

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

function respond($data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

function ensureDatabase(PDO $pdo, string $dbName): void
{
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
}

try {
    $rootPdo = new PDO("mysql:host=$dbHost;charset=utf8mb4", $dbUser, $dbPass, $options);
    ensureDatabase($rootPdo, $dbName);
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass, $options);
} catch (Throwable $e) {
    respond(['error' => 'Erro ao conectar: ' . $e->getMessage()], 500);
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list_groups':
        try {
            $stmt = $pdo->query("SELECT id, name, description, created_at FROM `groups` ORDER BY created_at DESC");
            respond(['groups' => $stmt->fetchAll()]);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    case 'create_group':
        $payload = json_decode(file_get_contents('php://input'), true);
        $name = trim($payload['name'] ?? '');
        $description = trim($payload['description'] ?? '') ?: null;

        if (!$name) {
            respond(['error' => 'Nome é obrigatório.'], 422);
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO `groups` (name, description) VALUES (:name, :description)");
            $stmt->execute([':name' => $name, ':description' => $description]);
            $id = (int) $pdo->lastInsertId();
            respond([
                'ok' => true,
                'group' => [
                    'id' => $id,
                    'name' => $name,
                    'description' => $description,
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ], 201);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    case 'list_cards':
        $groupId = (int) ($_GET['group_id'] ?? 0);
        if (!$groupId) {
            respond(['error' => 'group_id é obrigatório.'], 422);
        }
        try {
            $stmt = $pdo->prepare("SELECT id, group_id, question, answer, answer_image, created_at FROM `cards` WHERE group_id = :gid ORDER BY created_at DESC");
            $stmt->execute([':gid' => $groupId]);
            respond(['cards' => $stmt->fetchAll()]);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    case 'create_card':
        $groupId = (int) ($_POST['group_id'] ?? 0);
        $question = trim($_POST['question'] ?? '');
        $answer = trim($_POST['answer'] ?? '') ?: null;

        if (!$groupId) respond(['error' => 'group_id é obrigatório.'], 422);
        if (!$question) respond(['error' => 'Pergunta é obrigatória.'], 422);
        if (!$answer && empty($_FILES['answer_image']['tmp_name'])) {
            respond(['error' => 'Forneça uma resposta em texto ou imagem.'], 422);
        }

        $imagePath = null;
        if (!empty($_FILES['answer_image']['tmp_name'])) {
            $file = $_FILES['answer_image'];
            $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!in_array($file['type'], $allowed, true)) {
                respond(['error' => 'Apenas imagens são permitidas.'], 422);
            }
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0775, true);
            }
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg';
            $safeExt = preg_replace('/[^a-zA-Z0-9]/', '', $ext);
            $filename = 'card_' . uniqid() . '.' . ($safeExt ?: 'jpg');
            $target = $uploadDir . DIRECTORY_SEPARATOR . $filename;
            if (!move_uploaded_file($file['tmp_name'], $target)) {
                respond(['error' => 'Falha ao salvar imagem.'], 500);
            }
            $imagePath = 'photos/' . $filename;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO `cards` (group_id, question, answer, answer_image) VALUES (:gid, :question, :answer, :img)");
            $stmt->execute([
                ':gid' => $groupId,
                ':question' => $question,
                ':answer' => $answer,
                ':img' => $imagePath
            ]);
            $id = (int) $pdo->lastInsertId();
            respond([
                'ok' => true,
                'card' => [
                    'id' => $id,
                    'group_id' => $groupId,
                    'question' => $question,
                    'answer' => $answer,
                    'answer_image' => $imagePath,
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ], 201);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    default:
        respond(['error' => 'Ação inválida.'], 400);
}
