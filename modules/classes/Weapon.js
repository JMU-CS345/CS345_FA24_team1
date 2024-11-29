class Weapon {
  constructor(wtype, owner) {
      this.wtype = wtype;
      this.owner = owner;
      if (this.wtype.fireaudio) {
          this.fireAudio = loadSound(this.wtype.fireaudio);
      }

      this.lastFireTime = -1;
      this.projectiles = [];
  }

  fire() {
      if (!this.owner.alive) return;

      const currentTime = Date.now();
      const timeSinceLastFire = currentTime - this.lastFireTime;

      if (timeSinceLastFire < 1000 / this.wtype.firerate) return;

      this.lastFireTime = currentTime;

      if (this.fireAudio) {
          this.fireAudio.play();
      }

      if (this.wtype.hasranged) {
          let projvelocity;

          // Set projectile velocity based on facing direction
          switch (this.owner.facing) {
              case Direction.DOWN: projvelocity = new Vector2D(0, 2); break;
              case Direction.UP: projvelocity = new Vector2D(0, -2); break;
              case Direction.LEFT: projvelocity = new Vector2D(-2, 0); break;
              case Direction.RIGHT: projvelocity = new Vector2D(2, 0); break;
              default: projvelocity = new Vector2D(0, 0);
          }

          // Add projectile if velocity is valid
          if (projvelocity.x !== 0 || projvelocity.y !== 0) {
              let projposition = new Box(
                  this.owner.box.x + this.owner.box.width / 2,
                  this.owner.box.y + this.owner.box.height / 2,
                  5, 5 // Size of the projectile as a small box
              );
              this.projectiles.push({
                  projvelocity,
                  projposition,
                  radius: 10, // Circle radius for bullets
                  hit: false, // If the bullet hit a target
              });
          }
      }
  }

  update() {
      for (let i = 0; i < this.projectiles.length; i++) {
          const proj = this.projectiles[i];

          if (proj.hit) {
              proj.radius -= 1; // Shrink bullet on hit
              if (proj.radius <= 0) {
                  this.projectiles.splice(i, 1); // Remove when fully shrunk
                  i--;
                  continue;
              }
              continue;
          }

          // Move the projectile
          proj.projposition.x += proj.projvelocity.x;
          proj.projposition.y += proj.projvelocity.y;

          // Remove projectiles that leave arena boundaries
          if (!isValidLocation(proj.projposition)) {
              this.projectiles.splice(i, 1);
              i--;
              continue;
          }

          // Check collisions with other characters
          this.owner.arena.characters.forEach((character) => {
              if (
                  character instanceof Enemy && // Only damage enemies
                  character.checkHit(proj.projposition)
              ) {
                  character.takeDamage(this.wtype.damage); // Apply damage
                  proj.hit = true; // Mark projectile as hit
                  console.log(`Hit enemy! Damage: ${this.wtype.damage}`); // Debug message
              }
          });
      }
  }

  draw() {
      for (let i = 0; i < this.projectiles.length; i++) {
          const proj = this.projectiles[i];
          fill(proj.hit ? 255 : 0, proj.hit ? 0 : 255, 0); // Red for hit, Green for active
          noStroke();
          ellipse(
              proj.projposition.x,
              proj.projposition.y,
              proj.radius * 2,
              proj.radius * 2
          );
      }
  }
}
