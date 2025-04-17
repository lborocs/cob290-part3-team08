const API_PREFIX = '../server/api/chats/';

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
    ['add','promote','delete'].forEach(t => {
        document.getElementById(`${t}SubAction`).classList.add('hidden');
    });
    document.getElementById(`${type}SubAction`).classList.remove('hidden');
}

function loadUserDropdowns() {
    fetch(`${API_PREFIX}../users/getAll.php`)
      .then(res => res.json())
      .then(users => {
        const add = document.getElementById('addUserSelect');
        const prom = document.getElementById('promoteUserSelect');
        users.forEach(u => {
          const o = document.createElement('option');
          o.value = u.employee_id;
          o.textContent = `${u.first_name} ${u.second_name}`;
          add.appendChild(o);
          prom.appendChild(o.cloneNode(true));
        });
      });
}

function loadChats() {
    fetch(`${API_PREFIX}get.php?user_id=${currentUserId}`)
      .then(r => r.json())
      .then(chats => {
        const list = document.getElementById('chatList');
        list.innerHTML = '';
        chats.forEach(c => {
          const d = document.createElement('div');
          d.className = 'chat-item';
          d.textContent = c.chat_name;
          d.onclick = () => selectChat(c.chatID,c.chat_name,d);
          list.appendChild(d);
        });
      });
}

function selectChat(id,name,el) {
    currentChatId = id;
    document.getElementById('currentChatName').textContent = name;
    document.querySelectorAll('.chat-item').forEach(i=>i.classList.remove('active'));
    el.classList.add('active');
    document.querySelector('.more-btn').style.display = 'inline-block';
    document.querySelector('.message-input').style.display = 'flex';
    loadMessages(id);
    loadMembers(id);
}

function loadMembers(chatId) {
    fetch(`${API_PREFIX}getMembers.php?chat_id=${chatId}`)
      .then(r=>r.json())
      .then(data => {
        const ul = document.getElementById('memberList');
        ul.innerHTML = '';
        if (data.error) return ul.innerHTML = `<li>${data.error}</li>`;
        data.members.forEach(m => {
          const li = document.createElement('li');
          li.textContent = `${m.first_name} ${m.second_name}` + (m.is_admin ? ' (admin)' : '');
          ul.appendChild(li);
        });
      });
}

function loadMessages(chatId) {
    fetch(`${API_PREFIX}messages.php?chat_id=${chatId}`)
      .then(r=>r.json())
      .then(msgs => {
        const ml = document.getElementById('messageList');
        ml.innerHTML = '';
        msgs.forEach(m => {
          const d = document.createElement('div');
          d.className = 'message';
          d.innerHTML = `<strong>${m.sender_id}</strong>: ${m.message_contents}` +
                        (m.read_receipt ? ' <span class="read">(read)</span>' : '');
          ml.appendChild(d);
          if (!m.read_receipt && m.sender_id != currentUserId) {
            markMessageRead(m.message_id);
          }
        });
        ml.scrollTop = ml.scrollHeight;
      });
}

function markMessageRead(mid) {
    fetch(`${API_PREFIX}markRead.php`, {
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:`message_id=${mid}&user_id=${currentUserId}`
    });
}

function sendMessage() {
    const inp = document.getElementById('messageInput');
    const txt = inp.value.trim();
    if (!currentChatId || !txt) return;
    fetch(`${API_PREFIX}sendMessage.php`, {
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:`chat_id=${currentChatId}&sender_id=${currentUserId}&message=${encodeURIComponent(txt)}`
    })
    .then(r=>r.json())
    .then(r=> {
      if (r.success) {
        inp.value=''; loadMessages(currentChatId);
      }
    });
}

function createChat() {
    const inp = document.getElementById('newChatName');
    const name = inp.value.trim();
    if (!name) return;
    fetch(`${API_PREFIX}createWithAdmin.php`, {
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:`chat_name=${encodeURIComponent(name)}&creator_id=${currentUserId}`
    })
    .then(r=>r.json())
    .then(r=> {
      if (r.chat_id) { inp.value=''; loadChats(); }
    });
}

function addUserToChat() {
    const uid = document.getElementById('addUserSelect').value;
    if (!currentChatId||!uid) return;
    fetch(`${API_PREFIX}addUser.php`, {
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:`chat_id=${currentChatId}&user_id=${uid}`
    })
    .then(r=>r.json())
    .then(r=>{ if(r.success) alert('User added'); });
}

function promoteUser() {
    const uid = document.getElementById('promoteUserSelect').value;
    if (!currentChatId||!uid) return;
    fetch(`${API_PREFIX}promoteAdmin.php`, {
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:`chat_id=${currentChatId}&user_id=${uid}`
    })
    .then(r=>r.json())
    .then(r=>{ if(r.success) alert('Promoted'); });
}

function deleteChat() {
    if(!currentChatId||!confirm("Delete this chat?")) return;
    fetch(`${API_PREFIX}deleteChat.php`, {
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:`chat_id=${currentChatId}`
    })
    .then(r=>r.json())
    .then(r=>{
      if(r.success){
        alert('Deleted'); currentChatId=null;
        document.getElementById('currentChatName').textContent='Select a chat';
        document.getElementById('messageList').innerHTML='';
        document.getElementById('chatActions').classList.remove('visible');
        document.querySelector('.more-btn').style.display='none';
        document.querySelector('.message-input').style.display='none';
        loadChats();
      }
    });
}

document.addEventListener('click', e=>{
  const actions = document.getElementById('chatActions');
  const btn     = document.querySelector('.more-btn');
  if (!actions.contains(e.target) && !btn.contains(e.target)) {
    actions.classList.remove('visible');
  }
});

function toggleMembers() {
    const panel = document.getElementById('chatMembersContainer');
    panel.classList.toggle('visible');
    panel.classList.toggle('hidden');
  }
  