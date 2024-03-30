// Initialize canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
        ballSpeedX = -ballSpeedX;
    } else if (ballX + ballSize / 2 > monster2X && ballY > monster2Y && ballY < monster2Y + monsterHeight) {
        ballSpeedX = -ballSpeedX;
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
    const result = score1 === winningScore ? 'Player 1 wins!' : 'Player 2 wins!';
    
    // Show result in an alert box
    alert(result);

    // Reload the page to restart the game
    location.reload();
}


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

    // Draw scores
    ctx.fillStyle = '#fff'; // Neon white
    ctx.font = '24px Arial';
    ctx.fillText('Player 1: ' + score1, 20, 30);
    ctx.fillText('Player 2: ' + score2, canvas.width - 150, 30);
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Event listener for player 1 movement
canvas.addEventListener('mousemove', moveMonster);

// Start the game loop
gameLoop();
