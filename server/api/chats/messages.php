<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
$chatId = $_GET['chat_id'] ?? null;


if (!$chatId) {
    echo json_encode(['error' => 'Missing chat_id']);
    exit;
}

echo json_encode($db->getChatMessages($chatId));
?>
