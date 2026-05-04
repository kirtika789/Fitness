// --- Dropdown ---
const selectHeading = document.querySelector(".select-heading");
const arrow = document.querySelector(".select-heading img");
const options = document.querySelector(".options");
const optionItems = document.querySelectorAll(".option");
const selectedText = document.querySelector("#selected-text");

// Toggle dropdown open/close
selectHeading.addEventListener("click", () => {
    options.classList.toggle("active-options");
    arrow.classList.toggle("rotate");
});

// Handle option click
optionItems.forEach((item) => {
    item.addEventListener("click", () => {
        selectedText.innerText = item.innerText.trim();

        if (item.innerText.trim().toLowerCase() === "workout") {
            options.classList.add("active-options");
            arrow.classList.add("rotate");
        } else {
            options.classList.remove("active-options");
            arrow.classList.remove("rotate");
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
    if (!selectHeading.contains(e.target) && !options.contains(e.target)) {
        options.classList.remove("active-options");
        arrow.classList.remove("rotate");
    }
});

// --- Chatbot ---
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatBoxWrapper = document.getElementById("chat-box-wrapper");
const closeChat = document.getElementById("close-chat");
const chatContainer = document.getElementById("chat-container");
const prompt = document.querySelector(".prompt");
const chatbtn = document.getElementById("send-btn");

// Gemini API URL (Replace with your own API key securely!)
const Api_url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBVEW1GyEWrfRme6pkGCgUpmSzBa7PpuwE";

// Show chatbot when clicking the chatbot icon
chatbotToggle.addEventListener("click", () => {
    chatBoxWrapper.style.display = "flex";
    prompt.focus();
});

// Close chatbot when clicking close button
closeChat.addEventListener("click", () => {
    chatBoxWrapper.style.display = "none";
});

// Helper: create chat message box
function createChatBox(html, className) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

// Helper: scroll chat container to bottom
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show loading message
function showLoading() {
    const loadingBox = createChatBox(
        '<p class="text loading">Typing...</p>',
        "ai-chat-box"
    );
    chatContainer.appendChild(loadingBox);
    scrollToBottom();
    return loadingBox;
}

// Fetch AI response from Gemini API
async function generateAIResponse(userMessage, loadingBox) {
    try {
        const response = await fetch(Api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    role: "user",

                    parts: [{ text: userMessage }],
                }],
            }),
        });

        const data = await response.json();

        // Safe extraction using optional chaining
        const apiResponse =
            (data &&
                data.candidates &&
                data.candidates[0] &&
                data.candidates[0].content &&
                data.candidates[0].content.parts &&
                data.candidates[0].content.parts[0] &&
                data.candidates[0].content.parts[0].text &&
                data.candidates[0].content.parts[0].text.trim()) ||
            "Sorry, I couldn’t understand that.";


        loadingBox.remove();

        const aiHtml = `<p class="text"></p>`;
        const aiChatBox = createChatBox(aiHtml, "ai-chat-box");
        aiChatBox.querySelector(".text").innerText = apiResponse;
        chatContainer.appendChild(aiChatBox);
        scrollToBottom();
    } catch (error) {
        console.error("Error:", error);
        loadingBox.querySelector(".text").innerText =
            "Error fetching response from AI.";
    }
}

// Handle send message
function sendMessage() {
    const userMessage = prompt.value.trim();
    if (!userMessage) return;

    // Create user chat box
    const userHtml = `<p class="text"></p>`;
    const userChatBox = createChatBox(userHtml, "user-chat-box");
    userChatBox.querySelector(".text").innerText = userMessage;
    chatContainer.appendChild(userChatBox);

    prompt.value = "";
    scrollToBottom();

    // Show loading + get AI reply
    const loadingBox = showLoading();
    generateAIResponse(userMessage, loadingBox);
}

// Send message on button click
chatbtn.addEventListener("click", sendMessage);

// Send message on Enter key press
prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.img-card');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                cards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('show'), i * 200);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.2 });

    observer.observe(document.querySelector('.judgment-section'));
});