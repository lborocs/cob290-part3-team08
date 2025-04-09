<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    echo json_encode(['error' => 'Missing user_id']);
    exit;
}

$stmt = $db->conn->prepare("
    SELECT C.chatID, C.chat_name
    FROM Chats C
    JOIN ChatMembers CM ON C.chatID = CM.chat_id
    WHERE CM.employee_id = :userId
");
$stmt->bindParam(':userId', $userId);
$stmt->execute();
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
