# Privacy Analyzer (Prof P)
**Prof P**, is a Chrome Extension designed to help users quickly understand complicated privacy policies and legal jargon. It allows users to **highlight text** on any webpage and press **Ctrl+Y** to:
- Get a simplified AI-generated summary of the text.
- See a **readability score** (Flesch Reading Ease) to judge how easy the text is to understand.

Users can also open a **popup window** to manually paste text, calculate readability, and generate a summary.

---

## Features
- **AI-Powered Summaries**: Uses Groq's Llama 3 model via an API call to simplify privacy policy text.
- **Readability Analysis**: Calculates how readable the selected or pasted text is (using the Flesch Reading Ease formula).
- **Shortcut Activation**: Highlight text and press **Ctrl+Y** for instant analysis.
- **Popup Interface**: Analyze privacy policies manually by pasting text into the extension popup.
- **Designed for Privacy Education**: Empowers users to better understand how their data may be collected, used, or shared.

---

## Installation
1. Clone or download the repository.
2. Go to `chrome://extensions/` in your Chrome browser.
3. Enable **Developer Mode** (toggle in the top right corner).
4. Click **Load Unpacked** and select the project folder.
5. The "Privacy Awareness" icon will appear in the Chrome toolbar.

---

## Files
| File | Purpose |
|:-----|:--------|
| `background.js` | Listens for extension activation and manages API requests. |
| `content.js` | Detects user text selection and triggers summarization/readability calculation. |
| `popup.js` | Handles manual input, readability, and summarization in the popup window. |
| `popup.html` | Interface for text input, readability, and summarization in the popup. |
| `style.css` | Styles the popup window. |
| `manifest.json` | Defines extension permissions, scripts, and metadata. |
| `.env` | (for local development) Stores the API key for Groq. |
| `package-lock.json` | Manages installed Node dependencies (dotenv used to load environment variables). |

---

## API and Security Notes
- The extension uses **Groq's Llama 3 model** through an API to generate AI summaries.
- **Important:** The API key is exposed in `popup.js`, which is a major security risk.  
  - In production, API keys should **never** be exposed on the client side.
  - A better practice would be to proxy API requests through a secure backend server.

---
Prof P directly addresses **privacy** by:

- **Demystifying Privacy Policies**
- **Highlighting Readability Issues**
- **Supporting Privacy Literacy**
- **Minimal Data Collection**

