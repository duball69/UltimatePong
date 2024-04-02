// Initialize canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Function to center the canvas vertically and horizontally
function centerCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;

    // Calculate the top and left offsets to center the canvas
    const topOffset = (windowHeight - canvasHeight) / 2;
    const leftOffset = (windowWidth - canvasWidth) / 2;

    // Set canvas position to absolute and adjust top and left properties
    canvas.style.position = 'absolute';
    canvas.style.top = `${topOffset}px`;
    canvas.style.left = `${leftOffset}px`;
}

// Call the centerCanvas function initially and on window resize
centerCanvas();
window.addEventListener('resize', centerCanvas);


// Monster dimensions
const monsterWidth = 20;
const monsterHeight = 50;

// Monster positions
let monster1X = monsterWidth; // Starting position for player 1
let monster1Y = canvas.height / 2 - monsterHeight / 2; // Starting position for player 1
let monster2X = canvas.width - monsterWidth * 2; // Starting position for player 2 (AI)
let monster2Y = canvas.height / 2 - monsterHeight / 2; // Starting position for player 2 (AI)

// Ball properties
const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

// Scores
let score1 = 0;
let score2 = 0;
const winningScore = 1;

// Get player's name from local storage
const playerName = localStorage.getItem('playerName') || "Player"; // Use "Player" if name is not set

// Boolean variable to track if the game has ended
let gameEnded = false;

// Paddle movement for player 1
function moveMonster(e) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
    if (mouseX > 0 && mouseX < canvas.width / 2) {
        monster1X = mouseX - monsterWidth / 2;
    }
    if (mouseY > 0 && mouseY < canvas.height - monsterHeight) {
        monster1Y = mouseY - monsterHeight / 2;
    }
}

// Update game state
function update() {
    // Check if the game has ended
    if (gameEnded) {
        return; // Exit the function if the game has ended
    }

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Move AI player (player 2) towards the ball
    if (ballX > canvas.width / 2) {
        if (ballY > monster2Y + monsterHeight / 2) {
            monster2Y += Math.min(5, ballY - monster2Y - monsterHeight / 2); // Move down
        } else {
            monster2Y -= Math.min(5, monster2Y + monsterHeight / 2 - ballY); // Move up
        }
    }

    // Ball collisions with walls
    if (ballY - ballSize / 2 < 0 || ballY + ballSize / 2 > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collisions with monsters
    if (ballX - ballSize / 2 < monster1X + monsterWidth && ballY > monster1Y && ballY < monster1Y + monsterHeight) {
        ballSpeedX = Math.abs(ballSpeedX); // Change direction
    } else if (ballX + ballSize / 2 > monster2X && ballY > monster2Y && ballY < monster2Y + monsterHeight) {
        // Check if ball is stuck, if so, apply a minimum velocity to release it
        if (Math.abs(ballSpeedX) < 2) {
            ballSpeedX = ballSpeedX > 0 ? 2 : -2;
        } else {
            ballSpeedX = -ballSpeedX; // Change direction
        }
    }

    // Ball out of bounds
    if (ballX - ballSize / 2 < 0) {
        score2++;
        resetBall();
    } else if (ballX + ballSize / 2 > canvas.width) {
        score1++;
        resetBall();
    }

    // Check for game end
    if (score1 === winningScore || score2 === winningScore) {
        endGame();
    }
}

// Reset ball position and speed
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Reverse direction
}

// End the game
function endGame() {
    // Check if the game has already ended
    if (!gameEnded) {
        // Set gameEnded to true to prevent further calls to endGame()
        gameEnded = true;
        
        // Determine the winning player
        const winningPlayer = score1 === winningScore ? playerName : 'Player 2';

        // Increment the number of victories for the winning player
        const highScores = JSON.parse(localStorage.getItem('highScores')) || {};
        highScores[winningPlayer] = (highScores[winningPlayer] || 0) + 1;
        localStorage.setItem('highScores', JSON.stringify(highScores));

        // Show the end game overlay
        showEndGameOverlay();
    }
}


// Function to show the end game overlay
function showEndGameOverlay() {
    // Create the overlay
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Create the overlay content
    const overlayContent = document.createElement('div');
    overlayContent.classList.add('overlay-content');

    // Create the message paragraph
    const resultText = document.createElement('p');
    const result = score1 === winningScore ? `${playerName} wins!` : 'Player 2 wins!';
    resultText.textContent = result;
    overlayContent.appendChild(resultText);

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
// Create the restart button
const restartButton = document.createElement('button');
restartButton.textContent = 'Restart Game';
restartButton.classList.add('game-button'); // Add a class to the button
restartButton.addEventListener('click', () => {
    // Reload the page to restart the game
    location.reload();
});
buttonContainer.appendChild(restartButton);

// Create the high scores button
const highScoresButton = document.createElement('button');
highScoresButton.textContent = 'Check High Scores';
highScoresButton.classList.add('game-button'); // Add a class to the button
highScoresButton.addEventListener('click', () => {
    // Redirect to the high scores page
    window.location.href = "highscores.html";
});
buttonContainer.appendChild(highScoresButton);

    // Append the button container to the overlay content
    overlayContent.appendChild(buttonContainer);

    // Append the overlay content to the overlay
    overlay.appendChild(overlayContent);

    // Append the overlay to the document body
    document.body.appendChild(overlay);
}
// Function to render the game
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw monsters
    ctx.fillStyle = '#0ff'; // Neon blue
    ctx.fillRect(monster1X, monster1Y, monsterWidth, monsterHeight);
    ctx.fillStyle = '#f0f'; // Neon purple
    ctx.fillRect(monster2X, monster2Y, monsterWidth, monsterHeight);

    // Draw ball
    ctx.fillStyle = '#fff'; // Neon white
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores with player's name
    ctx.fillStyle = '#fff'; // Neon white
    ctx.font = '24px Orbitron';
    ctx.fillText(`${playerName}: ${score1}`, 20, 30);
    ctx.fillText('Player 2: ' + score2, canvas.width - 150, 30);
}

// Function to run the game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Event listener for player 1 movement
canvas.addEventListener('mousemove', moveMonster);

// Start the game loop
gameLoop();



// Function to register a victory for the player
function registerVictory() {
    // Retrieve player's victories from local storage or initialize to 0
    let victories = parseInt(localStorage.getItem(`${playerName}_victories`)) || 0;

    // Increment victories
    victories++;

    // Save updated victories count to local storage
    localStorage.setItem(`${playerName}_victories`, victories.toString());
}

// Function to retrieve and display high scores
function displayHighScores() {
    // Retrieve all players' victories from local storage
    const highScores = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.endsWith('_victories')) {
            const playerName = key.replace('_victories', '');
            const victories = parseInt(localStorage.getItem(key));
            highScores.push({ playerName, victories });
        }
    }

    // Sort high scores by victories (descending order)
    highScores.sort((a, b) => b.victories - a.victories);

    // Display high scores on the page
    const highScoresList = document.getElementById('highScoresList');
    highScoresList.innerHTML = ''; // Clear existing list
    highScores.forEach((player, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${player.playerName}: ${player.victories} victories`;
        highScoresList.appendChild(listItem);
    });
}
