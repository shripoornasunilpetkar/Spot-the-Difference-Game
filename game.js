// Game configuration
let gameConfig = {
    gameTitle: "Spot the Difference",
    levels: []
};

// DOM Elements
const homePage = document.getElementById('homePage');
const gamePage = document.getElementById('gamePage');
const congratsPage = document.getElementById('congratsPage');
const image1 = document.getElementById('image1');
const image2 = document.getElementById('image2');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const finalTimeElement = document.getElementById('finalTime');
const finalScoreElement = document.getElementById('finalScore');
const gameTitle = document.getElementById('gameTitle');

// Game state
let score = 0;
let foundDifferences = [];
let gameTimer;
let seconds = 0;
let currentLevel = 1;
let currentDifferences = [];
let currentTolerance = 30;

// Sound effects
const sounds = {
    click: new Audio('sounds/click.wav'),
    success: new Audio('sounds/Success.wav'),
    complete: new Audio('sounds/complete.mp3')
};

// Function to play sound with error handling
function playSound(soundName) {
    try {
        if (sounds[soundName]) {
            if (sounds[soundName].duration > 0 || sounds[soundName].readyState >= 2) {
                sounds[soundName].currentTime = 0;
                sounds[soundName].play().catch(err => {
                    console.log(`Error playing ${soundName} sound:`, err);
                });
            }
        }
    } catch (error) {
        console.log(`Sound ${soundName} not available:`, error);
    }
}

// Load game configuration from JSON file
async function loadGameConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error('Failed to load game configuration');
        }
        gameConfig = await response.json();
        gameTitle.textContent = gameConfig.gameTitle;
        console.log('Game configuration loaded successfully');
    } catch (error) {
        console.error('Error loading game configuration:', error);
    }
}

// Function to load level configuration
function loadLevel(level) {
    const levelConfig = gameConfig.levels[level - 1];
    if (!levelConfig) {
        console.error('Invalid level configuration');
        return;
    }

    const image1 = document.getElementById('image1');
    const image2 = document.getElementById('image2');
    
    // Wait for images to load before setting up handlers
    Promise.all([
        new Promise(resolve => {
            image1.onload = resolve;
            image1.src = levelConfig.images.image1;
        }),
        new Promise(resolve => {
            image2.onload = resolve;
            image2.src = levelConfig.images.image2;
        })
    ]).then(() => {
        currentDifferences = levelConfig.differences;
        currentTolerance = levelConfig.tolerance || 30;
        
        // Reset game state
        score = 0;
        foundDifferences = [];
        updateScore();
        startTimer();
        
        // Setup image handlers after images are loaded
        setupImageHandlers();
    });
}

function setupImageHandlers() {
    // Remove existing handlers
    image1.removeEventListener('click', handleImageClick);
    image1.removeEventListener('mousemove', handleMouseMove);
    
    // Add new handlers
    image1.addEventListener('click', handleImageClick);
    image1.addEventListener('mousemove', handleMouseMove);
}

function handleMouseMove(event) {
    const rect = image1.getBoundingClientRect();
    const scaleX = image1.naturalWidth / rect.width;
    const scaleY = image1.naturalHeight / rect.height;
    
    const x = Math.round((event.clientX - rect.left) * scaleX);
    const y = Math.round((event.clientY - rect.top) * scaleY);
    
    document.getElementById('coordinates').textContent = `X: ${x}, Y: ${y}`;
}

function handleImageClick(event) {
    const rect = image1.getBoundingClientRect();
    const scaleX = image1.naturalWidth / rect.width;
    const scaleY = image1.naturalHeight / rect.height;
    
    const x = Math.round((event.clientX - rect.left) * scaleX);
    const y = Math.round((event.clientY - rect.top) * scaleY);
    
    console.log(`Clicked at coordinates: x=${x}, y=${y}`);
    checkDifference(x, y);
}

// Check if the clicked position is a difference
function checkDifference(x, y) {
    for (const diff of currentDifferences) {
        for (const coord of diff.validCoordinates) {
            const distance = Math.sqrt(
                Math.pow(x - coord.x, 2) + 
                Math.pow(y - coord.y, 2)
            );
            
            if (distance <= currentTolerance && !foundDifferences.includes(diff)) {
                foundDifferences.push(diff);
                score++;
                updateScore();
                highlightDifference(diff, coord);
                playSound('success');
                
                // Move to next level after finding one difference
                setTimeout(() => {
                    checkGameCompletion();
                }, 1000);
                return;
            }
        }
    }
    console.log('No difference found at:', x, y);
}

// Highlight the found difference
function highlightDifference(diff, coord) {
    const existingHighlights = document.querySelectorAll('.highlight');
    existingHighlights.forEach(highlight => highlight.remove());
    
    const highlight = document.createElement('div');
    highlight.className = 'highlight';
    highlight.style.left = coord.x + 'px';
    highlight.style.top = coord.y + 'px';
    highlight.style.width = diff.width + 'px';
    highlight.style.height = diff.height + 'px';
    
    const imageWrapper = image1.parentElement;
    imageWrapper.appendChild(highlight);
    
    console.log('Highlight added at:', coord.x, coord.y, diff.width, diff.height);
}

// Update the score display
function updateScore() {
    scoreElement.textContent = `Differences found: ${score}/${currentDifferences.length}`;
}

// Update the timer display
function updateTimer() {
    timerElement.textContent = `Time: ${seconds}s`;
}

// Start the game timer
function startTimer() {
    seconds = 0;
    updateTimer();
    gameTimer = setInterval(() => {
        seconds++;
        updateTimer();
    }, 1000);
}

// Stop the game timer
function stopTimer() {
    clearInterval(gameTimer);
}

// Check game completion
function checkGameCompletion() {
    stopTimer();
    if (currentLevel < gameConfig.levels.length) {
        setTimeout(() => {
            currentLevel++;
            loadLevel(currentLevel);
        }, 1000);
    } else {
        showCongratsPage();
    }
}

// Show the game page
function showGamePage() {
    homePage.style.display = 'none';
    gamePage.style.display = 'flex';
    congratsPage.style.display = 'none';
    loadLevel(currentLevel);
}

// Show the home page
function showHomePage() {
    homePage.style.display = 'flex';
    gamePage.style.display = 'none';
    congratsPage.style.display = 'none';
    stopTimer();
}

// Show the congratulations page
function showCongratsPage() {
    homePage.style.display = 'none';
    gamePage.style.display = 'none';
    congratsPage.style.display = 'flex';
    finalTimeElement.textContent = seconds;
    finalScoreElement.textContent = `${score}/${currentDifferences.length}`;
}

// Start the game
function startGame() {
    playSound('click');
    showGamePage();
}

// Initialize the game
loadGameConfig(); 