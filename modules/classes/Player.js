class Player extends Character {
  constructor(arena, vector, health, sprite, box, speed, animations) {
    super(arena, vector, health, sprite, box, speed, animations);
  }

  update() {
    this.state = "moving";
    this.facing = Direction.LEFT;

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
