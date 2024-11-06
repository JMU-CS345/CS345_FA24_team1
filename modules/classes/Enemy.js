class Enemy extends Character {
  constructor(arena, vector, health, sprite, box, speed, fireRate, damage) {
    super(arena, vector, health, sprite, box, speed, fireRate, damage);
    this.cooldown = false;
    this.alive = true;
  }

  /**
   * Updates enemy each tick.
   */
  update() {
    // Move towards player. TODO: pathfind around obstacles in way
    // Get the player's position
    const player = this.arena.getPlayer();
    const playerBox = player.box;

    // If enemy is dead do nothing.
    if (!this.alive) {
      return
    }

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

    // Attacks when enemies box intersects the players box
    if (this.box.intersects(playerBox)) {
      this.attack();
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
    const player = arena.getPlayer();
    if (!this.cooldown && player.alive) {
      setTimeout(() => {  // delay before zombie attacks
        if (this.box.intersects(player.box)) {
          player.takeDamage(this.damage);
          this.cooldown = true;
        }
      }, this.fireRate * 200);
      setTimeout(() => {  // remove cooldown after fireRate passes
        this.cooldown = false;
      }, this.fireRate * 1000);
    } else {
      return;
    }
  }
}
