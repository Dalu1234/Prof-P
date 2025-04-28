
function countSyllablesLocal(word) { 
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function calculateReadabilityLocal(text) { 
  if (typeof text !== 'string' || !text.trim()) return NaN;
  const sentenceCount = (text.match(/[.!?]+/g) || []).length;
  const wordArray = text.trim().split(/\s+/);
  const wordCount = wordArray.length;
  if (wordCount === 0) return NaN;
  const syllableCount = wordArray.reduce((acc, word) => acc + countSyllablesLocal(word), 0); // Use local function
  if (syllableCount === 0) return NaN;
  const readingEase = 206.835 - 1.015 * (wordCount / (sentenceCount || 1)) - 84.6 * (syllableCount / wordCount);
  return readingEase.toFixed(2);
}


function summarizeSelectedText(selectedText) {
  const readabilityScore = calculateReadabilityLocal(selectedText); 
  const scoreText = !isNaN(readabilityScore) ? `Readability Score: ${readabilityScore}\n\n` : '';
  alert(`${scoreText}Requesting AI summary...`);

  chrome.runtime.sendMessage({ action: "summarizeText", text: selectedText }, (response) => {
     if (chrome.runtime.lastError) {
      console.error("Summarization message error:", chrome.runtime.lastError.message);
      alert(`Error getting summary: ${chrome.runtime.lastError.message}`);
    } else if (response && response.summary) {
       alert(`${scoreText}AI Summary:\n${response.summary}`);
    } else if (response && response.error) {
       alert(`Error getting summary: ${response.error}`);
    } else {
      alert("Could not get summary (unknown error).");
    }
  });
}

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
      summarizeSelectedText(selectedText);
    } else {
      alert("Please highlight some text first!");
    }
  }
});

