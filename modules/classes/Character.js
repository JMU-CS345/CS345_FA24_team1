// TODO: Pass Character.tests.js

class Character {

	/*
	*	Character constructor.
	*
	* @param arena The Arena that this Character exists in
	* @param vector Vector object describing the Characters location
	* @param health The starting health value for the Character
	* @param sprite The sprite file for the Character
	* @param box The Box for the Character
	* @param speed The movement speed for the Character
	* @param fireRate The cooldown rate for the Characters attack (how long it must wait before the next attack)
	* @param damage The damage done if an attack hits another Character
	*/
	constructor(arena, vector, health, sprite, box, speed, fireRate, damage) {
		this.arena = arena;
		this.location = vector;
		this.health = health;
		this.sprite = sprite;
		this.box = box;
		this.speed = speed;
		this.fireRate = fireRate;
		this.damage = damage;
		this.alive = true;
	}

	/**
	 * 	Returns location of Vector
	 */
	getLocation() {
		return this.location;
	}

	/*
	 *	Changes position of Character object.
	 *
	 *	@param loc Location vector to move to
	 */
	move(loc) {
		if (this.arena.isValidLocation(loc)) {
			// clone so calling class can't modify location after return
			this.location = loc.clone();
			this.box.x = this.location.x;
			this.box.y = this.location.y;
		}
	}

	/*
	 *	Decrements health by one.
	 */
	takeDamage() {
		if (this.health <= 0) {
			return;
		}
		this.health--;
		if (this.health <= 0) {
			this.alive = false;
		}
	}


	/*
	 *	Decrements health by specified amount.
	 *
	 *	@param damage The specified amount of damage to receive
	 */
	takeDamage(damage) {
		if (this.health == 0) {
			return;
		}
		this.health -= damage;	// health could go negative
		if (this.health <= 0) {
			this.health = 0;			// if negative or 0, set it to 0 and change state to dead
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
		return this.box.intersects(hitBox);
	}
}

if ((typeof exports) !== "undefined") module.exports = Character;
