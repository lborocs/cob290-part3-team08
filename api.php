<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

function getDb() {
    $db = new SQLite3('database.db');
    $db->enableExceptions(true);
    return $db;
}

// Simple routing
$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove query string if present
$request_uri = strtok($request_uri, '?');

// Route handling
switch (true) {
    case $request_uri === '/':
        echo json_encode(['message' => 'Welcome to the Chat API!']);
        break;

    case $request_uri === '/favicon.ico':
        http_response_code(204);
        break;

    case $request_uri === '/chats' && $method === 'GET':
        $db = getDb();
        $result = $db->query('SELECT * FROM Chats');
        $chats = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $chats[] = $row;
        }
        echo json_encode($chats);
        $db->close();
        break;

    case preg_match('#^/chats/(\d+)/messages$#', $request_uri, $matches) && $method === 'GET':
        $chat_id = $matches[1];
        $db = getDb();
        $stmt = $db->prepare('SELECT * FROM Messages WHERE chat_id = :chat_id');
        $stmt->bindValue(':chat_id', $chat_id, SQLITE3_INTEGER);
        $result = $stmt->execute();
        $messages = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $messages[] = $row;
        }
        echo json_encode($messages);
        $db->close();
        break;

    case preg_match('#^/chats/(\d+)/messages$#', $request_uri, $matches) && $method === 'POST':
        $chat_id = $matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        $sender_id = $data['sender_id'] ?? null;
        $message_text = $data['message_text'] ?? null;

        if (!$sender_id || !$message_text) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            break;
        }

        $db = getDb();
        $stmt = $db->prepare('INSERT INTO Messages (chat_id, sender_id, message_text) VALUES (:chat_id, :sender_id, :message_text)');
        $stmt->bindValue(':chat_id', $chat_id, SQLITE3_INTEGER);
        $stmt->bindValue(':sender_id', $sender_id, SQLITE3_INTEGER);
        $stmt->bindValue(':message_text', $message_text, SQLITE3_TEXT);
        
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['status' => 'Message sent']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to send message']);
        }
        $db->close();
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not Found']);
        break;
} 