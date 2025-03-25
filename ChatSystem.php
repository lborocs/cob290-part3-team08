<?php
/**
 * ChatSystem.php
 * This file contains both the frontend interface and backend logic for the chat system
 * 
 * How to use:
 * 1. Make sure you have XAMPP installed
 * 2. Place this file in your XAMPP htdocs folder
 * 3. Access it through: http://localhost/ChatSystem.php
 */

require_once 'database.php';

// Initialize database connection
$db = new Database();

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    
    switch ($_POST['action']) {
        case 'createChat':
            $name = $_POST['name'] ?? '';
            if ($name) {
                $result = $db->createChat($name);
                echo json_encode(['success' => $result]);
            }
            break;
            
        case 'sendMessage':
            $chat_id = $_POST['chat_id'] ?? null;
            $sender_id = $_POST['sender_id'] ?? null;
            $message_text = $_POST['message_text'] ?? '';
            
            if ($chat_id && $sender_id && $message_text) {
                $result = $db->createMessage($chat_id, $sender_id, $message_text);
                echo json_encode(['success' => $result]);
            }
            break;
            
        case 'getMessages':
            $chat_id = $_POST['chat_id'] ?? null;
            if ($chat_id) {
                $messages = $db->getMessages($chat_id);
                echo json_encode($messages);
            }
            break;
            
        case 'getChats':
            $chats = $db->getAllChats();
            echo json_encode($chats);
            break;
            
        case 'getUsers':
            $users = $db->getAllUsers();
            echo json_encode($users);
            break;
    }
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat System</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f0f2f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 20px;
        }
        .chat-list {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .chat-window {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
        }
        .message-list {
            flex-grow: 1;
            overflow-y: auto;
            margin-bottom: 20px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
        }
        .message {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 4px;
            background: white;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .message-input {
            display: flex;
            gap: 10px;
        }
        input[type="text"] {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            padding: 10px 20px;
            background: #0084ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #0073e6;
        }
        .chat-item {
            padding: 10px;
            margin-bottom: 5px;
            cursor: pointer;
            border-radius: 4px;
        }
        .chat-item:hover {
            background: #f0f2f5;
        }
        .chat-item.active {
            background: #e4e6eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="chat-list">
            <h2>Chats</h2>
            <div id="chatList"></div>
            <div class="message-input">
                <input type="text" id="newChatName" placeholder="New chat name">
                <button onclick="createChat()">Create Chat</button>
            </div>
        </div>
        <div class="chat-window">
            <h2 id="currentChatName">Select a chat</h2>
            <div class="message-list" id="messageList"></div>
            <div class="message-input">
                <input type="text" id="messageInput" placeholder="Type a message...">
                <button onclick="sendMessage()">Send</button>
            </div>
        </div>
    </div>

    <script>
        let currentChatId = null;
        let currentUserId = 1; // In a real app, this would come from user authentication

        // Load chats on page load
        document.addEventListener('DOMContentLoaded', () => {
            loadChats();
        });

        function loadChats() {
            fetch('ChatSystem.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=getChats'
            })
            .then(response => response.json())
            .then(chats => {
                const chatList = document.getElementById('chatList');
                chatList.innerHTML = '';
                chats.forEach(chat => {
                    const div = document.createElement('div');
                    div.className = 'chat-item';
                    div.textContent = chat.name;
                    div.onclick = () => selectChat(chat.id, chat.name);
                    chatList.appendChild(div);
                });
            });
        }

        function selectChat(chatId, chatName) {
            currentChatId = chatId;
            document.getElementById('currentChatName').textContent = chatName;
            document.querySelectorAll('.chat-item').forEach(item => {
                item.classList.remove('active');
            });
            event.target.classList.add('active');
            loadMessages(chatId);
        }

        function loadMessages(chatId) {
            fetch('ChatSystem.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=getMessages&chat_id=${chatId}`
            })
            .then(response => response.json())
            .then(messages => {
                const messageList = document.getElementById('messageList');
                messageList.innerHTML = '';
                messages.forEach(message => {
                    const div = document.createElement('div');
                    div.className = 'message';
                    div.textContent = `${message.sender_id}: ${message.message_text}`;
                    messageList.appendChild(div);
                });
                messageList.scrollTop = messageList.scrollHeight;
            });
        }

        function sendMessage() {
            if (!currentChatId) return;
            
            const messageInput = document.getElementById('messageInput');
            const messageText = messageInput.value.trim();
            
            if (messageText) {
                fetch('ChatSystem.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `action=sendMessage&chat_id=${currentChatId}&sender_id=${currentUserId}&message_text=${encodeURIComponent(messageText)}`
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        messageInput.value = '';
                        loadMessages(currentChatId);
                    }
                });
            }
        }

        function createChat() {
            const nameInput = document.getElementById('newChatName');
            const chatName = nameInput.value.trim();
            
            if (chatName) {
                fetch('ChatSystem.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `action=createChat&name=${encodeURIComponent(chatName)}`
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        nameInput.value = '';
                        loadChats();
                    }
                });
            }
        }

        // Handle Enter key in message input
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Handle Enter key in new chat input
        document.getElementById('newChatName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                createChat();
            }
        });
    </script>
</body>
</html> 