//adjust this if your path is different
const API_BASE = "/makeitall/cob290-part3-team08/server/api/chats/index.php"

//promoting to admin, only non-admin members in the members list
function rebuildPromoteSelect(members) {
  const sel = document.getElementById("promoteUserSelect")
  if (!sel) return

  sel.innerHTML = '<option value="">— choose —</option>'

  members
    .filter((m) => !m.is_admin)
    .forEach((m) => {
      const opt = document.createElement("option")
      opt.value = m.employee_id
      opt.textContent = `${m.first_name} ${m.second_name}`
      sel.appendChild(opt)
    })
}

//checks the id of chat and if user is admin on the chat
let currentChatId = null
let currentIsAdmin = false

//queue for adding members to chat
let allEmployees = []
let queue = []

//simpler way to select elems instead of always writing document.querySelector
const $ = (sel) => document.querySelector(sel)

//these are helper functions that do certain things
//like clears the UI after a chat has been made so no redundant text is left
function resetChatUI() {
  currentChatId = null
  currentIsAdmin = false

  $("#currentChatName").textContent = "Select a chat"
  $(".message-input").style.display = "none"
  $("#leaveBtn").style.display = "none"
  $(".more-btn").style.display = "none"
  $("#messageInput").disabled = true

  $("#messageList").innerHTML = ""
  $("#memberList").innerHTML = ""
  $("#addUserSelect").selectedIndex = 0
  $("#promoteUserSelect").innerHTML = '<option value="">— choose —</option>'
  queue = []
  renderQueue()
  closeAdminMenus()
}

function clearInputs() {
  $("#newChatName").value = ""
  $("#messageInput").value = ""
}

function renderQueue() {
  const ul = $("#pendingList")
  ul.innerHTML = ""
  queue.forEach((id) => {
    const emp = allEmployees.find((e) => e.employee_id === id)
    if (!emp) return
    const li = document.createElement("li")
    li.className = "pill"
    li.textContent = `${emp.first_name} ${emp.second_name}`
    const x = document.createElement("span")
    x.textContent = "✖"
    x.onclick = () => {
      queue = queue.filter((q) => q !== id)
      renderQueue()
    }
    li.appendChild(x)
    ul.appendChild(li)
  })
}

//Runs once to load the employees then their chats
//deals with "enter" as a shortcut
//deals with the queue array for pending user add

document.addEventListener("DOMContentLoaded", () => {
  resetChatUI()
  loadUserDropdowns().then(() => loadChats())

  $("#messageSearchInput").addEventListener("input", () => {
    if (currentChatId) loadMessages(currentChatId)
  })
  
  document.getElementById("chatSearchInput").addEventListener("input", (e) => {
    loadChats(e.target.value)
  })  

  
  $("#senderSearchSelect").addEventListener("change", () => {
    if (currentChatId) loadMessages(currentChatId)
  })
  
  $("#messageInput").addEventListener(
    "keypress",
    (e) => e.key === "Enter" && sendMessage()
  )

  $("#newChatName").addEventListener(
    "keypress",
    (e) => e.key === "Enter" && createChat()
  )

  $("#userSearch").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") return
    queueFromInput(e.target)
  })

  $("#userSearch").addEventListener("change", (e) => queueFromInput(e.target))

  // this function is a helper function that takes the input and adds it to the array
  function queueFromInput(input) {
    const id = +input.value
    if (id && !queue.includes(id)) {
      queue.push(id)
      renderQueue()
    }
    input.value = ""
  }

  $("#addUserSelect").addEventListener("change", (e) => {
    const id = +e.target.value
    if (id && !queue.includes(id)) {
      queue.push(id)
      renderQueue()
    }
    e.target.selectedIndex = 0
  })
})

//this function uses the getAll.php to get all the employees from the database
//it then populates the dropdowns with the employees
//it also populates the list of employees in the admin menu
function loadUserDropdowns() {
  return fetch("../server/api/users/getAll.php")
    .then((r) => r.json())
    .then((users) => {
      allEmployees = users

      const sel = $("#addUserSelect")
      const frag1 = document.createDocumentFragment()
      sel.innerHTML = '<option value="">— pick —</option>'
      users.forEach((u) => {
        const opt = document.createElement("option")
        opt.value = u.employee_id
        opt.textContent = `${u.first_name} ${u.second_name}`
        frag1.appendChild(opt)
      })
      sel.appendChild(frag1)

      const dl = $("#allEmployees")
      const frag2 = document.createDocumentFragment()
      users.forEach((u) => {
        const o = document.createElement("option")
        o.value = u.employee_id
        o.label = `${u.first_name} ${u.second_name}`
        frag2.appendChild(o)
      })
      dl.appendChild(frag2)
    })
}

//this function helps with adding the queued users to the chat

function addQueued() {
  if (!queue.length) return
  //this basically creates more than one fetch and then waits for all to be finished
  //then it alerts the user how many users were added
  const promises = queue.map((uid) =>
    fetch(`${API_BASE}/${currentChatId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: uid, is_admin: false }),
    })
  )
  Promise.all(promises).then(() => {
    alert(queue.length + " user(s) added")
    queue = []
    renderQueue()
    loadMembers(currentChatId)
    closeAdminMenus()
  })
}

//this function helps with getting the chats that the current user is part of
function loadChats(searchTerm = "") {
  fetch(API_BASE, { method: "GET" })
    .then((r) => r.json())
    .then((chats) => {
      const list = document.getElementById("chatList")
      list.innerHTML = ""

      const filtered = chats.filter((c) =>
        c.chat_name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      filtered.forEach((c) => {
        const div = document.createElement("div")
        div.className = "chat-item"
        div.textContent = c.chat_name
        div.onclick = () => selectChat(c.chatID, c.chat_name, div)
        list.appendChild(div)
      })
    })
}


//this function brings up the chat when the user clicks on one on the left
//it also highlights the chosen chat
//if the user is an admin it shows the admin menu
function selectChat(id, name, elem) {
  currentChatId = id
  document.getElementById("currentChatName").textContent = name
  document.getElementById("chatHeader").classList.remove("hidden")


  document
    .querySelectorAll(".chat-item")
    .forEach((i) => i.classList.remove("active"))
  elem.classList.add("active")

  document.querySelector(".message-input").style.display = "flex"
  document.getElementById("leaveBtn").style.display = "inline-block"
  document.getElementById("messageInput").disabled = false

  loadMessages(id)
  loadMembers(id).then((isAdmin) => {
    currentIsAdmin = isAdmin
    const canManage = isAdmin || currentUserType < 2
    document.querySelector(".more-btn").style.display = canManage
      ? "inline-block"
      : "none"
    if (!canManage) closeAdminMenus()
  })
}

//this function deals with kicking people from the chat by using the x next to their name on the members list
//it also adds an admin label if the member has privileges (is_admin on current chat or < 2 user type)
function loadMembers(chatId) {
  return fetch(`${API_BASE}/${chatId}/members`, { method: "GET" })
    .then((r) => r.json())
    .then((data) => {
      currentIsAdmin = data.members.some(
        (m) =>
          String(m.employee_id) === String(currentUserId) && m.is_admin == true
      )

      const ul = document.getElementById("memberList")
      const senderDropdown = document.getElementById("senderSearchSelect")
      if (senderDropdown) {
        senderDropdown.innerHTML = '<option value="">— All Senders —</option>'
        data.members.forEach((m) => {
          const opt = document.createElement("option")
          opt.value = m.employee_id
          opt.textContent = `${m.first_name} ${m.second_name}`
          senderDropdown.appendChild(opt)
        })
      }

      ul.innerHTML = ""

      data.members.forEach((m) => {
        const li = document.createElement("li")
        li.textContent =
          `${m.first_name} ${m.second_name}` + (m.is_admin ? " (admin)" : "")

        if (currentIsAdmin && m.employee_id !== currentUserId) {
          const btn = document.createElement("button")
          btn.textContent = "✖"
          btn.className = "kick-btn"
          btn.onclick = (e) => {
            e.stopPropagation()
            removeUser(m.employee_id)
          }
          li.appendChild(btn)
        }

        ul.appendChild(li)
      })

      rebuildPromoteSelect(data.members)

      return currentIsAdmin
    })
}

//function to retrieve and show messages for a specific chat
//each message gets assgined its own div so basically iterating over the messages
//adds a (read) receipt if the message has been read, edited if message has been edited

function loadMessages(chatId) {
  fetch(`${API_BASE}/${chatId}/messages`, { method: "GET" })
    .then((r) => r.json())
    .then((msgs) => {
      const pane = document.getElementById("messageList")
      pane.innerHTML = ""

      let lastSenderId = null
      let lastDate = null

      //get filter inputs
      const keyword = ($("#messageSearchInput")?.value || "").toLowerCase()
      const senderId = $("#senderSearchSelect")?.value

      msgs
        .filter((m) => {
          const contentMatch = m.message_contents.toLowerCase().includes(keyword)
          const senderMatch = !senderId || String(m.sender_id) === senderId
          return contentMatch && senderMatch
        })
        .forEach((m) => {
          const isOwnMessage = String(m.sender_id) === String(currentUserId)
          const msgDate = new Date(m.date_time)
          const msgDay = msgDate.toDateString()
          const timeStr = msgDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })

          //date divider
          if (msgDay !== lastDate) {
            const divider = document.createElement("div")
            divider.className = "date-divider"
            divider.textContent = getDateLabel(msgDate)
            pane.appendChild(divider)
            lastDate = msgDay
          }

          const showMeta = m.sender_id !== lastSenderId
          lastSenderId = m.sender_id

          const wrappedText = wrapText(m.message_contents, 60, keyword)

          const wrapper = document.createElement("div")
          wrapper.className =
            "message-wrapper" +
            (isOwnMessage ? " own" : "") +
            (showMeta ? "" : " grouped")

          wrapper.innerHTML = `
            ${showMeta ? `
              <div class="message-meta">
                ${m.profile_picture_path
                  ? `<img class="profile-pic" src="../${m.profile_picture_path}" alt="profile">`
                  : `<div class="profile-pic placeholder"></div>`}
                <div class="meta-text">
                  <div class="sender-name">${m.first_name} ${m.second_name}</div>
                  <div class="message-time">${timeStr}</div>
                </div>
              </div>` : `<div class="message-meta spacer"></div>`}

            ${isOwnMessage ? `
              <div class="message-options-top">
                <button class="options-btn" onclick="toggleMessageMenu(this)">⋯</button>
                <div class="options-menu hidden">
                  <button onclick="deleteMessage(${m.message_id})">Delete</button>
                  <button onclick="editMessage(${m.message_id}, \`${m.message_contents.replace(/`/g, "\\`")}\`)">Edit</button>
                </div>
              </div>` : ""}

            <div class="message-bubble-container">
              <div class="message-bubble" id="msg-${m.message_id}">
                ${wrappedText}
              </div>
              <div class="message-edit hidden" id="edit-${m.message_id}">
                <textarea class="edit-input">${m.message_contents}</textarea>
                <div class="edit-actions">
                  <button onclick="saveEdit(${m.message_id})">Save</button>
                  <button onclick="cancelEdit(${m.message_id})">Cancel</button>
                </div>
              </div>
            </div>

            ${isOwnMessage && m.read_receipt ? `<div class="message-read">Read</div>` : ""}
            ${m.is_edited ? `<div class="message-edited">Edited</div>` : ""}
          `
          pane.appendChild(wrapper)

          if (!m.read_receipt && !isOwnMessage) {
            markMessageRead(m.message_id)
          }
        })

      pane.scrollTop = pane.scrollHeight
    })
}


//helper to display “Today”, “Yesterday” etc.
function getDateLabel(date) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thatDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const diff = (today - thatDay) / (1000 * 60 * 60 * 24)
  if (diff === 0) return "Today"
  if (diff === 86400000) return "Yesterday"
  return date.toLocaleDateString()
}

//updates read status, function is called from the one above ^^
function markMessageRead(msgId) {
  fetch(`${API_BASE}/${currentChatId}/messages/${msgId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ read: true }),
  })
}

//this function handles the action of sending a new message
function sendMessage() {
  const ipt = document.getElementById("messageInput")
  const txt = ipt.value.trim()
  if (!currentChatId || !txt) return

  fetch(`${API_BASE}/${currentChatId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: txt }),
  }).then((r) => {
    if (r.status === 201) {
      ipt.value = ""
      loadMessages(currentChatId)
    }
  })
}

//this function creates conversations in the system and makes sure that the name is not empy for the creation
function createChat() {
  const name = document.getElementById("newChatName").value.trim()
  if (!name) return

  fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_name: name }),
  }).then((r) => {
    if (r.status === 201) {
      clearInputs()
      loadChats()
    }
  })
}

//this function handles adding a single user to the chat
function addUserToChat() {
  const sel = document.getElementById("addUserSelect")
  const uid = +sel.value
  if (!uid) return
  fetch(`${API_BASE}/${currentChatId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: uid, is_admin: false }),
  }).then((r) => {
    if (r.status === 201) {
      alert("User added")
      sel.value = ""
      loadMembers(currentChatId)
      closeAdminMenus()
    } else {
      alert("Could not add user (error " + r.status + ")")
    }
  })
}

//function that handles the promotion to an admin
function promoteUser() {
  const sel = document.getElementById("promoteUserSelect")
  const uid = +sel.value
  if (!uid) return
  fetch(`${API_BASE}/${currentChatId}/members/${uid}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_admin: true }),
  }).then((r) => {
    if (r.status === 204) {
      alert("Promoted to admin")
      sel.value = ""
      loadMembers(currentChatId)
      closeAdminMenus()
    } else {
      alert("Could not promote (error " + r.status + ")")
    }
  })
}

//function that deletes chats entirely from database and from all users
//just as a simple explanation when the server receives the delete request it basically runs the DELETE
//in database.php
function deleteChat() {
  if (!currentChatId || !confirm("Delete this chat?")) return

  fetch(`${API_BASE}/${currentChatId}`, { method: "DELETE" }).then((r) => {
    if (r.status === 204) {
      resetChatUI()
      loadChats()
    }
  })
}

//function to toggle message options
function toggleMessageMenu(button) {
  const menu = button.nextElementSibling
  document.querySelectorAll(".options-menu").forEach((el) => {
    if (el !== menu) el.classList.add("hidden")
  })
  menu.classList.toggle("hidden")
  event.stopPropagation()
}

//function that deletes message from chat
function deleteMessage(messageId) {
  if (!confirm("Delete this message?")) return

  fetch(`${API_BASE}/${currentChatId}/messages/${messageId}`, {
    method: "DELETE",
  }).then((r) => {
    if (r.status === 204) {
      loadMessages(currentChatId)
    } else {
      alert("Failed to delete message.")
    }
  })
}

//function that shows edit message box
function editMessage(messageId, originalText) {
  document.getElementById(`msg-${messageId}`).classList.add("hidden")
  document.getElementById(`edit-${messageId}`).classList.remove("hidden")
}

//function that closes edit message box
function cancelEdit(messageId) {
  document.getElementById(`msg-${messageId}`).classList.remove("hidden")
  document.getElementById(`edit-${messageId}`).classList.add("hidden")
}

//function that edits message
function saveEdit(messageId) {
  const textarea = document.querySelector(`#edit-${messageId} .edit-input`)
  const newText = textarea.value.trim()
  if (!newText) return alert("Message cannot be empty.")

  fetch(`${API_BASE}/${currentChatId}/messages/${messageId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message_contents: newText }),
  }).then((r) => {
    if (r.status === 204) {
      loadMessages(currentChatId)
    } else {
      alert("Failed to save edit.")
    }
  })
}

//hide open menus on outside click
document.addEventListener("click", () => {
  document
    .querySelectorAll(".options-menu")
    .forEach((el) => el.classList.add("hidden"))
})

//this function allows users to leave chats
//again makes a delete request to the members endpoint which removes the chat just from that user
function leaveChat() {
  if (!currentChatId || !confirm("Leave this chat?")) return

  fetch(`${API_BASE}/${currentChatId}/members/${currentUserId}`, {
    method: "DELETE",
  }).then((r) => {
    if (r.status === 204) {
      resetChatUI()
      loadChats()
    } else if (r.status === 409) {
      alert("You are the only admin.\nPromote another user before leaving.")
    } else {
      alert("Could not leave chat (error " + r.status + ")")
    }
  })
}

//kicks users from chat (admin functionality)
function removeUser(userId) {
  if (!currentChatId) return
  if (!confirm("Remove this user from the chat?")) return

  fetch(`${API_BASE}/${currentChatId}/members/${userId}`, {
    method: "DELETE",
  }).then((r) => {
    if (r.status === 204) {
      loadMembers(currentChatId)
    } else if (r.status === 409) {
      alert("Cannot remove the last admin.")
    } else {
      alert("Could not remove user (error " + r.status + ")")
    }
  })
}

//hides the admin menu for non-admins and also hides it after an operation is doen such as adding a user
function closeAdminMenus() {
  document.getElementById("chatActions").classList.remove("visible")
  ;["add", "promote", "delete"].forEach((t) =>
    document.getElementById(`${t}SubAction`).classList.add("hidden")
  )
}

//this function basically brings the menu up when the user clicks on the toggle
function toggleChatActions() {
  document.getElementById("chatActions").classList.toggle("visible")
}

//long text messages wrap to next line
function wrapText(text, maxLen = 60, keyword = "") {
  if (keyword) {
    const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // escape special chars
    const regex = new RegExp(`(${safeKeyword})`, "gi")
    text = text.replace(regex, "<mark>$1</mark>")
  }
  return text.replace(new RegExp(`(.{1,${maxLen}})(\\s|$)`, "g"), "$1\n").trim()
}


//this function basically shows the list of participants and lets you hide or unhide the list
function toggleMembers() {
  const panel = document.getElementById("chatMembersContainer")
  panel.classList.toggle("hidden")
  panel.classList.toggle("visible")
}

//when clicking outside the box it hides the menu
document.addEventListener("click", (e) => {
  const menu = document.getElementById("chatActions")
  const btn = document.querySelector(".more-btn")
  if (!menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove("visible")
  }
})

//this function basically hides the subactions of the menu
function showSubAction(type) {
  ;["add", "promote", "delete"].forEach((t) =>
    document.getElementById(`${t}SubAction`).classList.add("hidden")
  )
  document.getElementById(`${type}SubAction`).classList.toggle("hidden")
}
