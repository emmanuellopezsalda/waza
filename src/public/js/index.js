let chatItems = document.querySelectorAll(".chat-item");
let openChat = false;
const CONTENT_CHAT = document.querySelector(".chat-window");
const WELCOME_MESSAGE = document.querySelector(".welcome-message");
chatItems.forEach(chatItem => {
    chatItem.addEventListener("click", (e) => {
        openChat = true;
        if (openChat) {
            CONTENT_CHAT.style.display = "flex";            
            let chat = e.target.closest(".chat-item");
            if (chat) {
                let chatContent = chat.querySelector(".chat-item-content");
                let chatContentHeader = chatContent.querySelector(".chat-item-header");
                let namechat = chatContentHeader.querySelector(".chat-item-name").innerHTML;
                let chatOpenHeader = CONTENT_CHAT.querySelector(".chat-header");
                let chatNameOpen = chatOpenHeader.querySelector(".chat-item-name-open");
                chatNameOpen.innerHTML = namechat;
                WELCOME_MESSAGE.style.display = "none";
            }
        }
    });
});