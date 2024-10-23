class Character {

	/*
	*	Character constructor.
	*
	* @param vector Vector object describing the Characters location
	* @param health The starting health value for the Character
	* @param sprite The sprite file for the Character
	*/
	constructor(vector, health, sprite, box) {
		this.location = vector;
		this.health = health;
		this.sprite = sprite;
		this.boxes = box;
		this.alive = true;
	}

	/*
	 *	Changes position of Character object.
	 *
	 *	@param x X location
	 *	@param y Y location
	 */
	move(x, y) {
		this.location = this.location.setLocation(x, y); // make sure Vector has this method
	}

	/*
	 *	Decrements health by one.
	 */
	takeDamage() {
		if (this.health == 0) {
			return;
		}
		this.health--;
		if (this.health <= 0) {
			this.alive = false;
		}
	}


	/*
	*	Abstract attack method for creating attack animation,
	*	must be implemented in subclasses.
	*/
	attack() {
		throw new Error("This method should be implemented within the Player/Enemy subclasses.");
	}

	/*
	*	Abstract draw method for drawing the Character onto canvas every frame,
	*	must be implemented in subclasses due to different sprites.
	*/
	draw() {
		throw new Error("This method should be implemented within the Player/Enemy subclasses, as the sprites are different");
	}

	/*
	*	Checks if a hitBox is within the Character.
	*
	*	@param hitBox The box object to check for
	*	@returns boolean true if box is part of Character, else false
	*/
	checkHit(hitBox) {
		x1 = hitBox.x;
		x2 = x1 + hitBox.width;
		y1 = hitBox.y;
		y2 = y2 + hitBox.height;
		if (this.box.x >= x1 && this.box.x <= x2 && this.box.y >= y1 && this.box.y <= y2) {
			return true;
		}
		return false;
	}
}
