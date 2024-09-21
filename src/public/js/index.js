let openChat = false;
const CONTENT_CHAT = document.querySelector(".chat-window");
const WELCOME_MESSAGE = document.querySelector(".welcome-message");
const userId = Number(localStorage.getItem("userId"));
let chatList = document.querySelector(".chat-list");

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
        const request = await fetch("http://localhost:3000/messages/" + chatId )
        const response = await request.json();
        return response;
    } catch (err) {
        console.error(err);
    }
}

async function showMessages(chat, messages) {
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

        let chatNameOpen = chatOpenHeader.querySelector(".chat-item-name-open");
        chatNameOpen.innerHTML = namechat;
        WELCOME_MESSAGE.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const chats = await getChats(userId);
    chatList.innerHTML = "";
    chats.forEach(chat => {
        chatList.innerHTML += `
        <div class="chat-item" data-id="${chat.chat_id}">
            <div class="profile-picture"></div>
            <div class="chat-item-content">
                <div class="chat-item-header">
                    <div class="chat-item-name">${chat.other_user_name}</div>
                    <div class="chat-item-time">10:30 PM</div>
                </div>  
            </div>
        </div>
        `;
    });
    
    let chatItems = document.querySelectorAll(".chat-item");
    chatItems.forEach((chatItem) => {
        chatItem.addEventListener("click", async (e) => {
            openChat = true;
            let chatId = chatItem.getAttribute("data-id");
            let messages = await getMessages(chatId);
            if (openChat) {
                CONTENT_CHAT.style.display = "flex";            
                let chat = e.target.closest(".chat-item");
                showMessages(chat, messages)
            }
        });
    });
});
