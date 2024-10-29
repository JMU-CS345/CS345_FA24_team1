class Enemy extends Character {
  constructor(arena, vector, health, sprite, box, speed, fireRate, damage) {
    super(arena, vector, health, sprite, box, speed, fireRate, damage);
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
    // TODO: Implement method
  }
}