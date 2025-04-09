<?php
require_once '../../includes/Database_Enhanced.php';
header('Content-Type: application/json');

$db = new Database();
$chatName = $_POST['chat_name'] ?? null;
$creatorId = $_POST['creator_id'] ?? null;

if (!$chatName || !$creatorId) {
    echo json_encode(['error' => 'Missing chat_name or creator_id']);
    exit;
}

$chatId = $db->createChatWithCreator($creatorId, $chatName);
echo json_encode(['chat_id' => $chatId]);
