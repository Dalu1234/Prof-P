
function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }
  
  function calculateReadability(text) {
    if (typeof text !== 'string' || !text.trim()) {
        return NaN; 
    }
    const sentenceCount = (text.match(/[.!?]+/g) || []).length;
    const wordArray = text.trim().split(/\s+/);
    const wordCount = wordArray.length;
  
    if (wordCount === 0) {
        return NaN;
    }
    const syllableCount = wordArray.reduce((acc, word) => acc + countSyllables(word), 0);
    if (syllableCount === 0) {
        return NaN;
    }
    const readingEase = 206.835 - 1.015 * (wordCount / (sentenceCount || 1)) - 84.6 * (syllableCount / wordCount);
    return readingEase.toFixed(2);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const readabilityElement = document.getElementById("readability");
    const textInput = document.getElementById("text-to-summarize");
    const summaryDiv = document.getElementById("summary");
  

    readabilityElement.innerText = "Enter text below to calculate readability or summarize.";
  
    document.getElementById("calculate-readability").addEventListener("click", () => {
      const textToAnalyze = textInput.value;
      summaryDiv.innerText = ""; 
  
      if (!textToAnalyze.trim()) {
        readabilityElement.innerText = "Please paste some text first.";
        return;
      }
  
      const score = calculateReadability(textToAnalyze);
  
      if (!isNaN(score)) {
        readabilityElement.innerText = `Flesch Reading Ease Score: ${score}`;
      } else {
        readabilityElement.innerText = "Could not calculate score. Ensure text is valid.";
      }
    });
  
  
    document.getElementById("summarize").addEventListener("click", async () => {
        const textToSummarize = textInput.value;
        readabilityElement.innerText = "";
  
        if (!textToSummarize.trim()) {
            summaryDiv.innerText = "Please paste some text to summarize.";
            return;
        }
  
        summaryDiv.innerText = "Summarizing using Groq...";

        const apiKey = "Bearer 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"; // ** SECURITY RISK **
        const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
        const modelName = "llama3-8b-8192";
  
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
                summaryDiv.innerText = data.choices[0].message.content;
            } else {
                 if (data && data.error) {
                     summaryDiv.innerText = `Error: API returned an error - ${data.error.message}`;
                 } else {
                     summaryDiv.innerText = "Error: Could not retrieve summary from API.";
                     console.error("Unexpected API response structure:", data);
                 }
            }
  
        } catch (error) {
            console.error("Summarization error:", error);
            summaryDiv.innerText = `Error summarizing: ${error.message}`;
        }
    });
  });