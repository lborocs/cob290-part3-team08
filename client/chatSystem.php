<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) {
        echo "No user selected.";
        exit;
    }
?>
<script>
  let currentUserId = <?= json_encode($userId) ?>;
  const BASE_URL = '/cob290-part3-team08';
</script>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Chat System (Full)</title>
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
    .chat-list, .chat-window {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .chat-window {
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
    .read {
      font-size: 0.8em;
      color: green;
    }
    .message-input {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    input[type="text"], input[type="number"] {
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
  <?php include __DIR__ . '/includes/navbar.php'; ?>
  <div class="container">
    <div class="chat-list">
      <h2>Chats</h2>
      <div id="chatList"></div>
      <div class="message-input">
        <input type="text" id="newChatName" placeholder="New chat name" />
        <button onclick="createChat()">Create Chat</button>
      </div>
      <div class="message-input">
        <select id="addUserSelect"></select>        
        <button onclick="addUserToChat()">Add to Chat</button>
      </div>
      <div class="message-input">
      <select id="promoteUserSelect"></select>
      <button onclick="promoteUser()">Make Admin</button>
      </div>
      <div class="message-input">
        <button style="background: red;" onclick="deleteChat()">Delete Chat</button>
      </div>
    </div>
    <div class="chat-window">
      <h2 id="currentChatName">Select a chat</h2>
      <div class="message-list" id="messageList"></div>
      <div class="message-input">
        <input type="text" id="messageInput" placeholder="Type a message..." />
        <button onclick="sendMessage()">Send</button>
      </div>
    </div>
  </div>

  <script>
    let currentChatId = null;

    document.addEventListener('DOMContentLoaded', () => {
      loadChats();
      loadUserDropdowns();
    });

    function loadUserDropdowns() {
        fetch(`${BASE_URL}/server/api/users/getAll.php`) // This should return all users with { employee_id, first_name, second_name }
            .then(res => res.json())
            .then(users => {
            const addSelect = document.getElementById('addUserSelect');
            const promoteSelect = document.getElementById('promoteUserSelect');

            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.employee_id;
                option.textContent = `${user.first_name} ${user.second_name}`;
                
                const optionClone = option.cloneNode(true);
                addSelect.appendChild(option);
                promoteSelect.appendChild(optionClone);
            });
            });
        }

    function loadChats() {
      fetch(`${BASE_URL}/server/api/chats/get.php?user_id=` + currentUserId)
        .then(res => res.json())
        .then(chats => {
          const chatList = document.getElementById('chatList');
          chatList.innerHTML = '';
          chats.forEach(chat => {
            const div = document.createElement('div');
            div.className = 'chat-item';
            div.textContent = chat.chat_name;
            div.onclick = () => selectChat(chat.chatID, chat.chat_name);
            chatList.appendChild(div);
          });
        });
    }

    function selectChat(chatId, chatName) {
      currentChatId = chatId;
      document.getElementById('currentChatName').textContent = chatName;
      document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
      event.target.classList.add('active');
      loadMessages(chatId);
    }

    function loadMessages(chatId) {
      fetch(`${BASE_URL}/server/api/chats/messages.php?chat_id=` + chatId)
        .then(res => res.json())
        .then(messages => {
          const messageList = document.getElementById('messageList');
          messageList.innerHTML = '';
          messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = 'message';
            div.innerHTML = `<strong>${msg.sender_id}</strong>: ${msg.message_contents}` + 
                            (msg.read_receipt == 1 ? ' <span class="read">(read)</span>' : '');
            messageList.appendChild(div);
            if (msg.sender_id !== currentUserId && msg.read_receipt != 1) {
              markMessageRead(msg.message_id);
            }
          });
          messageList.scrollTop = messageList.scrollHeight;
        });
    }

    function markMessageRead(messageId) {
      fetch(`${BASE_URL}/server/api/chats/markRead.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `message_id=${messageId}&user_id=${currentUserId}`
      });
    }

    function sendMessage() {
      if (!currentChatId) return;
      const input = document.getElementById('messageInput');
      const message = input.value.trim();
      if (message) {
        fetch(`${BASE_URL}/server/api/chats/sendMessage.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `chat_id=${currentChatId}&sender_id=${currentUserId}&message=${encodeURIComponent(message)}`
        })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            input.value = '';
            loadMessages(currentChatId);
          }
        });
      }
    }

    function createChat() {
      const input = document.getElementById('newChatName');
      const name = input.value.trim();
      if (name) {
        fetch(`${BASE_URL}/server/api/chats/createWithAdmin.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `chat_name=${encodeURIComponent(name)}&creator_id=${currentUserId}`
        })
        .then(res => res.json())
        .then(result => {
          if (result.chat_id) {
            input.value = '';
            loadChats();
          }
        });
      }
    }

    function addUserToChat() {
        const userId = document.getElementById('addUserSelect').value;
        if (currentChatId && userId) {
            fetch(`${BASE_URL}/server/api/chats/addUser.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `chat_id=${currentChatId}&user_id=${userId}`
            })
            .then(res => res.json())
            .then(result => {
            if (result.success) {
                alert('User added to chat');
                document.getElementById('addUserSelect').value = '';
            }
            });
        }
        }


    function promoteUser() {
        const userId = document.getElementById('promoteUserSelect').value;
        if (currentChatId && userId) {
            fetch(`${BASE_URL}/server/api/chats/promoteAdmin.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `chat_id=${currentChatId}&user_id=${userId}`
            })
            .then(res => res.json())
            .then(result => {
            if (result.success) {
                alert('User promoted to admin');
                document.getElementById('promoteUserSelect').value = '';
            }
            });
        }
        }


    function deleteChat() {
      if (currentChatId && confirm("Are you sure you want to delete this chat?")) {
        fetch(`${BASE_URL}/server/api/chats/deleteChat.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `chat_id=${currentChatId}`
        })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            alert('Chat deleted');
            currentChatId = null;
            document.getElementById('currentChatName').textContent = 'Select a chat';
            document.getElementById('messageList').innerHTML = '';
            loadChats();
          }
        });
      }
    }

    document.getElementById('messageInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    document.getElementById('newChatName').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') createChat();
    });
  </script>
</body>
</html>
