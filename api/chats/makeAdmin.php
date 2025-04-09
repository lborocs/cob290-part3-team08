<?php
require_once '../../includes/Database_Enhanced.php';
header('Content-Type: application/json');

$db = new Database();
$chatId = $_POST['chat_id'] ?? null;
$userId = $_POST['user_id'] ?? null;
$status = $_POST['is_admin'] ?? null;

if (!$chatId || !$userId || !isset($status)) {
    echo json_encode(['error' => 'Missing chat_id, user_id, or is_admin']);
    exit;
}

$success = $db->setAdminStatus($chatId, $userId, (bool)$status);
echo json_encode(['success' => $success]);
