<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db     = new Database();
$chatId = isset($_GET['chat_id']) ? (int)$_GET['chat_id'] : null;

header('Content-Type: application/json');

if (!$chatId) {
    echo json_encode(['error' => 'Missing chat_id']);
    exit;
}

$members = $db->getChatMembers($chatId);
echo json_encode(['members' => $members]);
