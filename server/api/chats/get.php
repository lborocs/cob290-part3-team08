<?php
require_once '../../includes/database.php';
require_once '../../includes/headers.php';

$db = new Database();
$userId = $_GET['user_id'] ?? null;

header('Content-Type: application/json');

if (!$userId) {
    echo json_encode(['error' => 'Missing user_id']);
    exit;
}

echo json_encode($db->getUserChats($userId));
?>
