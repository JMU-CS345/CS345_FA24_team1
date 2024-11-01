class Enemy extends Character {
  constructor(arena, vector, health, sprite, box, speed, fireRate, damage) {
    super(arena, vector, health, sprite, box, speed, fireRate, damage);
    this.cooldown = false;
  }

  /**
   * Updates enemy each tick.
   */
  update() {
    // Move towards player. TODO: pathfind around obstacles in way
    // Get the player's position
    const player = this.arena.getPlayer();
    const playerBox = player.box;

    // Simple logic to move towards the player
    // Only move if not already on top of player
    if (!this.box.intersects(playerBox)) {
      if (this.box.x < playerBox.x) {
        this.move(new Vector2D(this.speed, 0).add(this.location)); // right
      } else if (this.box.x > playerBox.x) {
        this.move(new Vector2D(-this.speed, 0).add(this.location)); // left
      }

      if (this.box.y < playerBox.y) {
        this.move(new Vector2D(0, this.speed).add(this.location)); // down
      } else if (this.box.y > playerBox.y) {
        this.move(new Vector2D(0, -this.speed).add(this.location)); // up
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
   * Attacks when player is within range
   */
  attack() {
    if (this.cooldown == false) {
      if (this.box.checkHit(arena.getPlayer().box)) {
        arena.getPlayer().takeDamage(this.damage);
        this.cooldown = true;
      }
    } else {
      return;
    }
    setTimeout(() => {  // remove cooldown after fireRate passes
    }, this.fireRate * 1000);
    this.cooldown = false;
  }
}
