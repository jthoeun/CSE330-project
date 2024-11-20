document.addEventListener('DOMContentLoaded', () => {
    loadCardDetails();
  });
  
  const API_KEY = '367047db-c1d9-4e58-bc05-1d7b0f607eb1'; // Replace with your API key
  
  // Retrieve energy symbols from localStorage
  const energySymbols = JSON.parse(localStorage.getItem('energySymbols'));
  
  // Check if energy symbols are available in localStorage
  if (!energySymbols) {
    console.error('Energy symbols not found in localStorage. Please ensure they are saved.');
    alert('Energy symbols not found in localStorage.');
  }
  
  function loadCardDetails(cardId = null) {
    const urlParams = new URLSearchParams(window.location.search);
    const currentCardId = cardId || urlParams.get('cardId'); // Use provided cardId or get from URL
  
    if (!currentCardId) {
      alert('No card ID provided!');
      return;
    }
  
    fetch(`https://api.pokemontcg.io/v2/cards/${currentCardId}`, {
      headers: { 'X-Api-Key': API_KEY }
    })
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          displayCardDetails(data.data);
        } else {
          alert('Card not found!');
        }
      })
      .catch(error => console.error('Error fetching card details:', error));
  }
  
  function displayCardDetails(card) {
    // Update card image
    const cardImage = document.getElementById('cardImage');
    cardImage.src = card.images.large || '';
    cardImage.alt = card.name;
  
    // Update card details in the table
    document.getElementById('cardName').textContent = card.name;
    document.getElementById('cardType').innerHTML = formatTypes(card.types || []);
    document.getElementById('cardHP').textContent = card.hp || 'N/A';
    document.getElementById('cardAbilities').innerHTML = card.abilities
      ? card.abilities.map(ability => `<strong>${ability.name}</strong>: ${ability.text}`).join('<br>')
      : 'N/A';
    document.getElementById('cardAttacks').innerHTML = card.attacks
      ? card.attacks.map(attack => formatAttack(attack)).join('<br>')
      : 'N/A';
    document.getElementById('cardWeaknessSymbols').innerHTML = formatWeaknesses(card.weaknesses || []);
    document.getElementById('cardRetreatCostSymbol').innerHTML = formatRetreatCost(card.retreatCost || []);
  
    // Show set name
    const setNameCell = document.getElementById('cardSet');
    if (card.set) {
      setNameCell.textContent = card.set.name;
    }
  
    // Display special rules (if available)
    if (card.rules && card.rules.length > 0) {
      const specialRulesSection = document.getElementById('specialRules');
      const specialRulesContent = document.getElementById('specialRulesContent');
      specialRulesContent.innerHTML = card.rules.join('<br>');
      specialRulesSection.style.display = 'block'; // Show the special rules section
    }
  }
  
  // Helper function to format types with energy symbols
  function formatTypes(types) {
    return types
      .map(type => {
        const typeName = type.toLowerCase() === 'electric' ? 'lightning' : type.toLowerCase();
        return `<img src="images/${typeName}.png" alt="${type}" class="energy-icon">`;
      })
      .join(' ');
  }
  
  // Helper function to format attack details
  function formatAttack(attack) {
    const energyCost = attack.cost
      .map(cost => {
        const costName = cost.toLowerCase() === 'electric' ? 'lightning' : cost.toLowerCase();
        return `<img src="images/${costName}.png" alt="${cost}" class="energy-icon">`;
      })
      .join(' ');
    return `<strong>${attack.name}</strong> (${attack.damage || '0'}) - ${energyCost}`;
  }
  
  // Helper function to format weaknesses
  function formatWeaknesses(weaknesses) {
    if (weaknesses.length === 0) return 'N/A';
    return weaknesses
      .map(weakness => {
        const type = weakness.type.toLowerCase() === 'electric' ? 'lightning' : weakness.type.toLowerCase();
        return `<img src="images/${type}.png" alt="${weakness.type}" class="symbol-icon"> (${weakness.value})`;
      })
      .join(' ');
  }
  
  // Helper function to format retreat cost
  function formatRetreatCost(costs) {
    if (costs.length === 0) return 'N/A';
    return costs
      .map(cost => {
        const costName = cost.toLowerCase() === 'electric' ? 'lightning' : cost.toLowerCase();
        return `<img src="images/${costName}.png" alt="${cost}" class="symbol-icon">`;
      })
      .join(' ');
  }
  
  // Event listener for "Back to Search Results" button
  const backButton = document.getElementById('backToSearchBtn');
  if (backButton) {
    backButton.addEventListener('click', function () {
      window.location.href = 'index.html'; // Redirect to the search results page
    });
  }