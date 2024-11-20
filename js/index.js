document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '367047db-c1d9-4e58-bc05-1d7b0f607eb1'; // Replace with your API key
    const searchButton = document.getElementById('searchButton');
    const toggleViewButton = document.getElementById('toggleViewButton');
    const searchInput = document.getElementById('searchInput');
    const resultsSection = document.getElementById('resultsSection');
    let isCardView = true; // Default to card view
  
    // Toggle between card and list views
    toggleViewButton.addEventListener('click', () => {
      isCardView = !isCardView;
      resultsSection.className = isCardView ? 'results card-view' : 'results list-view';
    });
  
    // Fetch and display search results
    searchButton.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (!query) {
        alert('Please enter a search term!');
        return;
      }
  
      fetch(`https://api.pokemontcg.io/v2/cards?q=name:${query}`, {
        headers: { 'X-Api-Key': API_KEY }
      })
        .then(response => response.json())
        .then(data => {
          if (data.data) {
            displayResults(data.data);
          } else {
            resultsSection.innerHTML = '<p>No results found!</p>';
          }
        })
        .catch(error => console.error('Error fetching cards:', error));
    });
  
    function displayResults(cards) {
      resultsSection.innerHTML = ''; // Clear previous results
      cards.forEach(card => {
        const cardElement = isCardView ? createCardElement(card) : createListElement(card);
        resultsSection.appendChild(cardElement);
      });
    }
  
    function createCardElement(card) {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card';
  
      const cardImage = document.createElement('img');
      cardImage.src = card.images.small;
      cardImage.alt = card.name;
      cardDiv.appendChild(cardImage);
  
      const cardName = document.createElement('h3');
      cardName.textContent = card.name;
      cardDiv.appendChild(cardName);

      // Display the set name and card number on separate lines
      const cardSetName = document.createElement('p');
      cardSetName.textContent = card.set.name; // Set name
      cardDiv.appendChild(cardSetName);
  
      const cardNumber = document.createElement('p');
      cardNumber.textContent = card.number; // Card number
      cardDiv.appendChild(cardNumber);
  
      const cardLink = document.createElement('a');
      cardLink.href = `card-detail.html?cardId=${card.id}`; // Reverted to card-detail.html?cardId=...
      cardLink.textContent = 'View Details';
      cardDiv.appendChild(cardLink);
  
      return cardDiv;
    }
  
    function createListElement(card) {
      const listItem = document.createElement('div');
      listItem.className = 'list-item';
  
      const thumbnail = document.createElement('img');
      thumbnail.src = card.images.small;
      thumbnail.alt = card.name;
      thumbnail.className = 'thumbnail';
      listItem.appendChild(thumbnail);
  
      const cardName = document.createElement('span');
      cardName.textContent = card.name;
      listItem.appendChild(cardName);
  
      // Display the set name and card number on separate lines
      const cardSetName = document.createElement('p');
      cardSetName.textContent = card.set.name; // Set name
      listItem.appendChild(cardSetName);
  
      const cardNumber = document.createElement('p');
      cardNumber.textContent = card.number; // Card number
      listItem.appendChild(cardNumber);
  
      const cardLink = document.createElement('a');
      cardLink.href = `card-detail.html?cardId=${card.id}`; // Reverted to card-detail.html?cardId=...
      cardLink.textContent = 'View Details';
      listItem.appendChild(cardLink);
  
      return listItem;
    }
});