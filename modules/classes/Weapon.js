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
        let projvelocity;
        if (this.wtype.hasranged) {
            if (this.owner.facing == Direction.DOWN) projvelocity = new Vector2D(0,2);
            if (this.owner.facing == Direction.UP) projvelocity = new Vector2D(0,-2);
            if (this.owner.facing == Direction.LEFT) projvelocity = new Vector2D(-2,0);
            if (this.owner.facing == Direction.RIGHT) projvelocity = new Vector2D(2,0);
            let projposition = this.owner.box.clone();
            this.projectiles.push({projvelocity, projposition});
        }
    }

    /* Updates the movement of any projectiles created by this Weapon. */
    update() {
        if (this.projectiles.length > 0) {                 
            for (let i = 0; i < this.projectiles.length; i++) {
                this.projectiles[i].projposition.x += this.projectiles[i].projvelocity.x;
                this.projectiles[i].projposition.y += this.projectiles[i].projvelocity.y;

                
                if (!(isValidLocation(this.projectiles[i].projposition)) || this.projectiles[i].projposition.checkHit(Enemy.Box)) {
                    this.owner.arena.characters.forEach((character) => {
                        if (character instanceof Enemy && character.checkHit(this.projectiles[i].position)) {
                            character.takeDamage(this.wtype.damage);
                        }
                    });
                    this.projectiles.splice(i, 1);
                    i--;
                }
            }                      
        }
    }

    /* Draws any additional effects or projectiles made by this Weapon. */
    draw() {
        for (let i = 0; i < this.projectiles.length; i++) {
            image(this.wtype.projsprite, this.projectiles[i].projposition.x, this.projectiles[i].projposition.y);
        }
    }
}