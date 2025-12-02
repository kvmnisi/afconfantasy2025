// Enhanced player data
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
    { id: 9, name: "Ramy Bensebaini", club: "Algeria", position: "DEF", value: 8.0 },
    { id: 10, name: "Nahuel Molina", club: "Argentina", position: "DEF", value: 8.5 },
    
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

// Add more fake players
for (let i = 21; i <= 100; i++) {
    const positions = ["GK", "DEF", "MID", "FWD"];
    const clubs = ["Nigeria", "Egypt", "Cameroon", "Senegal", "Morocco", "Ghana", "Ivory Coast", "Algeria", "Tunisia", "Mali"];
    const position = positions[Math.floor(Math.random() * 4)];
    
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
let currentPosition = null;
let currentSlotType = null;
let teamStructure = {
    xi: {
        GK: null,
        DEF: [null, null, null, null],
        MID: [null, null, null, null],
        FWD: [null, null]
    },
    bench: [null, null, null, null]
};

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
                ${isSelected ? '✓ Selected' : 'Add to Squad'}
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
    
    if (positionCount >= maxByPosition[player.position]) {
        return false;
    }
    
    if (selectedPlayers.length >= 15) {
        return false;
    }
    
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
        selectedPlayers.push(player);
    } else {
        // Remove player from team structure first
        removePlayerFromStructure(playerId);
        selectedPlayers.splice(index, 1);
    }
    
    displayPlayers();
}

function selectPosition(position, slotType) {
    currentPosition = position;
    currentSlotType = slotType;
    
    // Filter players based on position
    let availablePlayers;
    if (position === 'any') {
        availablePlayers = selectedPlayers.filter(player => 
            !isPlayerInStructure(player.id)
        );
    } else {
        availablePlayers = selectedPlayers.filter(player => 
            player.position === position && !isPlayerInStructure(player.id)
        );
    }
    
    if (availablePlayers.length === 0) {
        alert(`No ${position === 'any' ? 'available' : position} players in your squad to select.`);
        return;
    }
    
    openModal(availablePlayers);
}

function openModal(players) {
    const modal = document.getElementById('position-modal');
    const modalPlayers = document.getElementById('modal-players');
    const title = document.getElementById('modal-title');
    
    title.textContent = `Select ${currentPosition === 'any' ? 'Bench Player' : currentPosition} Player`;
    modalPlayers.innerHTML = '';
    
    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'modal-player-card';
        playerCard.innerHTML = `
            <h4>${player.name}</h4>
            <div>${player.club} • ${player.position}</div>
            <div><strong>${player.value}m</strong></div>
        `;
        playerCard.onclick = () => assignPlayerToSlot(player);
        modalPlayers.appendChild(playerCard);
    });
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('position-modal').style.display = 'none';
}

function assignPlayerToSlot(player) {
    if (currentSlotType === 'bench') {
        // Find empty bench slot
        const benchIndex = teamStructure.bench.findIndex(slot => slot === null);
        if (benchIndex !== -1) {
            teamStructure.bench[benchIndex] = player.id;
            document.getElementById(`bench-${benchIndex + 1}`).textContent = player.name;
            document.getElementById(`bench-${benchIndex + 1}`).parentElement.classList.add('filled');
        }
    } else if (currentSlotType === 'xi') {
        // Assign to starting XI
        if (currentPosition === 'GK') {
            teamStructure.xi.GK = player.id;
            document.getElementById('xi-gk').textContent = player.name;
            document.getElementById('xi-gk').parentElement.classList.add('filled');
        } else {
            const positions = teamStructure.xi[currentPosition];
            const emptyIndex = positions.findIndex(slot => slot === null);
            if (emptyIndex !== -1) {
                positions[emptyIndex] = player.id;
                document.getElementById(`xi-${currentPosition.toLowerCase()}-${emptyIndex + 1}`).textContent = player.name;
                document.getElementById(`xi-${currentPosition.toLowerCase()}-${emptyIndex + 1}`).parentElement.classList.add('filled');
            }
        }
    }
    
    closeModal();
    updateCounts();
}

function isPlayerInStructure(playerId) {
    // Check if player is already in starting XI
    if (teamStructure.xi.GK === playerId) return true;
    
    for (const position of ['DEF', 'MID', 'FWD']) {
        if (teamStructure.xi[position].includes(playerId)) return true;
    }
    
    // Check bench
    if (teamStructure.bench.includes(playerId)) return true;
    
    return false;
}

function removePlayerFromStructure(playerId) {
    // Remove from GK
    if (teamStructure.xi.GK === playerId) {
        teamStructure.xi.GK = null;
        document.getElementById('xi-gk').textContent = 'Empty';
        document.getElementById('xi-gk').parentElement.classList.remove('filled');
    }
    
    // Remove from DEF
    teamStructure.xi.DEF = teamStructure.xi.DEF.map(id => {
        if (id === playerId) {
            const index = teamStructure.xi.DEF.indexOf(playerId);
            document.getElementById(`xi-def-${index + 1}`).textContent = 'Empty';
            document.getElementById(`xi-def-${index + 1}`).parentElement.classList.remove('filled');
            return null;
        }
        return id;
    });
    
    // Remove from MID
    teamStructure.xi.MID = teamStructure.xi.MID.map(id => {
        if (id === playerId) {
            const index = teamStructure.xi.MID.indexOf(playerId);
            document.getElementById(`xi-mid-${index + 1}`).textContent = 'Empty';
            document.getElementById(`xi-mid-${index + 1}`).parentElement.classList.remove('filled');
            return null;
        }
        return id;
    });
    
    // Remove from FWD
    teamStructure.xi.FWD = teamStructure.xi.FWD.map(id => {
        if (id === playerId) {
            const index = teamStructure.xi.FWD.indexOf(playerId);
            document.getElementById(`xi-fwd-${index + 1}`).textContent = 'Empty';
            document.getElementById(`xi-fwd-${index + 1}`).parentElement.classList.remove('filled');
            return null;
        }
        return id;
    });
    
    // Remove from bench
    teamStructure.bench = teamStructure.bench.map((id, index) => {
        if (id === playerId) {
            document.getElementById(`bench-${index + 1}`).textContent = 'Empty';
            document.getElementById(`bench-${index + 1}`).parentElement.classList.remove('filled');
            return null;
        }
        return id;
    });
}

function updateTeamDisplay() {
    // Update the team summary display
    const totalValue = selectedPlayers.reduce((sum, p) => sum + p.value, 0);
    const xiCount = countPlayersInXI();
    const benchCount = countPlayersInBench();
    
    document.getElementById('summary-xi').textContent = xiCount;
    document.getElementById('summary-bench').textContent = benchCount;
    document.getElementById('summary-value').textContent = totalValue.toFixed(1);
    document.getElementById('summary-remaining').textContent = (budget - totalValue).toFixed(1);
}

function countPlayersInXI() {
    let count = 0;
    if (teamStructure.xi.GK !== null) count++;
    
    for (const position of ['DEF', 'MID', 'FWD']) {
        count += teamStructure.xi[position].filter(id => id !== null).length;
    }
    
    return count;
}

function countPlayersInBench() {
    return teamStructure.bench.filter(id => id !== null).length;
}

function updateCounts() {
    const totalValue = selectedPlayers.reduce((sum, p) => sum + p.value, 0);
    const xiCount = countPlayersInXI();
    const benchCount = countPlayersInBench();
    
    document.getElementById('budget').textContent = (budget - totalValue).toFixed(1);
    document.getElementById('team-count').textContent = selectedPlayers.length;
    document.getElementById('xi-count').textContent = xiCount;
    document.getElementById('bench-count').textContent = benchCount;
    
    // Update position counts
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
                ${isSelected ? '✓ Selected' : 'Add to Squad'}
            </button>
        `;
        grid.appendChild(playerCard);
    });
}

function clearTeam() {
    if (confirm('Are you sure you want to clear your entire team?')) {
        selectedPlayers = [];
        teamStructure = {
            xi: {
                GK: null,
                DEF: [null, null, null, null],
                MID: [null, null, null, null],
                FWD: [null, null]
            },
            bench: [null, null, null, null]
        };
        
        // Reset all slot displays
        document.querySelectorAll('.player-assigned').forEach(el => {
            el.textContent = 'Empty';
            el.parentElement.classList.remove('filled');
        });
        
        displayPlayers();
    }
}

function autoPick() {
    if (selectedPlayers.length > 0 && !confirm('Auto pick will replace your current team. Continue?')) {
        return;
    }
    
    clearTeam();
    
    // Auto pick logic
    const positions = [
        { pos: 'GK', count: 2 },
        { pos: 'DEF', count: 5 },
        { pos: 'MID', count: 5 },
        { pos: 'FWD', count: 3 }
    ];
    
    let remainingBudget = budget;
    selectedPlayers = [];
    
    for (const pos of positions) {
        const availablePlayers = fakePlayers
            .filter(p => p.position === pos.pos)
            .sort((a, b) => b.value - a.value); // Sort by value descending
        
        for (let i = 0; i < pos.count && availablePlayers.length > 0; i++) {
            // Find affordable player
            const player = availablePlayers.find(p => p.value <= remainingBudget);
            if (player) {
                selectedPlayers.push(player);
                remainingBudget -= player.value;
                // Remove from available to avoid duplicates
                const index = fakePlayers.indexOf(player);
                fakePlayers.splice(index, 1);
            }
        }
    }
    
    // Fill remaining spots with cheapest available
    while (selectedPlayers.length < 15 && fakePlayers.length > 0) {
        const cheapPlayers = [...fakePlayers].sort((a, b) => a.value - b.value);
        for (const player of cheapPlayers) {
            if (player.value <= remainingBudget) {
                selectedPlayers.push(player);
                remainingBudget -= player.value;
                const index = fakePlayers.indexOf(player);
                fakePlayers.splice(index, 1);
                break;
            }
        }
    }
    
    displayPlayers();
}

function submitTeam() {
    if (selectedPlayers.length !== 15) {
        alert('You must select exactly 15 players!');
        return;
    }
    
    const xiCount = countPlayersInXI();
    const benchCount = countPlayersInBench();
    
    if (xiCount !== 11) {
        alert('You must select 11 players for Starting XI!');
        return;
    }
    
    if (benchCount !== 4) {
        alert('You must select 4 players for the bench!');
        return;
    }
    
    // Check team composition
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
    
    // Save team to localStorage (in real app, send to server)
    const teamData = {
        players: selectedPlayers,
        formation: teamStructure,
        submittedAt: new Date().toISOString()
    };
    
    localStorage.setItem('fantasyTeam', JSON.stringify(teamData));
    alert('Team submitted successfully!');
    console.log('Team saved:', teamData);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('position-modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayPlayers();
    
    // Load saved team if exists
    const savedTeam = localStorage.getItem('fantasyTeam');
    if (savedTeam) {
        try {
            const teamData = JSON.parse(savedTeam);
            selectedPlayers = teamData.players;
            teamStructure = teamData.formation;
            displayPlayers();
            alert('Loaded previously saved team!');
        } catch (e) {
            console.log('No valid saved team found');
        }
    }
});