function search() {
    const word = document.getElementById('word').value;
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = '';

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(entry => {
                const wordElement = document.createElement('div');
                wordElement.innerHTML = `
                    <h2><a href="https://www.dictionary.com/browse/${entry.word}" target="_blank">${entry.word}</a></h2>
                    <p>Part of speech: ${entry.meanings[0].partOfSpeech}</p>
                    <p>Definition: ${entry.meanings[0].definitions[0].definition}</p>
                    <audio controls>
                        <source src="${entry.phonetics[0].audio}" type="audio/mpeg">
                    </audio>
                `;
                resultElement.appendChild(wordElement);

                fetch(`https://api.datamuse.com/words?rel_syn=${word}`)
                    .then(response => response.json())
                    .then(synonymsData => {
                        const synonyms = synonymsData.map(synonym => synonym.word).join(', ');
                        const synonymsElement = document.createElement('p');
                        synonymsElement.textContent = `Synonyms: ${synonyms}`;
                        wordElement.appendChild(synonymsElement);
                    })
                    .catch(error => console.error('Error fetching synonyms:', error));

                fetch(`https://api.datamuse.com/words?rel_ant=${word}`)
                    .then(response => response.json())
                    .then(antonymsData => {
                        const antonyms = antonymsData.map(antonym => antonym.word).join(', ');
                        const antonymsElement = document.createElement('p');
                        antonymsElement.textContent = `Antonyms: ${antonyms}`;
                        wordElement.appendChild(antonymsElement);
                    })
                    .catch(error => console.error('Error fetching antonyms:', error));
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}
