// Image dimensions
var IMAGE_WIDTH = 101;
var IMAGE_HEIGHT = 83;
var IMAGE_ADJUSTMENT = 9; // Correction factor for enemy images that puts them in the same row as players

// Position constraints and starting positions
var PLAYER_START_X = 202;
var MIN_X = 0;
var ENEMY_MAX_X = 505;
var PLAYER_MAX_X = 404;

var PLAYER_START_Y = 404;
var MIN_Y = 0;
var MAX_Y = 404;

// Success displays
var COUNT_X = 475;
var COUNT_Y = 90;

var STAR_X = 460;
var STAR_Y = 40;
var STAR_WIDTH = 30;
var STAR_HEIGHT = 60;




/** 
	* Class that defines an enemy object.
	* @constructor
	* @param {int} y - Row that the enemy will walk on. Valid options are 1, 2, 3.
	* @param {int} speed - Number specifying how many pixels the enemy will cover per time epoch.
*/
var Enemy = function (y, speed) {
	// Image representing the enemy
    this.sprite = 'images/enemy-bug.png';

    // Enemies need to out of the frame to begin with
    this.x = -IMAGE_WIDTH;

    // Each enemy gets its own row with valid y inputs being 1, 2, 3
    if (y > 0 && y < 4) {
    	// Each row is 83 pixels in height
    	// Subtracting 20 pixels from image width to line up every enemy within a row
    	this.y = y * 83 - 20;
    } else {
    	// If y input is out of range, place the enemy in the last row
    	this.y = 249;
    }

    // Enemy speed
    this.speed = speed;
};


/** 
	* Update enemy position
	* 
	* @param {float} dt - Time delta between ticks.
*/
Enemy.prototype.update = function (dt) {
	// Enemy can only move along X axis and displacement is time x speed
    this.x += dt * this.speed;

    // Put the enemy back in the frame from the left when it goes out from the right
    if (this.x > ENEMY_MAX_X) {
    	this.x = -IMAGE_WIDTH;
    }
};


/**
	* Draw enemy on screen
*/
Enemy.prototype.render = function () {
	// Place image on canvas
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};




/** 
	* Class that defines a player object.
	* @constructor
*/
var Player = function () {
	// Default player image
	this.sprite = 'images/char-boy.png';

	// Player starts in the centre of middle column
	this.x = PLAYER_START_X;

	// Player starts in the centre of bottom row
	this.y = PLAYER_START_Y;

	// Number of times a player has successfully completed the task
	this.successes = 0;
}


/** 
	* Bring player back to starting position if bitten.
*/
Player.prototype.update = function () {
	// Check if player has collided with any enemy
	if (this.collision() == true) {
		// Move player to starting position
		this.reset(PLAYER_START_X, PLAYER_START_Y);

		// Decrement task success count by 1
		this.successes = Math.max(this.successes - 1, 0)

		// Show toast
		$(".bitten").fadeIn(400).delay(3000).fadeOut(400)
	}
}


/**
	* Draw player on screen
*/
Player.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


/**
	* Move player based on input key.
	*
	* @param {string} key - Direction of player movement.
*/
Player.prototype.handle_input = function (key) {
	// Update player position in its object
	if (key == "left") {
		this.x -= 101;
	} else if (key == "up") {
		this.y -= 83;
	} else if (key == "right") {
		this.x += 101;
	} else if(key == "down") {
		this.y += 83;
	}
	
	// Bring player to starting position if it has reached water
	if (this.y <= MIN_Y) {
		this.reset(PLAYER_START_X, PLAYER_START_Y);

		// Increment task success count by 1
		this.successes += 1;
	} else {
		// Ensure that the player does not get moved out of visibility
		if (this.x < MIN_X) {
			this.reset(MIN_X);
		} else if (this.x >= PLAYER_MAX_X) {
			this.reset(PLAYER_MAX_X);
		}

		if (this.y > MAX_Y) {
			this.reset(undefined, MAX_Y);
		} 
	}
}


/** 
	* Set input player object attributes.
	*
	* @param {int} x - Player position along X axis.
	* @param {int} y - Player position along Y axis.
	* @param {int} successes - Number of times a player has successfully completed the tasks.
*/
Player.prototype.reset = function (x, y, successes) {
	if (x != undefined) {
		this.x = x;
	}

	if (y != undefined) {
		this.y = y;
	}

	if (successes != undefined) {
		this.successes = successes;
	}
}


/**
	* Detect if the player is colliding with any enemy.
*/
Player.prototype.collision = function () {
	// Check every enemy position for possible collision with player
	for (var i = 0; i < allEnemies.length; i++) {
		/*
			* An enemy and player are said to collide if the rectangles of their images overlap.
			* If the enemy's X axis position is behind the player's, there is a X overlap if the sum of image width and enemy's X axis position is greater than the player's X position.
			* Vice versa (i.e. enemy is ahead of player), there is a X overlap if the sum of image width and player's X axis position is greater than the enemy's X position.
			* As each enemy sticks to its row, there is a Y overlap if the enemy's Y axis position (plus adjustment factor) is equal to the player's Y position.
			* A collision is returned if both X and Y overlap are seen.
		*/
		if (((this.x > allEnemies[i].x && (allEnemies[i].x + IMAGE_WIDTH) > this.x) || (this.x < allEnemies[i].x && allEnemies[i].x < (this.x + IMAGE_WIDTH))) &&  (allEnemies[i].y + IMAGE_ADJUSTMENT == this.y)) {
			return true;
		}
	}
}


/**
	* Change player image based on user choice.
	*
	* @param {string} name - PNG file name that is the character of choice.
*/
Player.prototype.change_sprite = function (name) {
	this.sprite = 'images/' + name + '.png';
}


/**
	* Display task successes of player
*/
Player.prototype.show_successes = function () {
	// Set text font, stroke, and fill properties
	ctx.font = "bold 36px Impact";
	ctx.textAlign = "center";

	ctx.fillStyle = "#FFFFFF";

	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 3;

	// Compute number of Orange gems earned
	var oranges = Math.floor(this.successes / 5);

	// Show the golden star if 3 orange gems are earned
	if (oranges == 3) {
		ctx.drawImage(Resources.get('images/star.png'), STAR_X, STAR_Y, STAR_WIDTH, STAR_HEIGHT);

		// Show congratulatory message and reset player
		$("#congratulations").modal('show');
		player.reset(PLAYER_START_X, PLAYER_START_Y, 0)
	} else {
		// Show success count
		ctx.fillText(this.successes - (oranges * 5), COUNT_X, COUNT_Y);
		ctx.strokeText(this.successes - (oranges * 5), COUNT_X, COUNT_Y)

		// Show orange gems earned
		for (var i = 1; i <= oranges; i++) {
			ctx.drawImage(Resources.get('images/gem-orange.png'), STAR_X - (i * 35), STAR_Y, STAR_WIDTH, STAR_HEIGHT)
		}
	}	
}


// Instantiate enemy and player objects
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

    player.handle_input(allowedKeys[e.keyCode]);
});