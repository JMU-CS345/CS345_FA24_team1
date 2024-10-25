// TODO: Finish checkHit method
// TODO: Pass Character.tests.js

class Character {

	/*
	*	Character constructor.
	*
	* @param vector Vector object describing the Characters location
	* @param health The starting health value for the Character
	* @param sprite The sprite file for the Character
	*/
	constructor(vector, health, sprite, box, speedX, speedY) {
		this.location = vector;
		this.health = health;
		this.sprite = sprite;
		this.box = box;
		this.alive = true;
		this.speedX = speedX;
		this.speedY = speedY;
	}

	/*
	 *	Changes position of Character object.
	 *
	 *	@param x X location
	 *	@param y Y location
	 */
	move(x, y) {
		this.location = this.location.setLocation(x, y); // make sure Vector has this method
		this.location.fromCartesian(x, y);
		this.box.x = this.location.x;
		this.box.y = this.location.y;
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
	*	Checks if the character and another box intersect.
	*
	*	@param hitBox The box object to check for
	*	@returns boolean true if box is part of Character, else false
	*/
	checkHit(hitBox) {
		return this.box.intersect(hitBox);
	}
}


if ((typeof exports) !== "undefined") module.exports = Character;
