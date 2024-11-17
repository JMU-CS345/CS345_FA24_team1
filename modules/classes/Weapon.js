class Weapon {
    /* Constructs a Weapon object from the passed weapon type object and owning
     * character object. */
    constructor(wtype, owner) {
        this.wtype = wtype;
        this.owner = owner;

        // Instance-specific weapon info - last fire time + projectiles
        // For melee-only weapons, projectiles will always be empty
        // Otherwise, each element is of form {vel: <Vector2D>, pos: <Vector2D>}
        this.lastFireTime = -1;
        this.projectiles = []
    }
    
    /* Tries to fire this weapon. Fails if not enough time has elapsed since
     * the last firing of the weapon. */
    fire() {
        // Don't fire if dead
        if (!this.owner.alive) return;

        const currentTime = Date.now(); // timestamp in ms
        const timeSinceLastFire = currentTime - this.lastFireTime;

        // Ensure the weapon can fire again based on fire rate
        if (timeSinceLastFire < (1000 / this.wtype.firerate)) return;

        this.lastFireTime = currentTime; // Update last fire time

        // Register damage to nearby enemies if melee
        if (this.wtype.hasmelee) {
            // Damage is dealt to any character in the owning character's
            // hitbox, extended out meleerange pixels in the direction
            // that the owner is facing.

            // Owner's box -> clone -> extend in direction
            let weaponbox = this.owner.box.clone();
            weaponbox.extend(new Vector2D(0, 0).fromPolar(
                this.wtype.meleerange, Direction.radians(this.owner.facing)
            ));

            // Hit all characters that intersect weaponbox
            this.owner.arena.characters.forEach((character) => {
                // Don't hit characters of the same type (Player/Enemy)
                if ((this.owner instanceof Enemy)
                        == (character instanceof Enemy)) return;

                if (character.checkHit(weaponbox)) {
                    character.takeDamage(this.wtype.damage);
                }
            });
        }

        // Create projectiles if ranged
            // TODO
            // pistol, shotgun, rifle
    }

    /* Updates the movement of any projectiles created by this Weapon. */
    update() {
        if (this.projectiles.length > 0) {
            if (this.lastFireTime == currentTime) {                 
                for (let i = 0; i < this.projectiles.length; i++) {
                    this.projectiles[i][1].x += this.projectiles[i][0].x //multiplier?;
                    this.projectiles[i][1].y += this.projectiles[i][0].y //multiplier?;
                    
                    if (this.projectiles[i][1].x > Arena.width || this.projectiles[i][1].x < 0
                        || this.projectiles[i][1].y > Arena.height || this.projectiles[i][1].y < 0
                        || this.projeciles[i][1].checkHit(Enemy.Box)
                    ) {
                        this.projectiles.splice(i, 1);
                        i--;
                    }
                }                       
            }
        }
    }
        // TODO move projectiles

    /* Draws any additional effects or projectiles made by this Weapon. */
    draw() {
        image(projectilesprite, this.projectiles[0][1].x, this.projectiles[0][1].y);
        // TODO projectile drawing
    }
}
