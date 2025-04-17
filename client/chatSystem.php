<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Chat System (Full)</title>
  <link rel="stylesheet" href="../server/api/chats/chatSystem.css">
</head>
<body>
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

  <!-- navbar include -->
  <?php include __DIR__ . '/includes/navbar.php'; ?>

  <div class="container-wrapper">
    <div class="container">
      <!-- chat list -->
      <div class="chat-list">
        <h2>Chats</h2>
        <div id="chatList"></div>
        <div class="new-chat-input">
          <input type="text" id="newChatName" placeholder="New chat name" />
          <button onclick="createChat()">Create Chat</button>
        </div>
      </div>

      <!-- chat window -->
      <div class="chat-window">
        <div class="chat-header">
          <h2 id="currentChatName">Select a chat</h2>
          <button class="more-btn" onclick="toggleChatActions()">⋯</button>
          <div class="chat-actions" id="chatActions">
            <div class="action-buttons">
              <button onclick="showSubAction('add')">Add User</button>
              <button onclick="showSubAction('promote')">Make Admin</button>
              <button onclick="showSubAction('delete')">Delete Chat</button>
            </div>
            <div id="addSubAction" class="sub-action hidden">
              <select id="addUserSelect"></select>
              <button onclick="addUserToChat()">Confirm</button>
            </div>
            <div id="promoteSubAction" class="sub-action hidden">
              <select id="promoteUserSelect"></select>
              <button onclick="promoteUser()">Confirm</button>
            </div>
            <div id="deleteSubAction" class="sub-action hidden">
              <button class="delete-confirm-btn" onclick="deleteChat()">Confirm</button>
            </div>
          </div>
        </div>
        <div class="message-list" id="messageList"></div>
        <div class="message-input">
          <input type="text" id="messageInput" placeholder="Type a message..." />
          <button onclick="sendMessage()">Send</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentUserId = <?= json_encode($userId) ?>;
    const BASE_URL = '/cob290-part3-team08';
  </script>
  <!-- external JavaScript -->
  <script src="../server/api/chats/chatSystem.js"></script>
</body>
</html>
