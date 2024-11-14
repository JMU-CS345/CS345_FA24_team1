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

		this.alive = true;
		this.facing = Direction.LEFT;

    	this.animations = animations;
    	this.state = "idle";
    	this.currentFrame = 0;
    	this.frameDelay = 12;
    	this.frameTimer = 0;
	}

	/*
	*	Draw method for drawing the Character onto canvas every frame,
	*/
	draw() {
		// All animations -> for current state -> for facing -> for frame
		const aniframe =
				this.animations[this.state][this.facing][this.currentFrame];
		const sx = aniframe.x,
		      sy = aniframe.y,
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
		const dx = this.location.x - dw * (aniframe.bx / sw),
		      dy = this.location.y - dh * ((sh - ch - 2) / sh);

		image(this.sprite, dx, dy, dw, dh, sx, sy, sw, sh);

        // DRAW DETAILS TO RIGHT
        textSize(20);
        stroke(0, 0, 0);
        text("dx: " + dx, dx+300, dy);
        text("dy: " + dy, dx+300, dy+50);
        text("dw: " + dw, dx+300, dy+100);
        text("dh: " + dh, dx+300, dy+150);
        text("sx: " + sx, dx+300, dy+200);
        text("sy: " + sy, dx+300, dy+250);
        text("sw: " + sw, dx+300, dy+300);
        text("sh: " + sh, dx+300, dy+350);
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
