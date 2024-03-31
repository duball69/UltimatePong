

// Define functions to handle leaderboard functionality

// Function to initialize leaderboard
// Define functions to handle leaderboard functionality

// Function to initialize leaderboard
function initializeLeaderboard() {
    // Check if leaderboard data exists in storage
    let leaderboardData = getLeaderboardData();
    if (!leaderboardData) {
        // If no data exists, initialize with default values
        leaderboardData = [
            { name: 'Player 1', score: 0 },
            { name: 'Player 2', score: 0 },
            { name: 'Player 3', score: 0 },
            { name: 'Player 4', score: 0 },
            { name: 'Player 5', score: 0 }
        ];
        // Save default leaderboard data to storage
        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
    }
}


// Function to update leaderboard with player's name and score
function updateLeaderboard(playerName, playerScore) {
    // Retrieve leaderboard data from storage
    let leaderboardData = getLeaderboardData();

    // Add the new player's data to the leaderboard
    leaderboardData.push({ name: playerName, score: playerScore });

    // Sort the leaderboard based on scores in descending order
    leaderboardData.sort((a, b) => b.score - a.score);

    // Keep only the top 5 entries
    leaderboardData = leaderboardData.slice(0, 5);

    // Save the updated leaderboard data to storage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
}


// Function to retrieve leaderboard data
function getLeaderboardData() {
    // Retrieve leaderboard data from storage
    const leaderboardData = localStorage.getItem('leaderboard');
    // Parse the data from JSON format
    return JSON.parse(leaderboardData);
}

// Function to display leaderboard on the page
function displayLeaderboard() {
    // Retrieve leaderboard data from storage
    const leaderboardData = getLeaderboardData();

    // Get the leaderboard element from the DOM
    const leaderboardElement = document.getElementById('leaderboard');

    // Clear any existing content in the leaderboard element
    leaderboardElement.innerHTML = '';

    // Create and append a heading for the leaderboard
    const heading = document.createElement('h2');
    heading.textContent = 'Leaderboard';
    leaderboardElement.appendChild(heading);

    // Create and append a list element for the leaderboard entries
    const leaderboardList = document.createElement('ol');
    leaderboardElement.appendChild(leaderboardList);

    // Iterate over the leaderboard data and create list items for each entry
    leaderboardData.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
}

