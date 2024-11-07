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

            // Owner's box -> clone -> extend width/height in direction
            //  -> move back x/y if facing left or up
            let weaponbox = this.owner.box.clone();
            let movement = new Vector2D(0, 0).fromPolar(
                Direction.radians(this.owner.facing), this.wtype.meleerange
            );
            weaponbox.width += movement.x;
            weaponbox.height += movement.y;
            if (this.owner.facing == Direction.LEFT) weaponbox.x -= movement.x;
            if (this.owner.facing == Direction.UP) weaponbox.y -= movement.y;

            // Hit all characters that intersect weaponbox
            this.owner.arena.characters.forEach((character) => {
                // Don't hit characters of the same type (Player/Enemy)
                if ((this.owner instanceof Enemy)
                        == (character instanceof Enemy)) return;

                if (character.checkHit(weaponbox)) {
                    console.log(`character ${character} took ${this.wtype.damage} damage and is ${character.alive}`);
                    character.takeDamage(this.wtype.damage);
                }
            });
        }

        // Create projectiles if ranged
        if (this.wtype.hasranged) {
            // TODO
        }
    }

    /* Updates the movement of any projectiles created by this Weapon. */
    update() {
        // TODO move projectiles
    }

    /* Draws any additional effects or projectiles made by this Weapon. */
    draw() {
        // TODO projectile drawing
    }
}
