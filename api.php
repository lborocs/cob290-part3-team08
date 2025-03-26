<?php
require_once 'Database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$db = new Database(); // Use the MySQL Database class

$requestUri = strtok($_SERVER['REQUEST_URI'], '?');
$method = $_SERVER['REQUEST_METHOD'];

// Route handling
switch (true) {
    case $requestUri === '/':
        echo json_encode(['message' => 'Welcome to the Chat API!']);
        break;

    case $requestUri === '/favicon.ico':
        http_response_code(204);
        break;

    case $requestUri === '/chats' && $method === 'GET':
        $chats = $db->getAllChats();
        echo json_encode($chats);
        break;

    case preg_match('#^/chats/(\d+)/messages$#', $requestUri, $matches) && $method === 'GET':
        $chatId = $matches[1];
        $messages = $db->getMessages($chatId);
        echo json_encode($messages);
        break;

    case preg_match('#^/chats/(\d+)/messages$#', $requestUri, $matches) && $method === 'POST':
        $chatId = $matches[1];
        $data = json_decode(file_get_contents('php://input'), true);

        $senderId = $data['sender_id'] ?? null;
        $messageText = $data['message_text'] ?? null;

        if (!$senderId || !$messageText) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            break;
        }

        if ($db->createMessage($chatId, $senderId, $messageText)) {
            http_response_code(201);
            echo json_encode(['status' => 'Message sent']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to send message']);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not Found']);
        break;
}
?>
