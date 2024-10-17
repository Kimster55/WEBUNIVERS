// Set up the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set the ball and paddle sizes
const ballSize = 20;
const paddleWidth = 15;
const paddleHeight = 60;

// Set the ball speed
let ballSpeedX = 5;
let ballSpeedY = 5;

// Set the scores
let playerScore = 0;
let opponentScore = 0;

// Create the ball
let ballX = canvas.width/2 - ballSize/2;
let ballY = canvas.height/2 - ballSize/2;

// Create the paddles
let playerPaddleY = canvas.height/2 - paddleHeight/2;
let opponentPaddleY = canvas.height/2 - paddleHeight/2;

// Set the game loop
let gameRunning = true;
const frameRate = 60;
const frameTime = 1000/frameRate;
let lastFrameTime = 0;

function gameLoop(timestamp) {
	// Calculate time since last frame
	const deltaTime = timestamp - lastFrameTime;
	lastFrameTime = timestamp;

	// Move the player paddle
	if (keys[38] && playerPaddleY > 0) {
		playerPaddleY -= 5;
	}
	if (keys[40] && playerPaddleY + paddleHeight < canvas.height) {
		playerPaddleY += 5;
	}

	// Move the opponent paddle
	if (ballY < opponentPaddleY + paddleHeight/2) {
		opponentPaddleY -= 5;
	}
	if (ballY > opponentPaddleY + paddleHeight/2) {
		opponentPaddleY += 5;
	}

	// Move the ball
	ballX += ballSpeedX * deltaTime/frameTime;
	ballY += ballSpeedY * deltaTime/frameTime;

	// Check for collisions with walls
	if (ballY < 0 || ballY + ballSize > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}

	// Check for collisions with paddles
	if (ballX < paddleWidth && ballY + ballSize > playerPaddleY && ballY < playerPaddleY + paddleHeight) {
		ballSpeedX = -ballSpeedX;
	}
	if (ballX + ballSize > canvas.width - paddleWidth && ballY + ballSize > opponentPaddleY && ballY < opponentPaddleY + paddleHeight) {
		ballSpeedX = -ballSpeedX;
	}

	// Check for score
	if (ballX < 0) {
		opponentScore++;
		ballX = canvas.width/2 - ballSize/2;
		ballY = canvas.height/2 - ballSize/2;
		ballSpeedX = 5;
		ballSpeedY = 5;
	}
	if (ballX + ballSize > canvas.width) {
		playerScore++;
		ballX = canvas.width/2 - ballSize/2;
		ballY = canvas.height/2 - ballSize/2;
		ballSpeedX = -5;
		ballSpeedY = -5;
	}

	// Draw the game
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "white";
	ctx.fillRect(0, playerPaddleY, paddleWidth, paddleHeight);
	ctx.fillRect(canvas.width - paddleWidth, opponentPaddleY, paddleWidth, paddleHeight);
	ctx.fillRect(ballX, ballY, ballSize, ballSize);
	ctx.font = "30px Arial";
    ctx.fillText(playerScore, canvas.width/4, 50);
	ctx.fillText(opponentScore, 3*canvas.width/4, 50);

	// Check for game over
	if (playerScore === 10 || opponentScore === 10) {
		gameRunning = false;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (playerScore === 10) {
			ctx.fillText("You win!", canvas.width/2 - 50, canvas.height/2);
		}
		if (opponentScore === 10) {
			ctx.fillText("You lose!", canvas.width/2 - 50, canvas.height/2);
		}
	}

	// Call the game loop again
	if (gameRunning) {
		window.requestAnimationFrame(gameLoop);
	}
}

// Start the game loop
window.requestAnimationFrame(gameLoop);

// Set up the keyboard controls
const keys = [];
document.addEventListener("keydown", event => {
	keys[event.keyCode] = true;
});
document.addEventListener("keyup", event => {
	keys[event.keyCode] = false;
});