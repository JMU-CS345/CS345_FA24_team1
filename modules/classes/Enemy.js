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
    setInterval(() => {
      // TODO: Implement method
    }, 200);
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