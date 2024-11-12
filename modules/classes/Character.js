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
	* @param animations Sprite animation information object
	*/
	constructor(arena, vector, health, sprite, box, speed, animations) {
		this.arena = arena;
		this.location = vector;
		this.health = health;
		this.sprite = sprite;
		this.box = box;
		this.speed = speed;

		// Characters start off with no weapons
		this.weapons = [];
		this.curWID = -1; // Current weapon index

		this.alive = true;
		this.facing = Direction.LEFT;

    	this.animations = animations;
    	this.state = "idle";
    	this.currentFrame = 0;
    	this.frameDelay = 12;
    	this.frameTimer = 0;
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
		const newBox = new Box(
			loc.x, loc.y,
			this.box.width, this.box.height
		);
		if (this.arena.isValidBoxLocation(newBox)) {
			// Update direction facing
			this.facing = Direction.primaryDirectionChange(this.location, loc);

			// clone so calling class can't modify location after return
			this.location = loc.clone();
			this.box = newBox;
		}
	}

	/*
	 *	Decrements health by one.
	 */
	takeDamage() {
		this.takeDamage(1);
	}

	/*
	 *	Decrements health by specified amount.
	 *
	 *	@param damage The specified amount of damage to receive
	 */
	takeDamage(damage) {
		this.health -= damage;
		if (this.health <= 0) {
			this.health = 0;
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
	*	Abstract update method for updating information about this Character,
	*	must be implemented in subclasses.
	*/
	update() {
		throw new Error("This method should be implemented within the Player/Enemy subclasses.");
	}

	/*
	*	Draw method for drawing the Character onto canvas every frame,
	*/
	draw() {
		// Width/height of each spritesheet box
		const sw = 32;
		const sh = 32;

		// All animations -> for current state -> for facing -> for frame
		const aniframe =
				this.animations[this.state][this.facing][this.currentFrame];
		const sx = aniframe.x,
              sy = aniframe.y;

		// using fixed width and height for easier visibility, sprite is really small
		image(this.sprite, this.location.x, this.location.y,
				this.box.width, this.box.height, sx, sy, sw, sh);
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

	/*
	*	Returns the current weapon held by this Character.
	*
	*	@returns the current Weapon object that this Character has equipped,
	*	         or null if this Character is not holding a weapon.
	*/
	currentWeapon() {
		return (this.curWID == -1) ? null : this.weapons[this.curWID];
	}

	/*
	*	Switches to the weapon at the given index. Pass -1 to unequip all.
	*
	*	@param wid the index of the weapon (in this.weapons) to equip
	*	@returns true if switch successful, false on invalid index
	*/
	switchWeapon(wid) {
		if ((wid < -1) || (wid >= this.weapons.length)) return false;
		this.curWID = wid;
		return true;
	}

	/*
	*	Adds the passed Weapon object to the list of weapons owned by this
    *	Character. If equip is true, the weapon is immediately equipped.
	*
	*	@param weapon the Weapon to add
	*	@param equip whether or not to equip the weapon immediately
	*/
	addWeapon(weapon, equip) {
		this.weapons.push(weapon);
		if (equip) this.curWID = this.weapons.length - 1;
	}

	/*
	 *	Scales this Character by the passed factors.
	 *
	 *	@param scalex Scaling multiplier in the X direction
	 *	@param scaley Scaling multiplier in the Y direction
	 */
	scale(scalex, scaley) {
		this.location.x *= scalex;
		this.location.y *= scaley;
		this.box.x *= scalex;
		this.box.y *= scaley;
		this.box.width *= scalex;
		this.box.height *= scaley;
	}
}

if ((typeof exports) !== "undefined") module.exports = Character;
