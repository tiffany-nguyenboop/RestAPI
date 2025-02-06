async function fetchDefinition() {
    const word = document.getElementById('wordInput').value.trim().toLowerCase();
    const resultSection = document.querySelector('.result-section');
    const wordTitle = document.getElementById('wordTitle');
    const phonetics = document.getElementById('phonetics');
    const definitionContainer = document.getElementById('definitionContainer');

    // Clear previous results
    wordTitle.textContent = '';
    phonetics.textContent = '';
    definitionContainer.innerHTML = '';

    // Hide the result section initially
    resultSection.style.display = 'none';

    if (!word) return; // Exit if no word is entered

    try {
        const apiKey = '0f024096-4261-4bb6-9676-33294fed7e59';
        const url = `https://dictionaryapi.com/api/v3/references/sd4/json/${word}?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        // Handle word suggestions (e.g., "men" -> suggests "man")
        if (Array.isArray(data) && data.length > 0) {
            if (typeof data[0] === "string") {
                // Find the closest matching word
                const bestMatch = data.find(suggestion => suggestion.startsWith(word[0])) || data[0];

                wordTitle.textContent = `Word not found. Did you mean: ${bestMatch}?`;
                resultSection.style.display = 'block';
                return;
            }

            // Find a valid dictionary entry (avoid picking words like "manual")
            const entry = data.find(item => item.shortdef);
            if (entry) {
                wordTitle.textContent = entry.meta?.id || word; // Use word ID if available
                phonetics.textContent = entry.hwi?.prs?.[0]?.mw 
                    ? `/${entry.hwi.prs[0].mw}/` 
                    : 'No phonetics available';

                entry.shortdef.forEach((definition, index) => {
                    const definitionElement = document.createElement('p');
                    definitionElement.textContent = `${index + 1}. ${definition}`;
                    definitionContainer.appendChild(definitionElement);
                });

                // Show the result section
                resultSection.style.display = 'block';
            } else {
                wordTitle.textContent = 'Definition not found.';
                resultSection.style.display = 'block';
            }
        } else {
            wordTitle.textContent = 'Word not found.';
            resultSection.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        wordTitle.textContent = 'Error fetching the definition.';
        resultSection.style.display = 'block';
    }
}

// Event Listener
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchButton").addEventListener("click", fetchDefinition);
});

// Hit 'enter' to search
document.getElementById("wordInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") { 
        event.preventDefault(); 
        document.getElementById("searchButton").click();
    }
});
