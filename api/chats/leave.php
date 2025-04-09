<?php
require_once '../../includes/Database_Enhanced.php';
header('Content-Type: application/json');

$db = new Database();
$chatId = $_POST['chat_id'] ?? null;
$userId = $_POST['user_id'] ?? null;

if (!$chatId || !$userId) {
    echo json_encode(['error' => 'Missing chat_id or user_id']);
    exit;
}

$success = $db->leaveChat($chatId, $userId);
echo json_encode(['success' => $success]);
