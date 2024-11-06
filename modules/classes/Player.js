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
    
    let closestEnemy = null;
    let closestDistance = Infinity;

    for (let i = 1; i < arena.characters.length; i++) {
      const enemy = arena.characters[i];

      if (enemy instanceof Enemy && enemy.alive) {
        const distance = this.location.getDistance(enemy.location)

        console.log(distance)
        if (this.box.intersects(enemy.box) && this.isFacingEnemy() && distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
      }
    }
  }

  isFacingEnemy(enemyVector) {
    const dx = enemyVector.x - this.location.x;
    const dy = enemyVector.y - this.location.y;
    
    switch(this.lastDirection) {
      case "up":
        return;
      case "down":
        return;
      case "left":
        return;
      case "right":
        return;
      default:
        return false;
    }
  }

}