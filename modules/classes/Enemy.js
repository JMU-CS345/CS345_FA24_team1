class Enemy extends Character {
  constructor(arena, vector, health, sprite, box, speed, fireRate, damage) {
    super(arena, vector, health, sprite, box, speed, fireRate, damage);
    this.cooldown = false;
  }


  /**
   * Draws enemy onto p5 canvas.
   */
  draw() {
    image(this.sprite, this.location.x, this.location.y, 80, 80); // should use box width and height for args 3 & 4, but image is too large
  }

  /**
   * Moves towards player every 0.2 seconds.
   */
  move() {
    const player = this.arena.getPlayer();
    const targetX = player.location.x;
    const targetY = player.location.y;

    // Interpolate towards the player position, controlling speed with the lerp factor
    this.location.x = lerp(this.location.x, targetX, 0.0002); // Adjust 0.02 for desired speed
    this.location.y = lerp(this.location.y, targetY, 0.0002); // Adjust 0.02 for desired speed
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