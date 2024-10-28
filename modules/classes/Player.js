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
        this.location = this.location.fromCartesian(this.location.x, this.location.y - this.speed); // Move up
        break;
      case 'down':
        this.location = this.location.fromCartesian(this.location.x, this.location.y + this.speed); // Move down
        break;
      case 'left':
        this.location = this.location.fromCartesian(this.location.x - this.speed, this.location.y); // Move left
        break;
      case 'right':
        this.location = this.location.fromCartesian(this.location.x + this.speed, this.location.y); // Move right
        break;
    }
  }

  attack(target) {
    if (target && target.takeDamage) {
      target.takeDamage(); // Deal damage to the target
    }
  }
}