<?php
session_start();
if (empty($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}
$userId = $_SESSION['user_id'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Chat System (Full)</title>
  <link rel="stylesheet" href="../server/api/chats/chatSystem.css" />
</head>
<body>
  <?php
    include __DIR__ . '/includes/navbar.php';
  ?>

  <div class="container-wrapper">
    <div class="container">
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
          <button id="membersBtn" class="icon-btn" title="Show members" onclick="toggleMembers()">👥</button>
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

        <div class="chat-members hidden" id="chatMembersContainer">
          <h3>Members</h3>
          <ul id="memberList"></ul>
        </div>

        <div class="message-list" id="messageList"></div>
        <div class="message-input">
          <input type="text" id="messageInput" placeholder="Type a message…" />
          <button onclick="sendMessage()">Send</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentUserId = <?= json_encode($userId) ?>;
  </script>
  <script src="../server/api/chats/chatSystem.js"></script>
</body>
</html>
