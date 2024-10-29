class Player extends Character {
  constructor(arena, vector, health, sprite, box, speed, fireRate, damage) {
    super(arena, vector, health, sprite, box, speed, fireRate, damage); // Call the parent constructor
  }

  /**
   * Moves the vector location of the player using keystroke
   * 
   * @param {key} direction 
   */
  move(direction) {
    switch (direction) {
      case 'up':
        this.location.y -= this.speed; // Move up
        break;
      case 'down':
        this.location.y += this.speed; // Move down
        break;
      case 'left':
        this.location.x -= this.speed; // Move left
        break;
      case 'right':
        this.location.x += this.speed; // Move right
        break;
    }
    this.box.x = this.location.x;
    this.box.y = this.location.y;
  }

  attack(target) {
    if (target && target.takeDamage) {
      target.takeDamage(); // Deal damage to the target
    }
  }
}
