<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
$chatId = $_POST['chat_id'] ?? null;
$senderId = $_POST['sender_id'] ?? null;
$message = $_POST['message'] ?? '';

header('Content-Type: application/json');

if (!$chatId || !$senderId || !$message) {
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

$success = $db->sendMessage($chatId, $senderId, $message);
echo json_encode(['success' => $success]);
?>
