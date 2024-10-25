class Player extends Character {
  constructor(x = 0, y = 0) {
    super(); // Call the parent constructor
    this.x = x; // Player's x position
    this.y = y; // Player's y position
    this.health = 100;       // Player's health
  }

  getPosition() {
    return { x: this.x, y: this.y }; // Return current position
  }

  setPosition(x, y) {
    this.x = x; // Set x position
    this.y = y; // Set y position
  }

  move(direction) {
    switch (direction) {
      case 'up':
        this.y -= 1; // Move up 
        break;
      case 'down':
        this.y += 1; // Move down 
        break;
      case 'left':
        this.x -= 1; // Move left
        break;
      case 'right':
        this.x += 1; // Move right
        break;
    }
  }
  // keyBoad event 
  keyPressed(){
    switch (event.key) {
      case 'ArrowUp':
        this.move('up');
        break;
      case 'ArrowDown':
        this.move('down');
        break;
      case 'ArrowRight':
        this.move('right');
        break;
      case 'ArrowLeft':
        this.move('left');
        break;
  }
  }

  

  attack(target) {
    if (target && target.takeDamage) {
      target.takeDamage(); // Deal damage to the target
    }
  }
}