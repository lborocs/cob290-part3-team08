<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
$chatId = $_POST['chat_id'] ?? null;
$senderId = $_POST['sender_id'] ?? null;
$message = $_POST['message'] ?? '';

if (!$chatId || !$senderId || !$message) {
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

$stmt = $db->conn->prepare("
    INSERT INTO ChatMessages (chat_id, sender_id, message_contents)
    VALUES (:chatId, :senderId, :msg)
");
$stmt->bindParam(':chatId', $chatId);
$stmt->bindParam(':senderId', $senderId);
$stmt->bindParam(':msg', $message);
echo json_encode(['success' => $stmt->execute()]);
