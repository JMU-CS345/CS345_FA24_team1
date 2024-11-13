class Player extends Character {
  constructor(arena, vector, health, sprite, box, speed, animations) {
    super(arena, vector, health, sprite, box, speed, animations);

    // default facing down from spawn
    this.facing = Direction.DOWN;
  }

  /**
   * Update this Player each tick. Handle movement from user input.
   */
  update() {
    // Player doesn't update when dead
    if (!this.alive) {
      this.state = "dead";
      this.currentFrame = 0;
      return;
    }

    if (!keyIsPressed) {
      this.state = "idle";
      this.currentFrame = 0;
      return;
    }

    // Movement
    if (keyIsDown(UP_ARROW)) {
      this.state = "moving";
      super.move(new Vector2D(0, -this.speed).add(this.location));
    } else if (keyIsDown(DOWN_ARROW)) {
      this.state = "moving";
      super.move(new Vector2D(0, this.speed).add(this.location));
    } else if (keyIsDown(LEFT_ARROW)) {
      this.state = "moving";
      super.move(new Vector2D(-this.speed, 0).add(this.location));
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.state = "moving";
      super.move(new Vector2D(this.speed, 0).add(this.location));
    }
    if (keyIsDown(32)) {
      this.state = "attacking";
      this.attack();
    }

    // Sprite movement animation frames
    if (this.state === "moving" || this.state === "attacking") {
      this.frameTimer++;
      if (this.frameTimer >= this.frameDelay) {
        this.currentFrame++;
        if (this.currentFrame >= 2) {
          this.currentFrame = 0;
        }
        this.frameTimer = 0;
      }
    }
  }
}
