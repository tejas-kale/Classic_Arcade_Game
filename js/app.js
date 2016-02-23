// Define image dimensions
var IMAGE_WIDTH = 101;
var IMAGE_HEIGHT = 83;

// Define constants for position constraints and starting positions
var PLAYER_START_X = 202;
var MIN_X = 0;
var ENEMY_MAX_X = 505;
var PLAYER_MAX_X = 404;
var PLAYER_START_Y = 404;
var MIN_Y = 0;
var MAX_Y = 404;

// Define task completion count
var NUM_COMPLETIONS = 0;



/*
	* Class that defines an enemy object.
	*
	* Consists of object constructor and the following methods:
	* - update: Modify object position after a input time epoch.
	* - render: Draw enemy on screen.
*/


/* 
	* Constructor method for enemy object
	* 
	* [y] - Row that the enemy will walk on. Valid options are 1, 2, 3.
	* [speed] - Number specifying how many pixels the enemy will cover per time epoch.
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


/* 
	* Update enemy position
	* 
	* [dt] - Time delta between ticks.
*/
Enemy.prototype.update = function (dt) {
	// Enemy can only move along X axis and displacement is time x speed
    this.x += dt * this.speed;

    // Put the enemy back in the frame from the left when it goes out from the right
    if (this.x > ENEMY_MAX_X) {
    	this.x = -IMAGE_WIDTH;
    }
};


/*
	* Draw enemy on screen
*/
Enemy.prototype.render = function () {
	// Place image on canvas
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};




/*
	* Class that defines a player object.
	*
	* Consists of object constructor and the following methods:
	* - update: Modify object position on collision with an enemy.
	* - render: Draw player on screen.
	* - handleInput: Capture key movements from user and modify player position.
	* - reset: Take player back to starting position.
	* - collision: Determine if a player object is intersecting with any of the enemy objects.
*/


/* 
	* Constructor method for player object
*/
var Player = function () {
	this.sprite = 'images/char-boy.png';

	// Player starts in the centre of middle column
	this.x = PLAYER_START_X;

	// Player starts in the centre of bottom row
	this.y = PLAYER_START_Y;
}


Player.prototype.update = function (dt) {
	if (this.collision() == true) {
		// Move player to starting position
		this.reset(PLAYER_START_X, PLAYER_START_Y);

		// Decrement task completion count by 1
		NUM_COMPLETIONS = Math.max(NUM_COMPLETIONS - 1, 0)

		// Show toast
		$(".bitten").fadeIn(400).delay(3000).fadeOut(400)
	}

	// Show task completion count
	this.show_count(NUM_COMPLETIONS);

	return this;
}


Player.prototype.render = function () {
	console.log(ctx);
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function (key) {
	// Update player position in temporary variables
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

		// Increment task completion count by 1
		NUM_COMPLETIONS += 1;
		this.show_count(NUM_COMPLETIONS);
	} else {
		// Ensure that the player is visible
		if (this.x < MIN_X) {
			this.reset(MIN_X);
		} else if (this.x >= PLAYER_MAX_X) {
			this.reset(PLAYER_MAX_X);
		}

		if (this.y > MAX_Y) {
			this.reset(undefined, MAX_Y);
		} 
	}

	return this;
}

Player.prototype.reset = function (x, y) {
	if (x != undefined) {
		this.x = x;
	}

	if (y != undefined) {
		this.y = y;
	}

	return this;
}

Player.prototype.collision = function () {
	for (var i = 0; i < allEnemies.length; i++) {
		if (((this.x > allEnemies[i].x && (allEnemies[i].x + IMAGE_WIDTH) > this.x) || (this.x < allEnemies[i].x && allEnemies[i].x < (this.x + IMAGE_WIDTH))) &&  (allEnemies[i].y + 9 == this.y)) {
			return true;
		}
	}
}

Player.prototype.change_sprite = function (name) {
	this.sprite = 'images/' + name + '.png';

	return this;
}

Player.prototype.show_count = function (count) {
	// Set text font and fill properties
	ctx.font = "24px Impact";
	ctx.textAlign = "center";
	ctx.fillStyle = "#FFFFFF";

	// Print count at the top right corner of canvas
	ctx.fillText("test", 100, 100);
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
