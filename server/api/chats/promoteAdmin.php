<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
$chatId = $_POST['chat_id'] ?? null;
$userId = $_POST['user_id'] ?? null;

if (!$chatId || !$userId) {
    echo json_encode(['error' => 'Missing chat_id or user_id']);
    exit;
}

$success = $db->setAdminStatus($chatId, $userId, true);
echo json_encode(['success' => $success]);
