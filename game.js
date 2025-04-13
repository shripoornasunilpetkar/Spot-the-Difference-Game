// Game configuration
let gameConfig = {
    image1: 'images/image1.jpeg',
    image2: 'images/image2.jpeg',
    differences: [
        { 
            validCoordinates: [
                { x: 296, y: 368 },
                { x: 408, y: 353 },
                { x: 364, y: 423 },
                { x: 202, y: 361 }
            ],
            width: 60,
            height: 60
        }
    ],
    tolerance: 30 // Tolerance range in pixels
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
            // Check if the sound file is valid before trying to play it
            if (sounds[soundName].duration > 0 || sounds[soundName].readyState >= 2) {
                sounds[soundName].currentTime = 0;
                sounds[soundName].play().catch(err => {
                    console.log(`Error playing ${soundName} sound:`, err);
                });
            } else {
                console.log(`Sound ${soundName} is not loaded or is empty`);
            }
        }
    } catch (error) {
        console.log(`Sound ${soundName} not available:`, error);
    }
}

// Function to add click sound to an element
function addClickSoundToElement(element) {
    if (element) {
        element.addEventListener('click', () => {
            // Add a 0.0625 second delay before playing the click sound
            setTimeout(() => {
                playSound('click');
            }, 62.5);
        });
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
        // Fallback to default configuration
    }
}

// Initialize the game
async function initGame() {
    // Load configuration if not already loaded
    if (!gameConfig.gameTitle) {
        await loadGameConfig();
    }
    
    // Set image sources
    image1.src = gameConfig.images.image1;
    image2.src = gameConfig.images.image2;
    
    // Reset game state
    score = 0;
    foundDifferences = [];
    seconds = 0;
    updateScore();
    updateTimer();
    
    // Add click event listener to image1
    image1.addEventListener('click', handleImageClick);
}

// Handle image click
function handleImageClick(e) {
    // Add a 0.0625 second delay before playing the click sound
    setTimeout(() => {
        playSound('click');
    }, 62.5);
    
    const rect = image1.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    
    // Log coordinates for debugging
    console.log('Clicked at:', x, y);
    checkDifference(x, y);
}

// Check if the clicked position is a difference
function checkDifference(x, y) {
    for (const diff of gameConfig.differences) {
        // Check if the click is within the tolerance range of any valid coordinate
        for (const coord of diff.validCoordinates) {
            if (!foundDifferences.includes(diff) &&
                x >= coord.x - gameConfig.tolerance && x <= coord.x + diff.width + gameConfig.tolerance &&
                y >= coord.y - gameConfig.tolerance && y <= coord.y + diff.height + gameConfig.tolerance) {
                foundDifferences.push(diff);
                score++;
                updateScore();
                
                highlightDifference(diff, coord);
                checkGameCompletion();
                return;
            }
        }
    }
}

// Highlight the found difference
function highlightDifference(diff, coord) {
    // Remove any existing highlights first
    const existingHighlights = document.querySelectorAll('.highlight');
    existingHighlights.forEach(highlight => highlight.remove());
    
    const highlight = document.createElement('div');
    highlight.className = 'highlight';
    highlight.style.left = coord.x + 'px';
    highlight.style.top = coord.y + 'px';
    highlight.style.width = diff.width + 'px';
    highlight.style.height = diff.height + 'px';
    
    // Add the highlight to the image wrapper
    const imageWrapper = image1.parentElement;
    imageWrapper.appendChild(highlight);
    
    // Log for debugging
    console.log('Highlight added at:', coord.x, coord.y, diff.width, diff.height);
}

// Update the score display
function updateScore() {
    scoreElement.textContent = `Differences found: ${score}/${gameConfig.differences.length}`;
}

// Update the timer display
function updateTimer() {
    timerElement.textContent = `Time: ${seconds}s`;
}

// Start the game timer
function startTimer() {
    gameTimer = setInterval(() => {
        seconds++;
        updateTimer();
    }, 1000);
}

// Stop the game timer
function stopTimer() {
    clearInterval(gameTimer);
}

// Check if all differences have been found
function checkGameCompletion() {
    if (foundDifferences.length === gameConfig.differences.length) {
        stopTimer();
        
        // Add a 3-second delay before playing the success sound and showing the congratulations page
        setTimeout(() => {
            // Play success sound after the delay
            playSound('success');
            
            // Show the congratulations page immediately after playing the success sound
            showCongratsPage();
        }, 3000);
    }
}

// Show the game page
function showGamePage() {
    homePage.style.display = 'none';
    gamePage.style.display = 'flex';
    congratsPage.style.display = 'none';
    initGame();
    startTimer();
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
    finalScoreElement.textContent = `${score}/${gameConfig.differences.length}`;
}

// Start the game
function startGame() {
    // Add a 0.0625 second delay before playing the click sound
    setTimeout(() => {
        playSound('click');
    }, 62.5);
    showGamePage();
}

// Event Listeners
document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('playAgain').addEventListener('click', startGame);
document.getElementById('congratsToHome').addEventListener('click', showHomePage);

// Add click sounds to all buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add click sounds to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        addClickSoundToElement(button);
    });
    
    // Add click sounds to other interactive elements
    const interactiveElements = document.querySelectorAll('a, .image-wrapper, .game-info, .stats, .congrats-buttons');
    interactiveElements.forEach(element => {
        addClickSoundToElement(element);
    });
    
    loadGameConfig();
    showHomePage();
}); 