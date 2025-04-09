<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
$chatId = $_POST['chat_id'] ?? null;
$newName = $_POST['new_name'] ?? null;

if (!$chatId || !$newName) {
    echo json_encode(['error' => 'Missing chat_id or new_name']);
    exit;
}

$success = $db->renameChat($chatId, $newName);
echo json_encode(['success' => $success]);
