let openChat = false;
let chatId = null;
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

function loadedLastMessage(empty, chat, last_message = null) {
    if (empty && last_message == null) {
        chatList.innerHTML += `
            <div class="chat-item" data-id="${chat.chat_id}">
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
                
            </div>
            `;
    } else {
        const hourFormat = formatDate(last_message[0].sent_at);
        if (last_message[0].id_sender === userId) {
            chatList.innerHTML += `
                <div class="chat-item" data-id="${chat.chat_id}">
                    <div class="profile-picture"></div>
                    <div class="chat-item-content">
                        <div class="chat-item-header">
                            <div class="chat-item-name">${chat.other_user_name}</div>
                            <div class="chat-item-time">${hourFormat}</div>
                        </div>  
                        <div class="chat-item-message">
                            <span>${last_message[0].message_text}</span>
                            <div class="message-status">
                                <div class="checkmark"></div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        } else {
            chatList.innerHTML += `
                <div class="chat-item" data-id="${chat.chat_id}">
                    <div class="profile-picture"></div>
                    <div class="chat-item-content">
                        <div class="chat-item-header">
                            <div class="chat-item-name">${chat.other_user_name}</div>
                            <div class="chat-item-time">${hourFormat}</div>
                        </div>  
                        <div class="chat-item-message">
                            <span>${last_message[0].message_text}</span>
                            <div class="message-status">
                                <div class="checkmark" style="opacity: 0;"></div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
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

function updateLastMessage(chatId, lastMessage, date) {
    const chatItem = chatList.querySelector(`.chat-item[data-id="${chatId}"]`);
    if (chatItem) {
        const chatItemContent = chatItem.querySelector(".chat-item-content");
        const chatItemMessage = chatItemContent.querySelector(".chat-item-message");
        const hourFormat = formatDate(date);        
        if (chatItemMessage) {
            chatItemMessage.querySelector("span").innerHTML = lastMessage.message;
            chatItem.querySelector(".chat-item-time").innerHTML = hourFormat;
            const status = chatItemMessage.querySelector(".message-status");
            if (lastMessage.id_sender == userId) {
                status.querySelector(".checkmark").style.opacity = "1";
            } else {
                status.querySelector(".checkmark").style.opacity = "0";            }
        } else {
            chatItem.querySelector(".chat-item-time").innerHTML = hourFormat;
        }
        chatList.insertBefore(chatItem, chatList.firstChild);
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

async function getMessages(chatId) {
    try {
        const request = await fetch("http://localhost:3000/messages/" + chatId)
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

async function getLastMessage(chat_id) {
    try {
        const request = await fetch("http://localhost:3000/messages/last_message/" + chat_id)
        const response = await request.json();
        return response;
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const chats = await getChats(userId);
    chatList.innerHTML = "";
    chats.forEach(async chat => {
        const last_message = await getLastMessage(chat.chat_id);
        if (last_message.length > 0) {
            loadedLastMessage(false, chat, last_message);
        } else {
            loadedLastMessage(true, chat);
        }        
        let chatItems = document.querySelectorAll(".chat-item");    
        chatItems.forEach((chatItem) => {
            chatItem.addEventListener("click", async (e) => {
                openChat = true;
                chatId = chatItem.getAttribute("data-id");
                let messages = await getMessages(chatId);
                if (openChat) {
                    CONTENT_CHAT.style.display = "flex";            
                    let chat = e.target.closest(".chat-item");
                    showMessages(chat, messages);
                    let sendInput = CONTENT_CHAT.querySelector(".send-input");
                    sendInput.addEventListener("keydown", async (e) => {
                        if (e.key === "Enter") {
                            let messageText = sendInput.value;
                            if (messageText.trim() !== "") {
                                const newMessage = await sendMessage(chatId, userId, messageText);
                                socket.send(JSON.stringify({
                                    id_chat: chatId,
                                    id_sender: userId,
                                    message: messageText
                                }));                                
                                sendInput.value = "";
                            }
                        }
                    });
                }
            });
        });
    });
});

socket.addEventListener("message", async(event) => {
    const messageData = JSON.parse(event.data);
    if (messageData.id_chat === chatId) {
        renderMessage(messageData);
        const last_message = await getLastMessage(messageData.id_chat);
        const sent_at =last_message[0].sent_at;
        updateLastMessage(messageData.id_chat, messageData, sent_at);
    }
});