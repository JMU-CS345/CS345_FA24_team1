class Player extends Character {
  constructor(arena, vector, health, sprite, box, speed) {
    super(arena, vector, health, sprite, box, speed); // Call the parent constructor

    this.animations = {
      "idle": {
        0: {0:0},
        1: {64:0},
        2: {128:0},
        3: {192:0}
      },
      "moving": {
        0: {32:0, 0:32},  
        1: {96:0, 64:32},
        2: {160:0, 128:32},
        3: {224:0, 192:32}
      },
      "attacking": {
        0: {0:0, 32:32},
        1: {64:0, 96:32},
        2: {128:0, 160:32},
        3: {192:0, 224:32}
      },
      "dead": {
        0: {0:224},
        1: {0:224},
        2: {0:224},
        3: {0:224}
      }
    };

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
      return;
    }

    if (!keyIsPressed) {
      if (this.state !== "idle") {
        this.state = "idle";
      }
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

  /**
   *  Attacks enemies if player is facing their direction & in their box
   */
  attack() {
    if (this.cooldown) {
      return null;
    }
    super.currentWeapon().fire(); 
  }
}
