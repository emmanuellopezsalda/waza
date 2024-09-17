let chat = document.querySelectorAll(".chat-item");
let openchat = false;
const CONTENT_CHAT = document.querySelector(".chat-window");            
const WELCOME_MESSAGE = document.querySelector(".welcome-message");
chat.forEach(btn => {
    btn.addEventListener("click", () => {
        openchat = true;
        if (openchat) {
            CONTENT_CHAT.style.display = "flex";
            WELCOME_MESSAGE.style.display = "none";
        }
    })
});