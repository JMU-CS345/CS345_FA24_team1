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
        this.maxHealth = health;
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

        // Random ID
        this.id = Math.floor(Math.random() * 1000000)
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
            // set box x/y so that references stay the same
			this.location = loc.clone();
			this.box.x = loc.x;
			this.box.y = loc.y;
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
		if (this.health > 0) {
			this.health -= Math.floor(damage);
			if (this.health <= 0) {
				this.health = 0;
				this.alive = false;
				if (this instanceof Enemy) {
					this.arena.score += 1;
					if (this.arena.score > this.arena.highscore) {
						this.arena.highscore = this.arena.score
						storeItem("highScore", this.arena.highscore);
					}
				}
			}
			if (this instanceof Player) {
				this.arena.playergrunt.play();
			}
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
        // Weapon drawing
        this.weapons.forEach((weapon) => weapon.draw());

		// All animations -> for current state -> for facing -> for frame
		const aniframe =
				this.animations[this.state][this.facing][this.currentFrame];
		const sx = aniframe.x,
		      sy = aniframe.y,
              bx = aniframe.bx,
		      sw = this.animations.cellWidth,
		      sh = this.animations.cellHeight,
		      cw = this.animations.charWidth,
		      ch = this.animations.charHeight;

		// Need to scale body so that it goes from (charWidth, charHeight) to
		// (box.width, box.height) -> * by box.width,height / charWidth,Height
		const dw = sw * this.box.width / cw,
		      dh = sh * this.box.height / ch;

		// Actual body (which should take up 100% of hitbox) has bottom
		// left corner at (bx, sh-1) and width=charWidth height=charHeight.
		// Top left at (bx, sh-charHeight-2).
		// So shift sprite backwards by that, scaled up by dw/dh.
		const dx = this.location.x - dw * (bx / sw),
		      dy = this.location.y - dh * ((sh - ch - 2) / sh);

		image(this.sprite, dx, dy, dw, dh, sx, sy, sw, sh);

        // Health bar above the character
        // Over only the character's body in width and 1/16th of the entire
        // character sprite in height
        if (this.alive) {
            const barheight = dh >> 4, /* height of bars */
                  bodywidth = cw * dw / sw, /* width of full max hp bar */
                  barstartx = dx + (bx * dw / sw), /* left side of bar */
                  barstarty = dy, /* top side of bar */
                        /* width of bar showing current HP */
                  fillwidth = bodywidth * this.health / this.maxHealth;

            noStroke();
            fill(0, 0, 0);
            rect(barstartx, barstarty, bodywidth, barheight);

            fill(40, 222, 40);
            rect(barstartx, barstarty, fillwidth, barheight);
        }
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
