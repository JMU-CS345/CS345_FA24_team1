class Weapon {
    /** 
     * Constructs a Weapon object from the passed weapon type object and owning character object. 
     * @param {Object} wtype - Weapon type object defining weapon behavior.
     * @param {Object} owner - The character owning this weapon.
     */
    constructor(wtype, owner) {
        this.wtype = wtype;
        this.owner = owner;
        if (this.wtype.fireaudio) {
            this.fireAudio = loadSound(this.wtype.fireaudio);
        }
        

    // Track last fire time for rate limiting and store active projectiles.
    this.lastFireTime = -1;
    this.projectiles = []; // Array of active projectiles.
  }

  /**
   * Attempts to fire the weapon. Fails if not enough time has elapsed since the last fire.
   * Handles both melee and ranged attack logic.
   */
  fire() {
    // Prevent firing if the owner is dead.
    if (!this.owner.alive) return;

    const currentTime = Date.now(); // Current time in ms.
    const timeSinceLastFire = currentTime - this.lastFireTime;

    // Ensure enough time has passed since the last fire.
    if (timeSinceLastFire < 1000 / this.wtype.firerate) return;

    // Update the last fire time to the current time.
    this.lastFireTime = currentTime;


        // Play weapon attack sound if they have one
        if (this.fireAudio) {
            this.fireAudio.play();
        }

    // Melee attack logic: Damage characters within the melee range.
    if (this.wtype.hasmelee) {
      // Extend the owner's hitbox in the direction of the attack.
      let weaponbox = this.owner.box.clone();
      weaponbox.extend(
        new Vector2D(0, 0).fromPolar(this.wtype.meleerange,Direction.radians(this.owner.facing)
        )
      );

      // Apply damage to all intersecting characters in the arena.
      this.owner.arena.characters.forEach((character) => {
        // Skip characters of the same type (e.g., Enemy on Enemy).
        if (this.owner instanceof Enemy == character instanceof Enemy) return;

        // Check if the character is hit and apply damage.
        if (character.checkHit(weaponbox)) {
          character.takeDamage(this.wtype.damage);
        }
      });
    }

    // Ranged attack logic: Create and track a new projectile.
    if (this.wtype.hasranged) {
      let projvelocity;

      // Determine projectile velocity based on the owner's facing direction.
      switch (this.owner.facing) {
        case Direction.DOWN:
          projvelocity = new Vector2D(0, 2);
          break;
        case Direction.UP:
          projvelocity = new Vector2D(0, -2);
          break;
        case Direction.LEFT:
          projvelocity = new Vector2D(-2, 0);
          break;
        case Direction.RIGHT:
          projvelocity = new Vector2D(2, 0);
          break;
        default:
          projvelocity = new Vector2D(0, 0); // Default to no movement if direction is invalid.
      }

      // Only create a projectile if velocity is valid.
      if (projvelocity.x !== 0 || projvelocity.y !== 0) {
        let projposition = this.owner.box.clone(); // Clone the owner's position.
        this.projectiles.push({ projvelocity, projposition }); // Add new projectile.
      }
    }
  }

  /**
   * Updates the movement of all active projectiles.
   * Removes projectiles that hit invalid locations or enemies.
   */
  update() {
    for (let i = 0; i < this.projectiles.length; i++) {
        const projectile = this.projectiles[i];

        // Update the position of the projectile based on its velocity
        projectile.projposition.x += projectile.projvelocity.x;
        projectile.projposition.y += projectile.projvelocity.y;

        // Check if the projectile goes out of bounds
        if (!this.owner.arena.isValidBoxLocation(projectile.projposition)) {
            this.projectiles.splice(i, 1); // Remove projectile if out of bounds
            i--; // Adjust index
            continue;
        }

        // Collision check (optional for now)
        this.owner.arena.characters.forEach((character) => {
            if (
                character instanceof Enemy &&
                character.checkHit(projectile.projposition)
            ) {
                character.takeDamage(this.wtype.damage);
                this.projectiles.splice(i, 1); // Remove projectile on impact
                i--;
            }
        });
    }
}


  /**
   * Draws all active projectiles using the specified sprite.
   */
  draw() {
    for (let i = 0; i < this.projectiles.length; i++) {
        const projectile = this.projectiles[i];

        if (projectile.projposition) {
            // Render the projectile sprite at its current position.
            image(
                this.wtype.projsprite,
                projectile.projposition.x,
                projectile.projposition.y
            );
        }
    }
}

}
