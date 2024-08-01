// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('mainMenu');
const instructionsMenu = document.getElementById('instructions');
const difficultyMenu = document.getElementById('difficultyMenu');
const gameControls = document.getElementById('gameControls');
const startButton = document.getElementById('startButton');
const instructionsButton = document.getElementById('instructionsButton');
const difficultyButton = document.getElementById('difficultyButton');
const exitButton = document.getElementById('exitButton');
const backButton = document.getElementById('backButton');
const backButtonDifficulty = document.getElementById('backButtonDifficulty');
const easyButton = document.getElementById('easyButton');
const mediumButton = document.getElementById('mediumButton');
const hardButton = document.getElementById('hardButton');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const mainMenuButton = document.getElementById('mainMenuButton');

const milestoneDialog = document.getElementById('milestoneDialog');
const milestoneMessage = document.getElementById('milestoneMessage');

const quoteLeft = document.getElementById('quoteLeft');
const quoteRight = document.getElementById('quoteRight');

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
};

const obstacles = [];
let score = 0;
let gameOver = false;
let gamePaused = false;
let obstacleInterval = 2000;
let difficulty = 'medium';
let obstacleGenerationInterval;
let quoteInterval;
let animationFrameId;
let milestoneScore = 5;

const quotes = [
    "The best games are the ones we play in our minds.",
    "A game is a series of interesting choices.",
    "Games are the only force in the known universe that can get people to learn things against their will.",
    "Winning isn’t everything, but wanting to win is.",
    "The true sign of intelligence is not knowledge but imagination.",
    "The only way to win is to learn faster than anyone else.",
    "It’s not whether you get knocked down, it’s whether you get up."
];

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updatePlayerPosition() {
    player.x += player.dx;
    player.y += player.dy;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacle.speed;

        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
            increaseDifficulty();
        }

        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            gameOver = true;
        }
    });
}

function generateObstacles() {
    const width = Math.random() * (canvas.width / 4) + 20;
    const x = Math.random() * (canvas.width - width);
    const speed = Math.random() * 2 + 2;

    obstacles.push({
        x,
        y: -20,
        width,
        height: 20,
        speed,
    });
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateGame() {
    if (!gameOver && !gamePaused) {
        clearCanvas();
        drawPlayer();
        updatePlayerPosition();
        drawObstacles();
        updateObstacles();
        drawScore();

        if (score > 0 && score % milestoneScore === 0) {
            pauseGameForMilestone();
        } else {
            animationFrameId = requestAnimationFrame(updateGame);
        }
    } else if (gameOver) {
        displayGameOver();
    }
}

function displayGameOver() {
    ctx.font = '40px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 60, canvas.height / 2 + 40);
    clearInterval(obstacleGenerationInterval);
    clearInterval(quoteInterval);
    cancelAnimationFrame(animationFrameId);
}

function increaseDifficulty() {
    if (score % 5 === 0 && obstacleInterval > 500) {
        obstacleInterval -= 200;
        clearInterval(obstacleGenerationInterval);
        obstacleGenerationInterval = setInterval(generateObstacles, obstacleInterval);
    }
}

function showRandomQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const isLeft = Math.random() > 0.5;
    const quoteElement = isLeft ? quoteLeft : quoteRight;

    quoteElement.textContent = quote;
    quoteElement.style.display = 'block';
    setTimeout(() => {
        quoteElement.style.display = 'none';
    }, 5000);
}

function startGame() {
    score = 0;
    gameOver = false;
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;
    obstacles.length = 0;
    obstacleInterval = difficulty === 'easy' ? 3000 : difficulty === 'medium' ? 2000 : 1000;

    clearInterval(obstacleGenerationInterval);
    clearInterval(quoteInterval);
    cancelAnimationFrame(animationFrameId);

    obstacleGenerationInterval = setInterval(generateObstacles, obstacleInterval);
    quoteInterval = setInterval(showRandomQuote, 10000);  // Show random quote every 10 seconds
    gameControls.style.display = 'flex';

    updateGame();
}

function pauseGame() {
    gamePaused = true;
    clearInterval(obstacleGenerationInterval);
    clearInterval(quoteInterval);
    cancelAnimationFrame(animationFrameId);
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'inline';
}

function resumeGame() {
    gamePaused = false;
    obstacleGenerationInterval = setInterval(generateObstacles, obstacleInterval);
    quoteInterval = setInterval(showRandomQuote, 10000);
    pauseButton.style.display = 'inline';
    resumeButton.style.display = 'none';
    updateGame();
}

function pauseGameForMilestone() {
    pauseGame();
    milestoneMessage.textContent = `Congratulations! You reached a score of ${score}!`;
    milestoneDialog.style.display = 'block';
    setTimeout(() => {
        milestoneDialog.style.display = 'none';
        resumeGame();
    }, 3000);  // Show milestone dialog for 3 seconds
}

function returnToMainMenu() {
    gameOver = true;
    clearInterval(obstacleGenerationInterval);
    clearInterval(quoteInterval);
    cancelAnimationFrame(animationFrameId);
    mainMenu.style.display = 'block';
    canvas.style.display = 'none';
    gameControls.style.display = 'none';
}

startButton.addEventListener('click', () => {
    mainMenu.style.display = 'none';
    canvas.style.display = 'block';
    startGame();
});

instructionsButton.addEventListener('click', () => {
    mainMenu.style.display = 'none';
    instructionsMenu.style.display = 'block';
});

backButton.addEventListener('click', () => {
    instructionsMenu.style.display = 'none';
    mainMenu.style.display = 'block';
});

difficultyButton.addEventListener('click', () => {
    mainMenu.style.display = 'none';
    difficultyMenu.style.display = 'block';
});

backButtonDifficulty.addEventListener('click', () => {
    difficultyMenu.style.display = 'none';
    mainMenu.style.display = 'block';
});

easyButton.addEventListener('click', () => {
    difficulty = 'easy';
    difficultyMenu.style.display = 'none';
    mainMenu.style.display = 'block';
});

mediumButton.addEventListener('click', () => {
    difficulty = 'medium';
    difficultyMenu.style.display = 'none';
    mainMenu.style.display = 'block';
});


hardButton.addEventListener('click', () => {
    difficulty = 'hard';
    difficultyMenu.style.display = 'none';
    mainMenu.style.display = 'block';
});

pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);
mainMenuButton.addEventListener('click', returnToMainMenu);
