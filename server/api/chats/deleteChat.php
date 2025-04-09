<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
$chatId = $_POST['chat_id'] ?? null;

header('Content-Type: application/json');

if (!$chatId) {
    echo json_encode(['error' => 'Missing chat_id']);
    exit;
}

$success = $db->deleteChat($chatId);
echo json_encode(['success' => $success]);
?>
