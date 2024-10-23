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
	constructor(vector, health, sprite, box) {
		this.location = vector;
		this.health = health;
		this.sprite = sprite;
		this.box = box;
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
	*	Checks if the character and another box intersect.
	*
	*	@param hitBox The box object to check for
	*	@returns boolean true if box is part of Character, else false
	*/
	checkHit(hitBox) {
		// TODO: finish this method
		let x1 = hitBox.x;
		let x2 = x1 + hitBox.width;
		let y1 = hitBox.y;
		let y2 = y1 + hitBox.height;
		let charX1 = this.box.x;
		let charX2 = charX1 + this.box.width;
		let charY1 = this.box.y;
		let charY2 = charY1 + this.box.height;

		if (charX1 > x2 || x2 < charX2) {
			return false;
		}
		if (charY1 > y2 || y2 > charY2) {
			return false;
		}
		return true;
	}
}


if ((typeof exports) !== "undefined") module.exports = Character;
