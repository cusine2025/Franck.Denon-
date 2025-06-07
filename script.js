
document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("txt").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

const API_KEY = "AIzaSyBN4UIH-n3ZKDqXggccAatrcpi_fBf6XiA";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const predefinedResponses = {
    "qui es-tu ?": "Je suis l'intelligence artificielle créée par Franck Denon.",
    "créateur": "Mon créateur est Franck Denon.",
    "qui t'a créé": "J'ai été développée par Franck Denon, un passionné d'intelligence artificielle.",
    "que fais-tu": "Je suis ici pour répondre à vos questions et vous aider dans vos tâches quotidiennes !",
    "qui est franck denon": "Franck Denon est mon créateur."
};

async function sendMessage() {
    const inputField = document.getElementById("txt");
    const chatBox = document.getElementById("list_cont");
    const userMessage = inputField.value.trim();

    if (!userMessage) return;

    appendMessage(userMessage, "schat");
    inputField.value = "";

    const cleanMsg = userMessage.toLowerCase();
    let response = predefinedResponses[cleanMsg];

    appendMessage("⏳ Réflexion en cours...", "rchat", true);

    if (!response) {
        try {
            response = await fetchGeminiData(userMessage);
        } catch (error) {
            response = "❌ Désolé, une erreur s'est produite. Veuillez réessayer.";
        }
    }

    // Remplacer le message de chargement par la réponse réelle
    const loadingElem = chatBox.querySelector(".rchat.typing");
    if (loadingElem) chatBox.removeChild(loadingElem);

    appendMessage(response, "rchat");
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMessage(text, className, isTyping = false) {
    const chatBox = document.getElementById("list_cont");
    const msgElem = document.createElement("li");
    msgElem.classList.add(className);
    if (isTyping) msgElem.classList.add("typing");
    msgElem.textContent = text;
    chatBox.appendChild(msgElem);
}

async function fetchGeminiData(prompt) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    if (!response.ok) throw new Error('Erreur API');
    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Réponse API invalide');
    return text;
}
