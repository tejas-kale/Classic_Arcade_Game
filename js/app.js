/*
	* Constants
*/

// Define image dimensions
var IMAGE_WIDTH = 101;

// Define constants for player position constraints and starting positions
var PLAYER_START_X = 100;
var MIN_X = 0;
var MAX_X = 505;
var PLAYER_START_Y = 100;
var MIN_Y = 0;
var MAX_Y = 336;

var WATER_Y = 83;



// Enemies our player must avoid
var Enemy = function(y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Enemies need to out of the frame to begin with
    this.x = -IMAGE_WIDTH;

    // Each enemy gets its own row with valid y inputs being 1, 2, 3.
    // Each row is 83 pixels in height
    if (y > 0 && y < 4) {
    	// Subtracting 20 pixels from image width to line up every enemy within a row
    	this.y = y * 83 - 20;
    } else {
    	// If y input is out of range, place the enemy in the last row
    	this.y = 249;
    }

    // TODO: Insert reasonable speed limits to make the game competitive
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;

    // Put the enemy back in the frame from the left when it goes out from the right
    if (this.x > MAX_X) {
    	this.x = -IMAGE_WIDTH;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	console.log(this);
	// TODO: Sprite should be user selected
	this.sprite = 'images/char-boy.png';

	// Player starts in the centre of middle column
	this.x = PLAYER_START_X;

	// Player starts in the centre of bottom row
	this.y = PLAYER_START_Y;
}

Player.prototype.update = function(newX, newY) {
	// Bring player to starting position if it has reached water
	if (newY < WATER_Y) {
		this.x = PLAYER_START_X;
		this.y = PLAYER_START_Y;
	} else {
		// Ensure that the player is visible
		if (newX < MIN_X) {
			this.x = MIN_X;
		} else if (newX > MAX_X) {
			this.x = MAX_X;
		} else {
			this.x = newX;
		}

		if (newY > MAX_Y) {
			this.y = MAX_Y;
		} else {
			this.y = newY;
		}
	}
}

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
	// Create two variables to hold updates player position
	var tempX = this.x;
	var tempY = this.y;

	// Update player position in temporary variables
	if (key == 37) {
		tempX -= 101;
	} else if (key == 38) {
		tempY += 83;
	} else if (key == 39) {
		tempX += 101;
	} else if(key == 40) {
		tempY -= 83;
	}

	// Update player position in its object
	this.update(tempX, tempY);
}




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
	new Enemy(2, 15),
	new Enemy(1, 70),
	new Enemy(3, 25),
	new Enemy(2, 40),
	new Enemy(1, 39)
];
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
