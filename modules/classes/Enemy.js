class Enemy extends Character {
  constructor(arena, vector, health, sprite, box, speed) {
    super(arena, vector, health, sprite, box, speed);
    this.state = "moving";

    this.animations = {
      defaultIdle: {
        0: {0:0},
        1: {64:0},
        2: {128:0},
        3: {192:0}
      },
      defaultMoving: {
        0: {32:0, 0:32},  
        1: {96:0, 64:32},
        2: {160:0, 128:32},
        3: {224:0, 192:32}
      },
      defaultAttacking: {
        0: {0:0, 32:32},
        1: {64:0, 96:32},
        2: {128:0, 160:32},
        3: {192:0, 224:32}
      },
      defaultDead: {
        0: {0:224}
      }
    };
  }

  /**
   * Updates enemy each tick.
   */
  update() {

    if (this.alive) {
      // Move towards player. TODO: pathfind around obstacles in way
      // Get the player's position
      const player = this.arena.getPlayer();
      const playerBox = player.box;

      // Simple logic to move towards the player
      // Only move if not already on top of player
      if (!this.box.intersects(playerBox)) {
        this.state = "moving";
        if (this.box.x < playerBox.x) {
          super.move(new Vector2D(this.speed, 0).add(this.location)); // right
        } else if (this.box.x > playerBox.x) {
          super.move(new Vector2D(-this.speed, 0).add(this.location)); // left
        }

        if (this.box.y < playerBox.y) {
          super.move(new Vector2D(0, this.speed).add(this.location)); // down
        } else if (this.box.y > playerBox.y) {
          super.move(new Vector2D(0, -this.speed).add(this.location)); // up
        }
      }

      // Attacks when enemies box intersects the players box if the enemy is alive
      if (this.box.intersects(playerBox) && this.alive) {

        // timeout to give player a chance to kill enemy
        setTimeout(() => {
          this.state = "attacking";
          super.currentWeapon().fire();
        }, super.currentWeapon().wtype.firerate * 1000);
      }

      // Sprite movement animation frames
      if (this.state === "moving" || this.state === "attacking") {
        this.frameTimer++;
        if (this.frameTimer >= this.frameDelay) {
          this.currentFrame++;
          if (this.currentFrame >= 2) {
            this.currentFrame = 0;
          }
          this.frameTimer = 0;
        }
      }
    }
  }

  /**
   * Draws enemy onto p5 canvas.
   */
  draw() {
    let sx, sy;
    let sw = 32;
    let sh = 32;
    if (this.state === "moving" ) {
      sx = Object.keys(this.animations.defaultMoving[this.facing])[this.currentFrame];
      sy = Object.values(this.animations.defaultMoving[this.facing])[this.currentFrame];
    } else if (this.state === "attacking") {
      sx = Object.keys(this.animations.defaultAttacking[this.facing])[this.currentFrame];
      sy = Object.keys(this.animations.defaultAttacking[this.facing])[this.currentFrame];
    } else if (this.state === "idle") {
      sx = Object.keys(this.animations.defaultIdle[this.facing])[0];
      sy = Object.values(this.animations.defaultIdle[this.facing])[0];
    }
    if (!this.alive) {
      sx = Object.keys(this.animations.defaultDead[0])[0];
      sy = Object.values(this.animations.defaultDead[0])[0];
    }
      
    image(this.sprite, this.location.x, this.location.y, this.box.width, this.box.height, sx, sy, sw, sh);
  }

  /**
   * Attacks player
   */
  attack() {
    const player = arena.getPlayer();
    if (arena.getPlayer().alive) {
      super.currentWeapon().fire();
    }
  }
}
