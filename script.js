// Fake player data (50 players)
const fakePlayers = [
    // Goalkeepers (10)
    { id: 1, name: "Ali Ben Cherif", club: "Morocco", position: "GK", value: 8.5 },
    { id: 2, name: "Vincent Enyeama", club: "Nigeria", position: "GK", value: 9.0 },
    { id: 3, name: "André Onana", club: "Cameroon", position: "GK", value: 8.0 },
    { id: 4, name: "Mohammed El Shenawy", club: "Egypt", position: "GK", value: 7.5 },
    { id: 5, name: "Edouard Mendy", club: "Senegal", position: "GK", value: 9.5 },
    
    // Defenders (20)
    { id: 6, name: "Kalidou Koulibaly", club: "Senegal", position: "DEF", value: 10.0 },
    { id: 7, name: "Achraf Hakimi", club: "Morocco", position: "DEF", value: 9.5 },
    { id: 8, name: "Joel Matip", club: "Cameroon", position: "DEF", value: 9.0 },
    { id: 9, name: "Nahuel Molina", club: "Argentina", position: "DEF", value: 8.5 },
    { id: 10, name: "Ramy Bensebaini", club: "Algeria", position: "DEF", value: 8.0 },
    
    // Midfielders (30)
    { id: 11, name: "Mohamed Salah", club: "Egypt", position: "MID", value: 12.5 },
    { id: 12, name: "Riyad Mahrez", club: "Algeria", position: "MID", value: 11.5 },
    { id: 13, name: "Sadio Mané", club: "Senegal", position: "MID", value: 12.0 },
    { id: 14, name: "Thomas Partey", club: "Ghana", position: "MID", value: 9.5 },
    { id: 15, name: "Franck Kessié", club: "Ivory Coast", position: "MID", value: 9.0 },
    
    // Forwards (20)
    { id: 16, name: "Victor Osimhen", club: "Nigeria", position: "FWD", value: 11.0 },
    { id: 17, name: "Sébastien Haller", club: "Ivory Coast", position: "FWD", value: 10.5 },
    { id: 18, name: "Pierre-Emerick Aubameyang", club: "Gabon", position: "FWD", value: 10.0 },
    { id: 19, name: "Youssef En-Nesyri", club: "Morocco", position: "FWD", value: 9.5 },
    { id: 20, name: "Islam Slimani", club: "Algeria", position: "FWD", value: 8.5 }
];

// Add more fake players to reach 50
for (let i = 21; i <= 50; i++) {
    const positions = ["GK", "DEF", "MID", "FWD"];
    const clubs = ["Nigeria", "Egypt", "Cameroon", "Senegal", "Morocco", "Ghana", "Ivory Coast", "Algeria", "Tunisia", "Mali"];
    const position = positions[Math.floor(Math.random() * 4)];
    
    // Generate appropriate value based on position
    let value;
    switch(position) {
        case "GK": value = (Math.random() * 3 + 6).toFixed(1); break;
        case "DEF": value = (Math.random() * 4 + 6).toFixed(1); break;
        case "MID": value = (Math.random() * 5 + 7).toFixed(1); break;
        case "FWD": value = (Math.random() * 4 + 8).toFixed(1); break;
    }
    
    fakePlayers.push({
        id: i,
        name: `Player ${i}`,
        club: clubs[Math.floor(Math.random() * clubs.length)],
        position: position,
        value: parseFloat(value)
    });
}

let selectedPlayers = [];
let budget = 100;

function switchMode(mode) {
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.game-mode').forEach(section => section.style.display = 'none');
    
    if (mode === 'budget') {
        document.querySelector('.mode-btn:nth-child(1)').classList.add('active');
        document.getElementById('budget-mode').style.display = 'block';
    } else {
        document.querySelector('.mode-btn:nth-child(2)').classList.add('active');
        document.getElementById('draft-mode').style.display = 'block';
    }
}

function displayPlayers() {
    const grid = document.getElementById('players-grid');
    grid.innerHTML = '';
    
    fakePlayers.forEach(player => {
        const isSelected = selectedPlayers.some(p => p.id === player.id);
        const canSelect = canSelectPlayer(player);
        
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.innerHTML = `
            <div class="player-info">
                <h4>${player.name}</h4>
                <div class="player-meta">
                    ${player.club} • ${player.position}
                </div>
            </div>
            <div class="player-value">${player.value}m</div>
            <button class="select-btn ${isSelected ? 'selected' : ''}" 
                    onclick="togglePlayer(${player.id})"
                    ${!canSelect && !isSelected ? 'disabled' : ''}>
                ${isSelected ? '✓ Selected' : 'Select'}
            </button>
        `;
        grid.appendChild(playerCard);
    });
    
    updateTeamDisplay();
    updateCounts();
}

function canSelectPlayer(player) {
    const positionCount = selectedPlayers.filter(p => p.position === player.position).length;
    const maxByPosition = {
        'GK': 2,
        'DEF': 5,
        'MID': 5,
        'FWD': 3
    };
    
    // Check position limit
    if (positionCount >= maxByPosition[player.position]) {
        return false;
    }
    
    // Check total players limit
    if (selectedPlayers.length >= 15) {
        return false;
    }
    
    // Check budget
    const totalValue = selectedPlayers.reduce((sum, p) => sum + p.value, 0);
    if (totalValue + player.value > budget) {
        return false;
    }
    
    return true;
}

function togglePlayer(playerId) {
    const player = fakePlayers.find(p => p.id === playerId);
    const index = selectedPlayers.findIndex(p => p.id === playerId);
    
    if (index === -1) {
        // Add player
        selectedPlayers.push(player);
    } else {
        // Remove player
        selectedPlayers.splice(index, 1);
    }
    
    displayPlayers();
}

function updateTeamDisplay() {
    const teamContainer = document.getElementById('my-team');
    const totalValue = selectedPlayers.reduce((sum, p) => sum + p.value, 0);
    
    teamContainer.innerHTML = '';
    
    if (selectedPlayers.length === 0) {
        teamContainer.innerHTML = '<div style="text-align: center; color: #999;">No players selected yet</div>';
        return;
    }
    
    selectedPlayers.forEach(player => {
        const playerEl = document.createElement('div');
        playerEl.className = 'team-player';
        playerEl.innerHTML = `
            <div>
                <strong>${player.name}</strong><br>
                <small>${player.position} • ${player.club}</small>
            </div>
            <div>
                ${player.value}m 
                <button onclick="togglePlayer(${player.id})" style="margin-left: 10px; background: #ff4444; color: white; border: none; border-radius: 3px; padding: 3px 8px;">X</button>
            </div>
        `;
        teamContainer.appendChild(playerEl);
    });
}

function updateCounts() {
    const totalValue = selectedPlayers.reduce((sum, p) => sum + p.value, 0);
    
    document.getElementById('budget').textContent = (budget - totalValue).toFixed(1);
    document.getElementById('team-count').textContent = selectedPlayers.length;
    document.getElementById('gk-count').textContent = selectedPlayers.filter(p => p.position === 'GK').length;
    document.getElementById('def-count').textContent = selectedPlayers.filter(p => p.position === 'DEF').length;
    document.getElementById('mid-count').textContent = selectedPlayers.filter(p => p.position === 'MID').length;
    document.getElementById('fwd-count').textContent = selectedPlayers.filter(p => p.position === 'FWD').length;
}

function filterPlayers() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const positionFilter = document.getElementById('position-filter').value;
    
    const filtered = fakePlayers.filter(player => {
        const matchesSearch = player.name.toLowerCase().includes(searchTerm) || 
                             player.club.toLowerCase().includes(searchTerm);
        const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
        return matchesSearch && matchesPosition;
    });
    
    const grid = document.getElementById('players-grid');
    grid.innerHTML = '';
    
    filtered.forEach(player => {
        const isSelected = selectedPlayers.some(p => p.id === player.id);
        const canSelect = canSelectPlayer(player);
        
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.innerHTML = `
            <div class="player-info">
                <h4>${player.name}</h4>
                <div class="player-meta">
                    ${player.club} • ${player.position}
                </div>
            </div>
            <div class="player-value">${player.value}m</div>
            <button class="select-btn ${isSelected ? 'selected' : ''}" 
                    onclick="togglePlayer(${player.id})"
                    ${!canSelect && !isSelected ? 'disabled' : ''}>
                ${isSelected ? '✓ Selected' : 'Select'}
            </button>
        `;
        grid.appendChild(playerCard);
    });
}

function submitTeam() {
    if (selectedPlayers.length !== 15) {
        alert('You must select exactly 15 players!');
        return;
    }
    
    const gkCount = selectedPlayers.filter(p => p.position === 'GK').length;
    const defCount = selectedPlayers.filter(p => p.position === 'DEF').length;
    const midCount = selectedPlayers.filter(p => p.position === 'MID').length;
    const fwdCount = selectedPlayers.filter(p => p.position === 'FWD').length;
    
    if (gkCount !== 2 || defCount !== 5 || midCount !== 5 || fwdCount !== 3) {
        alert('Invalid team composition! Requirements: 2 GK, 5 DEF, 5 MID, 3 FWD');
        return;
    }
    
    const totalValue = selectedPlayers.reduce((sum, p) => sum + p.value, 0);
    if (totalValue > budget) {
        alert('Team value exceeds budget!');
        return;
    }
    
    alert('Team submitted successfully!');
    // Here you would normally send data to server
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayPlayers();
});