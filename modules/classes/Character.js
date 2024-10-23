class Character {

	/*
	*	Character constructor.
	*
	* @param vector Vector object describing the Characters location
	* @param health The starting health value for the Character
	* @param sprite The sprite file for the Character
	*/
	constructor(vector, health, sprite) {
		this.location = vector;
		this.health = health;
		this.sprite = sprite;
		this.boxes = [];
		this.alive = true;
	}

	/*
	 *	Changes position of Character object.
	 *
	 *	@param x X location
	 *	@param y Y location
	 */
	move(x, y) {
		//this.location = new Vector(x, y); Vector class unfinished
	}

	/*
	 *	Decrements health by one.
	 */
	takeDamage() {
		this.damage--;
		if (this.damage <= 0) {
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
		for (let box of boxes) {
			if (box.x == hitBox.x && box.y == hitBox.y) {
				return true;
			}
		}
		return false;
	}
}
