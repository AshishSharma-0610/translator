let userLanguage = 'en';
let contactLanguage = 'es';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'translate') {
        translateChat();
    } else if (request.action === 'updateLanguages') {
        userLanguage = request.userLanguage;
        contactLanguage = request.contactLanguage;
    }
});

async function translateText(text, from, to) {
    try {
        const response = await fetch('http://localhost:3000/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, from, to }),
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.details || 'Translation failed');
        }
        return data.translatedText;
    } catch (error) {
        console.error('Translation failed:', error);
        return `Error: ${error.message}`;
    }
}

async function translateChat() {
    const messages = document.querySelectorAll('div.message-in, div.message-out');
    for (const message of messages) {
        const textElement = message.querySelector('span.selectable-text');
        if (textElement) {
            const originalText = textElement.innerText;
            const translatedText = await translateText(originalText, contactLanguage, userLanguage);
            textElement.innerText = translatedText;
        }
    }
}

// Modify the input field to translate outgoing messages
const inputField = document.querySelector('div[contenteditable="true"]');
if (inputField) {
    inputField.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const originalText = inputField.innerText;
            const translatedText = await translateText(originalText, userLanguage, contactLanguage);
            inputField.innerText = translatedText;
            // Trigger a 'input' event to update WhatsApp's internal state
            const inputEvent = new Event('input', { bubbles: true });
            inputField.dispatchEvent(inputEvent);
        }
    });
}

// Add a translation indicator
const translationIndicator = document.createElement('div');
translationIndicator.style.position = 'fixed';
translationIndicator.style.bottom = '10px';
translationIndicator.style.right = '10px';
translationIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
translationIndicator.style.color = 'white';
translationIndicator.style.padding = '5px 10px';
translationIndicator.style.borderRadius = '5px';
translationIndicator.style.fontSize = '12px';
translationIndicator.style.zIndex = '9999';
document.body.appendChild(translationIndicator);

function updateTranslationIndicator() {
    translationIndicator.textContent = `Translating: ${userLanguage} → ${contactLanguage}`;
}

updateTranslationIndicator();

// Listen for language changes
chrome.storage.sync.onChanged.addListener((changes) => {
    if (changes.userLanguage) {
        userLanguage = changes.userLanguage.newValue;
    }
    if (changes.contactLanguage) {
        contactLanguage = changes.contactLanguage.newValue;
    }
    updateTranslationIndicator();
});