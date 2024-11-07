class Enemy extends Character {
  constructor(arena, vector, health, sprite, box, speed) {
    super(arena, vector, health, sprite, box, speed);
  }

  /**
   * Updates enemy each tick.
   */
  update() {

    // If enemy is dead do nothing.
    console.log(`alive: ${this.alive}`);
    if (this.alive) {
      // Move towards player. TODO: pathfind around obstacles in way
      // Get the player's position
      const player = this.arena.getPlayer();
      const playerBox = player.box;

      // Simple logic to move towards the player
      // Only move if not already on top of player
      if (!this.box.intersects(playerBox)) {
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
          super.currentWeapon().fire();
        }, super.currentWeapon().wtype.firerate * 5000);
      }
    }
  }

  /**
   * Draws enemy onto p5 canvas.
   */
  draw() {
    image(this.sprite, this.location.x, this.location.y);
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
