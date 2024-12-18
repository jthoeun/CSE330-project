document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = '367047db-c1d9-4e58-bc05-1d7b0f607eb1'; // Replace with your API key
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');
  const resultsSection = document.getElementById('resultsSection');
  const searchHistoryList = document.getElementById('searchHistoryList'); // Element to display search history

  // Load and display search history from localStorage
  loadSearchHistory();

  // Pre-fill search input if a previous query exists
  const lastSearchQuery = localStorage.getItem('lastSearchQuery');
  if (lastSearchQuery) {
    searchInput.value = lastSearchQuery;
    performSearch(lastSearchQuery); // Automatically display results
  }

  // Fetch and display search results on button click
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
      alert('Please enter a search term!');
      return;
    }

    // Save the query to localStorage for reuse
    localStorage.setItem('lastSearchQuery', query);
    saveSearchHistory(query); // Save to history
    performSearch(query);
  });

  // Function to perform the search
  function performSearch(query) {
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
  }

  // Function to display results
  function displayResults(cards) {
    resultsSection.innerHTML = ''; // Clear previous results
    cards.forEach(card => {
      const cardElement = createCardElement(card);
      resultsSection.appendChild(cardElement);
    });
  }

  // Function to create card elements
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
    cardLink.href = `card-detail.html?cardId=${card.id}`; // Link to card details
    cardLink.textContent = 'View Details';
    cardDiv.appendChild(cardLink);

    return cardDiv;
  }

  // Save the query to the search history in localStorage
  function saveSearchHistory(query) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Prevent adding duplicate searches
    if (!searchHistory.includes(query)) {
      searchHistory.unshift(query); // Add new search at the beginning
      if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(0, 10); // Limit to 10 searches
      }
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      loadSearchHistory(); // Update the displayed search history
    }
  }

  // Load and display search history from localStorage
  function loadSearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryList.innerHTML = ''; // Clear the history list

    searchHistory.forEach(query => {
      const historyItem = document.createElement('li');
      historyItem.textContent = query;
      
      // When a search history item is clicked, trigger the search
      historyItem.addEventListener('click', () => {
        searchInput.value = query;
        searchButton.click(); // Trigger search button click
      });

      searchHistoryList.appendChild(historyItem);
    });
  }

});