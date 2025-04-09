<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
$chatId = $_POST['chat_id'] ?? null;

if (!$chatId) {
    echo json_encode(['error' => 'Missing chat_id']);
    exit;
}

$stmt = $db->conn->prepare("DELETE FROM Chats WHERE chatID = :chatId");
$stmt->bindParam(':chatId', $chatId);
echo json_encode(['success' => $stmt->execute()]);
