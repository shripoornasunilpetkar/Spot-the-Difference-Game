# Spot the Difference Game
Welcome to the Spot the Difference game – a fun, modern, and mobile-friendly web game built using HTML, CSS, and JavaScript. The challenge? Find all the subtle differences between two nearly identical images placed side-by-side.

## Overview
This project is powered by a simple and flexible JSON configuration, making it super easy to set up your own version. Players interact with two images and try to spot the differences between them. The layout is responsive, so it works great whether you're playing on a phone, tablet, or desktop.

## Features
JSON Configuration: Easily customize the game with a config file – no hardcoding needed.

Interactive Gameplay: Click on the left image to find differences.

Visual Feedback: Every correct click highlights the difference.

Score Tracking: Keeps count of how many differences you've found.

Timer: Tracks how long it takes you to complete the game.

Sound Effects: Adds a bit of audio fun to your clicks and progress.

Responsive Design: Play comfortably on any screen size.

## How to Run the Game
### Local Development
Clone this repository to your local computer.

Open a terminal and navigate into the project folder.

Start a local server using one of these options:

With Python:

yaml
Copy
Edit
python -m http.server 8000
With Node.js:

nginx
Copy
Edit
npx serve
Open a web browser and go to http://localhost:8000

### Deployment
You can easily deploy this game online using any of these platforms:

Vercel: Includes a vercel.json file for quick setup.

Netlify: Just drag and drop the whole folder into the dashboard.

GitHub Pages: Push to GitHub and enable Pages in your repo settings.

## How the Game Uses the JSON File
Everything the game needs – title, images, and difference areas – comes from config.json. It's clean, organized, and easy to edit.

Here's what's inside:

Game Title: Displays at the top of the screen.

Image Paths: Where your game images live.

Differences: List of coordinates and sizes for each difference.

Tolerance: How forgiving the click detection is.

### Example JSON Structure:
json
Copy
Edit
{
  "gameTitle": "Spot the Difference",
  "images": {
    "image1": "images/image1.jpeg",
    "image2": "images/image2.jpeg"
  },
  "differences": [
    { 
      "validCoordinates": [
        { "x": 296, "y": 368 },
        { "x": 408, "y": 353 },
        { "x": 364, "y": 423 },
        { "x": 202, "y": 361 }
      ],
      "width": 60,
      "height": 60
    }
  ],
  "tolerance": 30
}
### Customizing the Game
Want to make your own version? Here's how:

Swap out the images in the images folder with your own.

Open config.json and:

Change the game title

Update the paths to your new images

Add coordinates for the differences (your browser's developer tools can help with this)

Tweak the tolerance value if needed

## Game Mechanics
Click only on the left image to find differences.

Your score and time are tracked automatically.

Each found difference gets highlighted.

Find them all to finish the game!

Once done, you'll see a congratulatory screen.

## Technical Implementation
The game is built using standard web technologies:

HTML5: For the basic structure

CSS3: Handles styling and layout

JavaScript: Powers all the logic and interactivity

JSON: Stores and loads game data
<<<<<<< HEAD

=======
>>>>>>> e3e49b9d5459bcfeae532554c8f5a2013d45ad0f
