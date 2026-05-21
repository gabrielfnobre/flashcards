<?php
header('Content-Type: application/json; charset=utf-8');

$dbName   = 'flashcards_db';
$dbHost   = 'localhost';
$dbUser   = 'root';
$dbPass   = '';
$rootDir  = dirname(__DIR__);
$uploadDir = $rootDir . '/photos';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

/**
 * Envia uma resposta JSON padronizada e encerra a execução.
 */
function respond($data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Salva um arquivo de imagem em $uploadDir e retorna o caminho relativo.
 */
function saveImage(array $file, string $uploadDir): string
{
    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowed, true)) {
        respond(['error' => 'Apenas imagens são permitidas (jpeg, png, gif, webp).'], 422);
    }
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0775, true);
    }
    $ext     = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg';
    $safeExt = preg_replace('/[^a-zA-Z0-9]/', '', $ext) ?: 'jpg';
    $filename = 'card_' . uniqid() . '.' . $safeExt;
    $target   = $uploadDir . DIRECTORY_SEPARATOR . $filename;
    if (!move_uploaded_file($file['tmp_name'], $target)) {
        respond(['error' => 'Falha ao salvar imagem.'], 500);
    }
    return 'photos/' . $filename;
}

/**
 * Remove um arquivo de imagem do disco se ele existir.
 */
function removeImage(string $relativePath, string $rootDir): void
{
    if (!$relativePath) return;
    $abs = $rootDir . DIRECTORY_SEPARATOR . $relativePath;
    if (is_file($abs)) {
        @unlink($abs);
    }
}

/**
 * Garante que o banco e as tabelas existam (idempotente).
 * Executa também migration para adicionar question_image caso não exista.
 */
function ensureDatabase(PDO $pdo, string $dbName): void
{
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$dbName`");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `groups` (
            `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `name`        VARCHAR(120) NOT NULL,
            `description` TEXT NULL,
            `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `cards` (
            `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `group_id`     INT UNSIGNED NOT NULL,
            `question`     TEXT NOT NULL,
            `answer`       MEDIUMTEXT NULL,
            `answer_image` VARCHAR(255) NULL,
            `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT `fk_cards_group` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Migration: adiciona question_image se ainda não existir (idempotente)
    try {
        $pdo->exec("ALTER TABLE `cards` ADD COLUMN `question_image` VARCHAR(255) NULL AFTER `answer_image`");
    } catch (Throwable $e) {
        // A coluna já existe — ignorar silenciosamente
    }
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

    // ------------------------------------------------------------------ //
    // Recebe um arquivo de imagem e salva em photos/, retornando a URL.
    case 'upload_image':
        if (empty($_FILES['image']['tmp_name'])) {
            respond(['error' => 'Nenhuma imagem recebida.'], 422);
        }
        try {
            $url = saveImage($_FILES['image'], $uploadDir);
            respond(['ok' => true, 'url' => $url]);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    // ------------------------------------------------------------------ //
    case 'list_groups':
        try {
            $stmt = $pdo->query("SELECT id, name, description, created_at FROM `groups` ORDER BY created_at DESC");
            respond(['groups' => $stmt->fetchAll()]);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    // ------------------------------------------------------------------ //
    case 'create_group':
        $payload     = json_decode(file_get_contents('php://input'), true);
        $name        = trim($payload['name'] ?? '');
        $description = trim($payload['description'] ?? '') ?: null;

        if (!$name) {
            respond(['error' => 'Nome é obrigatório.'], 422);
        }
        try {
            $stmt = $pdo->prepare("INSERT INTO `groups` (name, description) VALUES (:name, :description)");
            $stmt->execute([':name' => $name, ':description' => $description]);
            $id = (int) $pdo->lastInsertId();
            respond([
                'ok'    => true,
                'group' => [
                    'id'          => $id,
                    'name'        => $name,
                    'description' => $description,
                    'created_at'  => date('Y-m-d H:i:s'),
                ],
            ], 201);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    // ------------------------------------------------------------------ //
    case 'list_cards':
        $groupId = (int) ($_GET['group_id'] ?? 0);
        if (!$groupId) {
            respond(['error' => 'group_id é obrigatório.'], 422);
        }
        try {
            $stmt = $pdo->prepare(
                "SELECT id, group_id, question, answer, answer_image, question_image, created_at
                 FROM `cards` WHERE group_id = :gid ORDER BY created_at DESC"
            );
            $stmt->execute([':gid' => $groupId]);
            respond(['cards' => $stmt->fetchAll()]);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    // ------------------------------------------------------------------ //
    case 'create_card':
        $groupId  = (int) ($_POST['group_id'] ?? 0);
        $question = trim($_POST['question'] ?? '');
        $answer   = trim($_POST['answer'] ?? '') ?: null;

        if (!$groupId) respond(['error' => 'group_id é obrigatório.'], 422);
        if (!$question) respond(['error' => 'Pergunta é obrigatória.'], 422);

        // Aceita resposta em texto puro, HTML rico (com imagens inline) ou arquivo separado
        $answerHasText  = strlen(trim(strip_tags($answer ?? ''))) > 0;
        $answerHasImg   = stripos($answer ?? '', '<img') !== false;
        $hasContent = $answerHasText || $answerHasImg
            || !empty($_FILES['answer_image']['tmp_name'])
            || !empty($_FILES['question_image']['tmp_name']);
        if (!$hasContent) {
            respond(['error' => 'Forneça uma resposta em texto ou imagem.'], 422);
        }

        $questionImagePath = null;
        if (!empty($_FILES['question_image']['tmp_name'])) {
            $questionImagePath = saveImage($_FILES['question_image'], $uploadDir);
        }

        $answerImagePath = null;
        if (!empty($_FILES['answer_image']['tmp_name'])) {
            $answerImagePath = saveImage($_FILES['answer_image'], $uploadDir);
        }

        try {
            $stmt = $pdo->prepare(
                "INSERT INTO `cards` (group_id, question, answer, answer_image, question_image)
                 VALUES (:gid, :question, :answer, :img, :qimg)"
            );
            $stmt->execute([
                ':gid'      => $groupId,
                ':question' => $question,
                ':answer'   => $answer,
                ':img'      => $answerImagePath,
                ':qimg'     => $questionImagePath,
            ]);
            $id = (int) $pdo->lastInsertId();
            respond([
                'ok'   => true,
                'card' => [
                    'id'             => $id,
                    'group_id'       => $groupId,
                    'question'       => $question,
                    'answer'         => $answer,
                    'answer_image'   => $answerImagePath,
                    'question_image' => $questionImagePath,
                    'created_at'     => date('Y-m-d H:i:s'),
                ],
            ], 201);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    // ------------------------------------------------------------------ //
    // update_card agora aceita multipart/form-data para suportar imagens.
    case 'update_card':
        $id       = (int) ($_POST['id'] ?? 0);
        $question = isset($_POST['question']) ? trim((string) $_POST['question']) : null;
        $answer   = isset($_POST['answer'])   ? trim((string) $_POST['answer'])   : null;

        if (!$id) {
            respond(['error' => 'id é obrigatório.'], 422);
        }
        if ($question !== null && $question === '') {
            respond(['error' => 'Pergunta não pode ser vazia.'], 422);
        }

        try {
            $stmt = $pdo->prepare("SELECT * FROM `cards` WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $current = $stmt->fetch();
            if (!$current) {
                respond(['error' => 'Card não encontrado.'], 404);
            }

            $newQuestion = $question !== null ? $question : $current['question'];
            $newAnswer   = $answer   !== null ? ($answer ?: null) : $current['answer'];

            // --- question_image ---
            $newQuestionImage = $current['question_image'] ?? null;
            if (!empty($_FILES['question_image']['tmp_name'])) {
                removeImage((string) $newQuestionImage, $rootDir);
                $newQuestionImage = saveImage($_FILES['question_image'], $uploadDir);
            } elseif (!empty($_POST['remove_question_image'])) {
                removeImage((string) $newQuestionImage, $rootDir);
                $newQuestionImage = null;
            }

            // --- answer_image ---
            $newAnswerImage = $current['answer_image'] ?? null;
            if (!empty($_FILES['answer_image']['tmp_name'])) {
                removeImage((string) $newAnswerImage, $rootDir);
                $newAnswerImage = saveImage($_FILES['answer_image'], $uploadDir);
            } elseif (!empty($_POST['remove_answer_image'])) {
                removeImage((string) $newAnswerImage, $rootDir);
                $newAnswerImage = null;
            }

            $upd = $pdo->prepare(
                "UPDATE `cards`
                 SET question = :q, answer = :a, answer_image = :img, question_image = :qimg
                 WHERE id = :id"
            );
            $upd->execute([
                ':q'    => $newQuestion,
                ':a'    => $newAnswer,
                ':img'  => $newAnswerImage,
                ':qimg' => $newQuestionImage,
                ':id'   => $id,
            ]);

            $stmt = $pdo->prepare(
                "SELECT id, group_id, question, answer, answer_image, question_image, created_at
                 FROM `cards` WHERE id = :id"
            );
            $stmt->execute([':id' => $id]);
            $updated = $stmt->fetch();

            respond(['ok' => true, 'card' => $updated]);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    // ------------------------------------------------------------------ //
    case 'delete_card':
        $payload = json_decode(file_get_contents('php://input'), true);
        $id      = (int) ($payload['id'] ?? 0);
        if (!$id) {
            respond(['error' => 'id é obrigatório.'], 422);
        }
        try {
            $stmt = $pdo->prepare("SELECT answer_image, question_image FROM `cards` WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $row = $stmt->fetch();
            if (!$row) {
                respond(['error' => 'Card não encontrado.'], 404);
            }

            $del = $pdo->prepare("DELETE FROM `cards` WHERE id = :id");
            $del->execute([':id' => $id]);

            removeImage((string) ($row['answer_image']   ?? ''), $rootDir);
            removeImage((string) ($row['question_image'] ?? ''), $rootDir);

            respond(['ok' => true]);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    // ------------------------------------------------------------------ //
    case 'delete_group':
        $payload = json_decode(file_get_contents('php://input'), true);
        $id      = (int) ($payload['id'] ?? 0);
        if (!$id) {
            respond(['error' => 'id é obrigatório.'], 422);
        }
        try {
            $stmt = $pdo->prepare("SELECT answer_image, question_image FROM `cards` WHERE group_id = :gid");
            $stmt->execute([':gid' => $id]);
            while ($row = $stmt->fetch()) {
                removeImage((string) ($row['answer_image']   ?? ''), $rootDir);
                removeImage((string) ($row['question_image'] ?? ''), $rootDir);
            }

            $del = $pdo->prepare("DELETE FROM `groups` WHERE id = :id");
            $del->execute([':id' => $id]);

            if ($del->rowCount() === 0) {
                respond(['error' => 'Grupo não encontrado.'], 404);
            }

            respond(['ok' => true]);
        } catch (Throwable $e) {
            respond(['error' => $e->getMessage()], 500);
        }
        break;

    // ------------------------------------------------------------------ //
    default:
        respond(['error' => 'Ação inválida.'], 400);
}
