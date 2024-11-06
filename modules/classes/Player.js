class Player extends Character {
  constructor(arena, vector, health, sprite, box, speed) {
    super(arena, vector, health, sprite, box, speed); // Call the parent constructor
  }

  /**
   * Update this Player each tick. Handle movement from user input.
   */
  update() {

    // Player doesn't update when dead
    if (!this.alive) {
      arena.stopTimer();  // timer stops when player dies (game over)
      return null;
    }

    // Movement
    if (keyIsDown(UP_ARROW)) {
      super.move(new Vector2D(0, -this.speed).add(this.location));
    }
    if (keyIsDown(DOWN_ARROW)) {
      super.move(new Vector2D(0, this.speed).add(this.location));
    }
    if (keyIsDown(LEFT_ARROW)) {
      super.move(new Vector2D(-this.speed, 0).add(this.location));
    }
    if (keyIsDown(RIGHT_ARROW)) {
      super.move(new Vector2D(this.speed, 0).add(this.location));
    }
    if (keyIsDown(32)) {
      this.attack();
    }
  }

  draw() {
    image(this.sprite, this.location.x, this.location.y, this.box.width, this.box.height);
  }

  /**
   *  Attacks enemies if player is facing their direction & in their box
   */
  attack() {
    if (this.cooldown) {
      return null;
    }
    super.currentWeapon().fire(); 
  }

  isFacingEnemy(enemyVector) {
    const dx = enemyVector.x - this.location.x;
    const dy = enemyVector.y - this.location.y;
    
    switch(super.facing) {
      case "UP":
        console.log(dx, dy)
        return;
      case "DOWN":
        console.log(dx, dy)
        return;
      case "LEFT":
        console.log(dx, dy)
        return;
      case "RIGHT":
        console.log(dx, dy)
        return;
      default:
        return false;
    }
  }

}