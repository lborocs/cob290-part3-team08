
let currentChatId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadChats();
    loadUserDropdowns();


    document.getElementById('messageInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });
    document.getElementById('newChatName').addEventListener('keypress', e => {
        if (e.key === 'Enter') createChat();
    });
});

function toggleChatActions() {
    document.getElementById('chatActions').classList.toggle('visible');
}

function showSubAction(type) {
    ['add', 'promote', 'delete'].forEach(t => {
        document.getElementById(`${t}SubAction`).classList.add('hidden');
    });
    document.getElementById(`${type}SubAction`).classList.remove('hidden');
}

function loadUserDropdowns() {
    fetch(`${BASE_URL}/server/api/users/getAll.php`)
        .then(res => res.json())
        .then(users => {
            const addSelect = document.getElementById('addUserSelect');
            const promoteSelect = document.getElementById('promoteUserSelect');
            users.forEach(user => {
                const opt = document.createElement('option');
                opt.value = user.employee_id;
                opt.textContent = `${user.first_name} ${user.second_name}`;
                addSelect.appendChild(opt);
                promoteSelect.appendChild(opt.cloneNode(true));
            });
        });
}

function loadChats() {
    fetch(`${BASE_URL}/server/api/chats/get.php?user_id=${currentUserId}`)
        .then(res => res.json())
        .then(chats => {
            const list = document.getElementById('chatList');
            list.innerHTML = '';
            chats.forEach(chat => {
                const div = document.createElement('div');
                div.className = 'chat-item';
                div.textContent = chat.chat_name;
                div.onclick = () => selectChat(chat.chatID, chat.chat_name, div);
                list.appendChild(div);
            });
        });
}

function selectChat(chatId, chatName, elem) {
    currentChatId = chatId;
    document.getElementById('currentChatName').textContent = chatName;
    document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
    elem.classList.add('active');
    document.querySelector('.more-btn').style.display = 'inline-block';
    document.querySelector('.message-input').style.display = 'flex';
    loadMessages(chatId);
}

function loadMessages(chatId) {
    fetch(`${BASE_URL}/server/api/chats/messages.php?chat_id=${chatId}`)
        .then(res => res.json())
        .then(messages => {
            const list = document.getElementById('messageList');
            list.innerHTML = '';
            messages.forEach(msg => {
                const div = document.createElement('div');
                div.className = 'message';
                div.innerHTML = `<strong>${msg.sender_id}</strong>: ${msg.message_contents}` +
                    (msg.read_receipt == 1 ? ' <span class="read">(read)</span>' : '');
                list.appendChild(div);
                if (msg.sender_id !== currentUserId && msg.read_receipt != 1) {
                    markMessageRead(msg.message_id);
                }
            });
            list.scrollTop = list.scrollHeight;
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
    const input = document.getElementById('messageInput');
    const txt = input.value.trim();
    if (!currentChatId || !txt) return;
    fetch(`${BASE_URL}/server/api/chats/sendMessage.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `chat_id=${currentChatId}&sender_id=${currentUserId}&message=${encodeURIComponent(txt)}`
    })
    .then(res => res.json())
    .then(r => {
        if (r.success) {
            input.value = '';
            loadMessages(currentChatId);
        }
    });
}

function createChat() {
    const input = document.getElementById('newChatName');
    const name = input.value.trim();
    if (!name) return;
    fetch(`${BASE_URL}/server/api/chats/createWithAdmin.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `chat_name=${encodeURIComponent(name)}&creator_id=${currentUserId}`
    })
    .then(res => res.json())
    .then(r => {
        if (r.chat_id) {
            input.value = '';
            loadChats();
        }
    });
}

function addUserToChat() {
    const uid = document.getElementById('addUserSelect').value;
    if (!currentChatId || !uid) return;
    fetch(`${BASE_URL}/server/api/chats/addUser.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `chat_id=${currentChatId}&user_id=${uid}`
    })
    .then(res => res.json())
    .then(r => {
        if (r.success) {
            alert('User added to chat');
            document.getElementById('addUserSelect').value = '';
        }
    });
}

function promoteUser() {
    const uid = document.getElementById('promoteUserSelect').value;
    if (!currentChatId || !uid) return;
    fetch(`${BASE_URL}/server/api/chats/promoteAdmin.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `chat_id=${currentChatId}&user_id=${uid}`
    })
    .then(res => res.json())
    .then(r => {
        if (r.success) {
            alert('User promoted to admin');
            document.getElementById('promoteUserSelect').value = '';
        }
    });
}

function deleteChat() {
    if (!currentChatId || !confirm("Are you sure you want to delete this chat?")) return;
    fetch(`${BASE_URL}/server/api/chats/deleteChat.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `chat_id=${currentChatId}`
    })
    .then(res => res.json())
    .then(r => {
        if (r.success) {
            alert('Chat deleted');
            currentChatId = null;
            document.getElementById('currentChatName').textContent = 'Select a chat';
            document.getElementById('messageList').innerHTML = '';
            document.getElementById('chatActions').classList.remove('visible');
            document.querySelector('.more-btn').style.display = 'none';
            document.querySelector('.message-input').style.display = 'none';
            loadChats();
        }
    });
}


document.addEventListener('click', e => {
    const actions = document.getElementById('chatActions');
    const btn = document.querySelector('.more-btn');
    if (!actions.contains(e.target) && !btn.contains(e.target)) {
        actions.classList.remove('visible');
    }
});
