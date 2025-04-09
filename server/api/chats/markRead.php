<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
$messageId = $_POST['message_id'] ?? null;
$userId = $_POST['user_id'] ?? null;

if (!$messageId || !$userId) {
    echo json_encode(['error' => 'Missing message_id or user_id']);
    exit;
}

$stmt = $db->conn->prepare("UPDATE ChatMessages SET read_receipt = 1 WHERE message_id = :msgId");
$stmt->bindParam(':msgId', $messageId);
echo json_encode(['success' => $stmt->execute()]);
