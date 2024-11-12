class Enemy extends Character {
  constructor(arena, vector, health, sprite, box, speed, animations) {
    super(arena, vector, health, sprite, box, speed, animations);
    this.state = "moving";
  }

  /**
   * Updates enemy each tick.
   */
  update() {
    // Enemy doesn't update when dead
    if (!this.alive) {
      this.state = "dead";
      this.currentFrame = 0;
      return;
    }

    // Do nothing if player dead
    if (!this.arena.getPlayer().alive) return;

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
