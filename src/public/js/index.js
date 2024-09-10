let chat = document.querySelector(".chat");

const HEADER = document.querySelector(".header-chat");
const CONTENT_CHAT = document.querySelector(".content-chat");
const MESSAGE_INPUT = document.querySelector(".message-input");

let background = true;

chat.addEventListener("click", () => {
    if (background) {
        chat.style.backgroundColor = "#202c33";
        HEADER.style.display = "flex";
        CONTENT_CHAT.style.display = "flex";
        MESSAGE_INPUT.style.opacity = "1";
    } else {
        chat.style.backgroundColor = "#111b21";
        HEADER.style.display = "none";
        CONTENT_CHAT.style.display = "none";
        MESSAGE_INPUT.style.opacity = "0";        
    }
    background = !background;
})