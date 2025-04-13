# Spot the Difference Game

A modern, interactive "Spot the Difference" game built with HTML, CSS, and JavaScript. The game features a JSON-based configuration system, making it easy to customize and extend.

## Features
-  Interactive gameplay with two side-by-side images
-  Click-based difference detection
-  Score tracking and timer
-  Success and failure screens
-  Sound effects for interactions
-  Fully responsive design
-  JSON-based configuration

## Project Structure
```
.
├── index.html          # Main game file
├── styles.css          # Game styles
├── game.js             # Game logic
├── config.json         # Game configuration
├── images/             # Game images
│   ├── image3.png
│   └── image4.png
└── sounds/             # Sound effects
    ├── click.wav
    └── Success.wav
```

## How to Run the Game

### Local Development
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd spot-the-difference
   ```

2. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```



### Example Configuration
```json
{
  "gameTitle": "Spot the Difference",
  "levels": [
    {
      "images": {
        "image1": "images/image3.png",
        "image2": "images/image4.png"
      },
      "differences": [
        { 
          "validCoordinates": [
            { "x": 425, "y": 176 }
          ],
          "width": 20,
          "height": 20,
          "tolerance": 20
        }
      ]
    }
  ]
}
```

### Configuration Fields
- `gameTitle`: Title of the game
- `levels`: Array of game levels
  - `images`: Paths to the two images
  - `differences`: Array of difference objects
    - `validCoordinates`: Array of valid click coordinates
    - `width`: Width of the difference area
    - `height`: Height of the difference area
    - `tolerance`: Click tolerance in pixels

## Game Rules
1. Find all differences between the two images
2. Click on the left image to mark differences
3. Complete the game within 60 seconds
4. Each correct click marks a difference
5. Find all differences to win!

