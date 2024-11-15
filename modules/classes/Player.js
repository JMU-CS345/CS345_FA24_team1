class Player extends Character {
  constructor(arena, vector, health, sprite, box, speed, animations) {
    super(arena, vector, health, sprite, box, speed, animations);
  }

  update() {
    if (keyIsDown(UP_ARROW))
      this.facing = Direction.UP;
    if (keyIsDown(DOWN_ARROW))
      this.facing = Direction.DOWN;
    if (keyIsDown(LEFT_ARROW))
      this.facing = Direction.LEFT;
    if (keyIsDown(RIGHT_ARROW))
      this.facing = Direction.RIGHT;

    this.state = "moving";

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
