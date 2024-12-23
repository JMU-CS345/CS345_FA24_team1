class Player extends Character {
  constructor(arena, vector, health, sprite, box, speed, animations) {
    super(arena, vector, health, sprite, box, speed, animations);

    // default facing down from spawn
    this.facing = Direction.DOWN;
    
    this.attackAnimationTimer = 0;
    this.isAttacking = false;
  }

  /**
   * Update this Player each tick. Handle movement from user input.
   */
  update() {
    // Update weapons
    this.weapons.forEach((weapon) => weapon.update());

    // Player doesn't update when dead
    if (!this.alive) {
      this.state = "dead";
      this.currentFrame = 0;
      return;
    }

    // Weapon unlocks: able to skip waves without breaking weapon switching
    if (this.arena.wave >= 3 && this.weapons[1] == undefined) {
      this.weapons[1] = new Weapon(this.arena.weapons.find(
                (wtype) => wtype.name == `pistol`), this);
    } 
    if (this.arena.wave >= 6 && this.weapons[2] == undefined) {
      this.weapons[2] = new Weapon(this.arena.weapons.find(
                (wtype) => wtype.name == `shotgun`), this);
    } 
    if (this.arena.wave >= 9 && this.weapons[3] == undefined) {
      this.weapons[3] = new Weapon(this.arena.weapons.find(
                (wtype) => wtype.name == `rifle`), this);
    } 
    if (this.arena.wave >= 12 && this.weapons[4] == undefined) {
      this.weapons[4] = new Weapon(this.arena.weapons.find(
                (wtype) => wtype.name == `rocket`), this);
    } 

    if (!keyIsPressed && !mouseIsPressed) {
      this.state = "idle";
      this.currentFrame = 0;
      return;
    }
    

    // Movement
    const keydownUP = keyIsDown(UP_ARROW) || keyIsDown(87),
          keydownDOWN = keyIsDown(DOWN_ARROW) || keyIsDown(83),
          keydownLEFT = keyIsDown(LEFT_ARROW) || keyIsDown(65),
          keydownRIGHT = keyIsDown(RIGHT_ARROW) || keyIsDown(68),
          moving = keydownUP || keydownDOWN || keydownLEFT || keydownRIGHT;

    if (keydownUP) {
      super.move(new Vector2D(0, -this.speed).add(this.location));
    } else if (keydownDOWN) {
      super.move(new Vector2D(0, this.speed).add(this.location));
    } else if (keydownLEFT) {
      super.move(new Vector2D(-this.speed, 0).add(this.location));
    } else if (keydownRIGHT) {
      super.move(new Vector2D(this.speed, 0).add(this.location));
    }

    if (moving) {
      this.state = "moving";
      this.arena.pathing.updatePlayerBox(); // Recalculate pathfinding
    }

    // Player attack animation
    if (keyIsDown(32) || mouseIsPressed && mouseButton === LEFT) {
      // Only set attacking state if fire was successful
      if (this.attack()) {
          this.state = "attacking";
          this.currentFrame = 1;
      }
    }

    // Sprite movement animation frames
    if (!this.isAttacking && (this.state === "moving" || this.state === "attacking")) {
      this.frameTimer++;
      if (this.frameTimer >= this.frameDelay) {
        this.currentFrame++;
        if (this.currentFrame >= 2) {
          this.currentFrame = 0;
          if (this.state == "attacking") this.state = "idle";
        }
        this.frameTimer = 0;
      }
    }
  }

  /**
   *  Attacks using the current weapon.
   */
  attack() {
    return (super.currentWeapon().fire(new Vector2D(mouseX, mouseY))); 
  }
}
