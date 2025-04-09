<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
$chatId = $_GET['chat_id'] ?? null;

if (!$chatId) {
    echo json_encode(['error' => 'Missing chat_id']);
    exit;
}

$stmt = $db->conn->prepare("
    SELECT * FROM ChatMessages
    WHERE chat_id = :chatId
    ORDER BY date_time ASC
");
$stmt->bindParam(':chatId', $chatId);
$stmt->execute();
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
