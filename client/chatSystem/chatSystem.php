<?php

$userId = $_GET['user_id'] || null;


?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Chat System (Full)</title>
  <link rel="stylesheet" href="css/chatSystem.css" />
</head>

<body>
  <?php include __DIR__ . '/../includes/navbar.php'; ?>

  <div class="container-wrapper">
    <div class="container">
      <div class="chat-list">
        <div class="chat-list-content">
          <h2>Chats</h2>
          <input type="text" id="chatSearchInput" placeholder="Search" />
          <div id="chatList" class="chat-list-scroll"></div>
        </div>

        <div class="new-chat-input">
          <input type="text" id="newChatName" placeholder="New chat name" />
          <button onclick="createChat()">Create Chat</button>
        </div>
      </div>



      <div class="chat-window">
        <div <div class="chat-header hidden" id="chatHeader">
          <h2 id="currentChatName">Select a chat</h2>
          <button id="membersBtn" class="icon-btn" title="Show members" onclick="toggleMembers()">👥</button>

          <div class="message-search-controls">
            <input type="text" id="messageSearchInput" placeholder="Search messages..." />
            <select id="senderSearchSelect">
              <option value="">Filter By Sender</option>
            </select>
          </div>



          <button class="more-btn" onclick="toggleChatActions()">⋯</button>


          <div class="chat-actions" id="chatActions">
            <div class="action-buttons">
              <button onclick="showSubAction('add')">Add User</button>
              <button onclick="showSubAction('promote')">Make Admin</button>
              <button onclick="showSubAction('delete')">Delete Chat</button>
            </div>


            <div id="addSubAction" class="sub-action hidden">
              <select id="addUserSelect">
                <option value="">— pick —</option>
              </select>
              <input id="userSearch" list="allEmployees" placeholder="type a name, press Enter" autocomplete="off">

              <datalist id="allEmployees"></datalist>

              <ul id="pendingList" class="pending"></ul>

              <button onclick="addQueued()">Add&nbsp;all</button>
            </div>

            <div id="promoteSubAction" class="sub-action hidden">
              <select id="promoteUserSelect">
                <option value="">— choose —</option>
              </select>
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
          <textarea id="messageInput" rows="2" maxlength="500" placeholder="Type a message..."></textarea>
          <button onclick="sendMessage()">Send</button>
        </div>

        <button id="leaveBtn" class="leave-btn" style="display:none;" onclick="leaveChat()">Leave chat</button>
      </div>
    </div>
  </div>

  <script>
    let currentUserId = <?= json_encode($userId) ?>;
  </script>
  <script src="javaScript/chatSystem.js"></script>
</body>

</html>