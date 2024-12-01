class Enemy extends Character {
  constructor(arena, vector, health, sprite, box, speed, animations) {
    super(arena, vector, health, sprite, box, speed, animations);
    this.state = "moving";
  }

  /**
   * Updates enemy each tick.
   */
  update() {
    // Enemy doesn't update when dead
    if (!this.alive) {
      this.state = "dead";
      this.currentFrame = 0;
      return;
    }

    // Do nothing if player dead
    if (!this.arena.getPlayer().alive) return;

    // Get the player's position
    const player = this.arena.getPlayer();
    const playerBox = player.box;

    // Only move if not already on top of player
    if (!this.box.intersects(playerBox)) {
      this.state = "moving";
      super.move(
        new Vector2D(0, 0).fromPolar(
          this.speed,
          Direction.radians(
              this.arena.pathing.travelDirection(this.box, this.speed, this.id))
        ).add(this.location)
      );
    }

    // Attacks when enemies box intersects the players box if the enemy is alive
    if (this.box.intersects(playerBox) && this.alive) {

      // timeout to give player a chance to kill enemy
      setTimeout(() => {
        this.state = "attacking";
        super.currentWeapon().fire();
      }, super.currentWeapon().wtype.firerate * 1000);
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
    if (this.weapon) {
      this.weapon.update(); // Update weapon projectiles
  }
  }
}
