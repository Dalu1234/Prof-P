require("dotenv").config();


chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create({
    url: 'popup.html',
    type: 'popup',
    width: 320,
    height: 250 
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarizeText") {
    const textToSummarize = request.text;

    const apiKey = process.env.API_KEY; 
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    const modelName = "llama3-8b-8192"; 
    (async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Authorization": apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "user", content: `Summarize this privacy policy text in simple terms:\n\n${textToSummarize}` }
            ],
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API error: ${response.status} ${response.statusText}. ${errorData.error ? errorData.error.message : ''}`);
        }

        const data = await response.json();

        if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
          sendResponse({ summary: data.choices[0].message.content });
        } else {
          if (data && data.error) {
             throw new Error(`API returned an error - ${data.error.message}`);
          } else {
            console.error("Unexpected API response structure:", data);
            throw new Error("Could not retrieve summary from API (unexpected structure).");
          }
        }
      } catch (error) {
        console.error("Summarization error in background:", error);
        sendResponse({ error: error.message });
      }
    })(); 
    return true;
  }
 
});

