import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
    const [userLanguage, setUserLanguage] = useState('en');
    const [contactLanguage, setContactLanguage] = useState('es');

    useEffect(() => {
        chrome.storage.sync.get(['userLanguage', 'contactLanguage'], (result) => {
            if (result.userLanguage) setUserLanguage(result.userLanguage);
            if (result.contactLanguage) setContactLanguage(result.contactLanguage);
        });
    }, []);

    const handleSave = () => {
        chrome.storage.sync.set({ userLanguage, contactLanguage }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateLanguages',
                    userLanguage,
                    contactLanguage
                });
            });
        });
    };

    const handleTranslate = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'translate',
                targetLanguage: contactLanguage
            });
        });
    };

    return (
        <div className="popup-container">
            <h1>WhatsApp Translator</h1>
            <div className="language-select-container">
                <label htmlFor="userLanguage">Your Language:</label>
                <select
                    id="userLanguage"
                    value={userLanguage}
                    onChange={(e) => setUserLanguage(e.target.value)}
                    className="language-select"
                >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                </select>
            </div>
            <div className="language-select-container">
                <label htmlFor="contactLanguage">Contact's Language:</label>
                <select
                    id="contactLanguage"
                    value={contactLanguage}
                    onChange={(e) => setContactLanguage(e.target.value)}
                    className="language-select"
                >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="pt">Portuguese</option>
                </select>
            </div>
            <button onClick={handleSave} className="save-button">
                Save Settings
            </button>
            <button onClick={handleTranslate} className="translate-button">
                Translate Chat
            </button>
        </div>
    );
};

ReactDOM.render(<Popup />, document.getElementById('root'));