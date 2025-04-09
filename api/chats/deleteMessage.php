<?php
require_once '../../includes/Database_Enhanced.php';
header('Content-Type: application/json');

$db = new Database();
$messageId = $_POST['message_id'] ?? null;
$requesterId = $_POST['requester_id'] ?? null;

if (!$messageId || !$requesterId) {
    echo json_encode(['error' => 'Missing message_id or requester_id']);
    exit;
}

$success = $db->deleteMessage($messageId, $requesterId);
echo json_encode(['success' => $success]);
