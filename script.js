const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 580;

// Game variables
let bird = {
    x: 50,
    y: 150,
    width: 35,
    height: 30,
    gravity: 0.2,
    lift: -4,
    velocity: 0
};

let pipes = [];
let frameCount = 0;
let pipeWidth = 25;
let pipeGap = 200;
let pipeSpeed = 1;
let isGameOver = false;

// Load bird image (optional)
const birdImg = new Image();
birdImg.src = 'https://cdn.pixabay.com/photo/2016/03/02/13/59/bird-1232416_1280.png'; // Replace with any bird image URL

// Function to draw bird
function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// Function to create pipes
function createPipes() {
    if (frameCount % 100 === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({
            x: canvas.width,
            y: pipeHeight
        });
    }
}

// Function to draw pipes
function drawPipes() {
    pipes.forEach((pipe, index) => {
        ctx.fillStyle = '#333';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y); // Top pipe
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height); // Bottom pipe

        pipe.x -= pipeSpeed; // Move pipes to the left

        // Remove pipes that go off screen
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
        }
    });
}

// Function to check for collisions
function checkCollisions() {
    pipes.forEach(pipe => {
        if (
            (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)) ||
            bird.y + bird.height >= canvas.height
        ) {
            isGameOver = true;
        }
    });
}

// Function to handle bird's physics (fall and flap)
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Prevent bird from falling off the top of the screen
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    // If bird hits the ground
    if (bird.y + bird.height >= canvas.height) {
        isGameOver = true;
    }
}

// Function to reset the game
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    isGameOver = false;
    frameCount = 0;
}

// Game loop function
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isGameOver) {
        drawBird();
        createPipes();
        drawPipes();
        checkCollisions();
        updateBird();

        frameCount++;
    } else {
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', 80, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Press Space to Restart', 50, canvas.height / 2 + 40);
    }

    requestAnimationFrame(gameLoop);
}

// Event listener for bird flap (spacebar)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!isGameOver) {
            bird.velocity = bird.lift; // Make the bird flap
        } else {
            resetGame(); // Restart the game
        }
    }
});

// Start the game loop
gameLoop();
      