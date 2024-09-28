let openChat = false;
let chatId = null;
let seen = false;
let notiMessage = {};
let num = 1;
const CONTENT_CHAT = document.querySelector(".chat-window");
const WELCOME_MESSAGE = document.querySelector(".welcome-message");
const userId = Number(localStorage.getItem("userId"));
let chatList = document.querySelector(".chat-list");
const socket = new WebSocket("ws://localhost:3200");

function formatDate(date_) {
    const date = new Date(date_);        
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const hourFormat = `${hours}:${minutes}`;
    return hourFormat;
}

function loadedLastMessage(empty, chat, last_message = null, unread_count = []) {
    console.log(unread_count);
    if (empty && last_message == null) {
        chatList.innerHTML += 
            `<div class="chat-item" data-id="${chat.chat_id}">
                <div class="profile-picture"></div>
                <div class="chat-item-content">
                    <div class="chat-item-header">
                        <div class="chat-item-name">${chat.other_user_name}</div>
                        <div class="chat-item-time">10:30 PM</div>
                    </div>  
                    <div class="chat-item-message">
                        <span>Oe hableme</span>
                        <div class="message-status">
                            <div class="checkmark"></div>
                        </div>
                    </div>
                </div>
            </div>`;
    } else if (last_message)  {
        const hourFormat = formatDate(last_message[0].sent_at);
        const messageText = last_message[0].message_text;
        const checkmarkOpacity = last_message[0].id_sender === userId ? "1" : "0";
        if (unread_count[0].unread_messages_count > 0) {
            chatList.innerHTML += 
                `<div class="chat-item" data-id="${chat.chat_id}">
                    <div class="profile-picture"></div>
                    <div class="chat-item-content">
                        <div class="chat-item-header">
                            <div class="chat-item-name">${chat.other_user_name}</div>
                            <div class="chat-item-time">${hourFormat}</div>
                        </div>  
                        <div class="chat-item-message">
                            <span>${messageText}</span>
                            <div class="message-status">
                                <div class="unread-count" style="opacity: 1">${unread_count[0].unread_messages_count}</div>
                                <div class="checkmark" style="opacity: 0"></div>
                            </div>
                        </div>
                    </div>
                </div>`;
        } else {
            chatList.innerHTML += 
                `<div class="chat-item" data-id="${chat.chat_id}">
                    <div class="profile-picture"></div>
                    <div class="chat-item-content">
                        <div class="chat-item-header">
                            <div class="chat-item-name">${chat.other_user_name}</div>
                            <div class="chat-item-time">${hourFormat}</div>
                        </div>  
                        <div class="chat-item-message">
                            <span>${messageText}</span>
                            <div class="message-status">
                                <div class="unread-count" style="opacity: 0">${unread_count[0].unread_messages_count}</div>
                                <div class="checkmark" style="opacity: ${checkmarkOpacity};"></div>
                            </div>
                        </div>
                    </div>
                </div>`;
        }
    }
}

function renderMessage(messageData) {
    const messageschat = CONTENT_CHAT.querySelector(".chat-messages");
    let message = document.createElement("div");
    message.classList.add("message");
    message.innerHTML = messageData.message;
    if (userId === messageData.id_sender) {
        message.classList.add("message-sent");                        
    } else {
        message.classList.add("message-received");
    }
    messageschat.appendChild(message);
}

function showMessages(chat, messages) {
    if (chat) {
        let chatContent = chat.querySelector(".chat-item-content");
        let chatContentHeader = chatContent.querySelector(".chat-item-header");
        let namechat = chatContentHeader.querySelector(".chat-item-name").innerHTML;
        let chatOpenHeader = CONTENT_CHAT.querySelector(".chat-header");
        let messageschat = CONTENT_CHAT.querySelector(".chat-messages");

        messageschat.innerHTML = "";
        messages.forEach(messageData => {
            let message = document.createElement("div");
            message.classList.add("message");
            message.innerHTML = messageData.message_text;
            if (userId === messageData.id_sender) {
                message.classList.add("message-sent");                        
            } else {
                message.classList.add("message-received");
            }
            messageschat.appendChild(message);
        });
        messageschat.scrollTop = messageschat.scrollHeight;
        let chatNameOpen = chatOpenHeader.querySelector(".chat-item-name-open");
        chatNameOpen.innerHTML = namechat;
        WELCOME_MESSAGE.style.display = "none";
    }
}

function updateLastMessage(chatId, lastMessage, date, notiArray, unread_count) {
    const chatItem = chatList.querySelector(`.chat-item[data-id="${chatId}"]`);
    let messageschat = CONTENT_CHAT.querySelector(".chat-messages");

    if (chatItem) {
        const chatItemContent = chatItem.querySelector(".chat-item-content");
        const chatItemMessage = chatItemContent.querySelector(".chat-item-message");
        const hourFormat = formatDate(date);                
        let unreadMessages = chatItemMessage.querySelector(".unread-count");

        if (chatItemMessage) {
            chatItemMessage.querySelector("span").innerHTML = lastMessage.message;
            chatItem.querySelector(".chat-item-time").innerHTML = hourFormat;
            const status = chatItemMessage.querySelector(".message-status");
            if (lastMessage.id_sender == userId) {
                status.querySelector(".checkmark").style.opacity = "1";
                unreadMessages.style.opacity = "0";
            } else {
                status.querySelector(".checkmark").style.opacity = "0";
                let currentUnreadCount = unreadMessages.innerHTML ? parseInt(unreadMessages.innerHTML) : 0;
                let totalUnread = currentUnreadCount + 1;
                unreadMessages.innerHTML = totalUnread;
                unreadMessages.style.opacity = "1";
            }            
        } else {
            chatItem.querySelector(".chat-item-time").innerHTML = hourFormat;
        }

        chatList.insertBefore(chatItem, chatList.firstChild);

        messageschat.scrollTop = messageschat.scrollHeight;
    }
}


async function getChats(userId) {
    try {
        const request = await fetch("http://localhost:3000/chats/" + userId)
        const response = await request.json();
        return response;
    } catch (err) {
        console.error(err);
    }
}

async function getMessages(chatId, userId) {
    try {
        const request = await fetch("http://localhost:3000/messages/chat/" + chatId + "/user/" + userId)
        const response = await request.json();
        return response;
    } catch (err) {
        console.error(err);
    }
}

async function sendMessage(id_chat, id_sender, message) {
    try {
        const request = await fetch("http://localhost:3000/messages", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({
                id_chat: id_chat,
                id_sender: id_sender,
                message: message
            })
        })
        const response = await request.json();
        updateLastMessage(id_chat, response);
        return response;
    } catch (err) {
        console.error(err);
    }
}

async function getLastMessage(chat_id, userId) {
    try {
        const request = await fetch(`http://localhost:3000/messages/last_message/${chat_id}/user/${userId}`);
        const response = await request.json();
        console.log(response);
        return response;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function markMessagesSeen(id_chat, id_sender) {
    try {
        const request = await fetch("http://localhost:3000/messages", {
            method: "PUT",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({
                id_chat,
                id_sender
            })
        })
        const response = await request.json();
        return response;
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const chats = await getChats(userId);
    chatList.innerHTML = "";
    const chatPromises = chats.map(async (chat) => {
        const last_message = await getLastMessage(chat.chat_id, userId);
        return {
            chat: chat,
            last_message: last_message ? last_message[0][0] : null,
            unread_count: last_message ? last_message[1][0] : []
        };
    });
    const chatData = await Promise.all(chatPromises);
    chatData.sort((a, b) => {
        const dateA = a.last_message ? new Date(a.last_message.sent_at) : new Date(0);
        const dateB = b.last_message ? new Date(b.last_message.sent_at) : new Date(0);
        return dateB - dateA; 
    });

    chatData.forEach(({ chat, last_message, unread_count }) => {
        if (!last_message) {
            loadedLastMessage(true, chat, null);
        } else {
            loadedLastMessage(false, chat, [last_message], [unread_count]);
        }    
    });

    let chatItems = document.querySelectorAll(".chat-item");
    chatItems.forEach((chatItem) => {
        chatItem.addEventListener("click", async (e) => {
            openChat = true;
            chatId = chatItem.getAttribute("data-id");            
            let messages = await getMessages(chatId, userId);
            if (openChat) {
                CONTENT_CHAT.style.display = "flex";
                let markSeen = await markMessagesSeen(chatId, messages[0].other_user_id);            
                let chat = e.target.closest(".chat-item");
                showMessages(chat, messages);                
                let sendInput = CONTENT_CHAT.querySelector(".send-input");
                let newSendInput = sendInput.cloneNode(true);
                sendInput.parentNode.replaceChild(newSendInput, sendInput);
                newSendInput.addEventListener("keydown", async (e) => {
                    if (e.key === "Enter") {
                        let messageText = newSendInput.value;
                        if (messageText.trim() !== "") {
                            const newMessage = await sendMessage(chatId, userId, messageText);
                            socket.send(JSON.stringify({
                                id_chat: chatId,
                                id_sender: userId,
                                message: messageText
                            }));
                            newSendInput.value = "";
                        }
                    }
                });
            }
        });
        
    });
});
socket.addEventListener("message", async (event) => {
    const messageData = JSON.parse(event.data);
    const last_message = await getLastMessage(messageData.id_chat, userId);
    console.log(last_message);
    
    const sent_at = last_message[0][0].sent_at;
    if (messageData.id_chat === chatId && openChat) {
        seen = true;
        renderMessage(messageData);
    } else if (!openChat) {
        seen = false;
        if (notiMessage[messageData.id_chat]) {
            notiMessage[messageData.id_chat]++;
        } else {
            notiMessage[messageData.id_chat] = num++;
        }
    }

    const notiArray = Object.entries(notiMessage).map(([id_chat, count]) => [id_chat, count]);
    console.log(notiArray);
    
    updateLastMessage(messageData.id_chat, messageData, sent_at);
});
