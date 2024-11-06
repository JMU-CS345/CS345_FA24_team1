class Player extends Character {
  constructor(arena, vector, health, sprite, box, speed) {
    super(arena, vector, health, sprite, box, speed); // Call the parent constructor
  }

  /**
   * Update this Player each tick. Handle movement from user input.
   */
  update() {
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
  }

  draw() {
    image(this.sprite, this.location.x, this.location.y, this.box.width, this.box.height); // is positioning right, are the spawns wrong?
  }

  attack(target) {
    if (target && target.takeDamage) {
      target.takeDamage(); // Deal damage to the target
    }
  }
}
