document.addEventListener('DOMContentLoaded', () => {
  loadCardDetails();
});

const API_KEY = '367047db-c1d9-4e58-bc05-1d7b0f607eb1'; // Replace with your API key

function loadCardDetails(cardId = null) {
  const urlParams = new URLSearchParams(window.location.search);
  const currentCardId = cardId || urlParams.get('cardId');

  if (!currentCardId) {
    alert('No card ID provided!');
    return;
  }

  fetch(`https://api.pokemontcg.io/v2/cards/${currentCardId}`, {
    headers: { 'X-Api-Key': API_KEY },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.data) {
        const card = data.data; // `data.data` is the specific card object
        displayCardDetails(card);
        displayPricingDetails(card);
        saveToSearchHistory(card);
      } else {
        alert('Card not found!');
      }
    })
    .catch((error) => {
      console.error('Error fetching card details:', error);
      alert('An error occurred while loading card details. Please try again later.');
    });
}

function displayCardDetails(card) {
  // Card Image
  const cardImage = document.getElementById('cardImage');
  cardImage.src = card.images?.large || 'images/placeholder.png';
  cardImage.alt = card.name || 'Unknown Card';

  // Card Name
  document.getElementById('cardName').textContent = card.name || 'Unknown';

  // Card Type (Supertype)
  document.getElementById('cardType').textContent = card.supertype || 'Unknown';

  // Check if the card is a Trainer
  const isTrainer = card.supertype?.toLowerCase() === 'trainer';
  toggleRowVisibility('cardHPRow', !isTrainer);
  toggleRowVisibility('cardAbilitiesRow', !isTrainer);
  toggleRowVisibility('cardAttacksRow', !isTrainer);
  toggleRowVisibility('cardWeaknessSymbolsRow', !isTrainer);
  toggleRowVisibility('cardRetreatCostSymbolRow', !isTrainer);

  // HP
  document.getElementById('cardHP').textContent = card.hp || 'N/A';

  // Abilities
  document.getElementById('cardAbilities').innerHTML = card.abilities
    ? card.abilities.map((ability) => `<strong>${ability.name}</strong>: ${ability.text}`).join('<br>')
    : 'N/A';

  // Attacks
  document.getElementById('cardAttacks').innerHTML = card.attacks
    ? card.attacks.map((attack) => formatAttack(attack)).join('<br>')
    : 'N/A';

  // Weaknesses
  document.getElementById('cardWeaknessSymbols').innerHTML = formatWeaknesses(card.weaknesses || []);

  // Retreat Cost
  document.getElementById('cardRetreatCostSymbol').innerHTML = formatRetreatCost(card.retreatCost || []);

  // Card Set
  document.getElementById('cardSet').textContent = card.set?.name || 'N/A';

  // Special Rules
  const specialRulesSection = document.getElementById('specialRules');
  const specialRulesContent = document.getElementById('specialRulesContent');
  if (card.rules && card.rules.length > 0) {
    specialRulesContent.innerHTML = card.rules.map(formatAceSpec).join('<br>');
    specialRulesSection.style.display = 'block';
  } else {
    specialRulesSection.style.display = 'none';
  }
}

function displayPricingDetails(card) {
  const marketPriceElement = document.getElementById('marketPrice');
  const tcgplayerLink = document.getElementById('tcgplayerLink');

  // Default values
  marketPriceElement.textContent = 'Unavailable';
  tcgplayerLink.style.display = 'none';

  if (card.tcgplayer && card.tcgplayer.prices) {
    const prices = card.tcgplayer.prices;
    const marketPrice = prices.market || prices.normal || prices.holofoil || null;

    if (marketPrice) {
      marketPriceElement.textContent = `$${parseFloat(marketPrice).toFixed(2)}`;
    }
  }

  if (card.tcgplayer?.url) {
    tcgplayerLink.href = card.tcgplayer.url;
    tcgplayerLink.style.display = 'inline';
  }
}

// Helper: Toggle row visibility
function toggleRowVisibility(rowId, isVisible) {
  const row = document.getElementById(rowId);
  if (row) {
    row.style.display = isVisible ? 'table-row' : 'none';
  }
}

// Helper: Format attack details
function formatAttack(attack) {
  const energyCost = (attack.cost || [])
    .map((cost) => `<img src="images/${cost.toLowerCase()}.png" alt="${cost}" class="energy-icon">`)
    .join(' ');
  return `<strong>${attack.name}</strong> (${attack.damage || '0'}) - ${energyCost}`;
}

// Helper: Format weaknesses
function formatWeaknesses(weaknesses) {
  if (weaknesses.length === 0) return 'N/A';
  return weaknesses
    .map((weakness) => `<img src="images/${weakness.type.toLowerCase()}.png" alt="${weakness.type}" class="symbol-icon"> (${weakness.value})`)
    .join(' ');
}

// Helper: Format retreat cost
function formatRetreatCost(costs) {
  if (costs.length === 0) return 'N/A';
  return costs
    .map((cost) => `<img src="images/${cost.toLowerCase()}.png" alt="${cost}" class="symbol-icon">`)
    .join(' ');
}

// Helper: Format special rules (ACE SPEC)
function formatAceSpec(ruleText) {
  return ruleText.replace(/(ACE SPEC:)/i, '<strong>$1</strong>');
}

// Back Button: Redirect to search results
document.getElementById('backToSearchBtn')?.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Save card to search history
function saveToSearchHistory(card) {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  searchHistory.unshift(card);

  // Limit history to 5 entries
  if (searchHistory.length > 5) searchHistory.pop();

  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}