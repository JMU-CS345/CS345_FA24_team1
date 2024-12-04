class Weapon {
    /** 
     * Constructs a Weapon object from the passed weapon type object and owning character object. 
     * @param {Object} wtype - Weapon type object defining weapon behavior.
     * @param {Object} owner - The character owning this weapon.
     */
    constructor(wtype, owner) {
        this.wtype = wtype;
        this.owner = owner;

        // Instance-specific weapon info - last fire time + projectiles
        // + projwidth/projheight. Each element in projectiles is of form
        // {vel: <Vector2D>, pos: <Vector2D>}
        this.lastFireTime = -1;
        this.projectiles = []; // Array of active projectiles.
        if (this.wtype.hasranged) {
            // Square root of damage in height, proportional width
            this.projheight = Math.sqrt(this.wtype.damage) | 0
            this.projwidth = (this.wtype.projsprite.width * this.projheight
                    / this.wtype.projsprite.height) | 0;
        }
    }

    /**
     * Attempts to fire the weapon. Fails if not enough time has elapsed since
     * the last fire. If target is given, ranged weapons fire in the direction
     * from the owner towards target. Otherwise, the target is the player.
     * Returns true if the fire was successfully executed, false otherwise.
     */
    fire(target = null) {
        // Prevent firing if the owner is dead.
        if (!this.owner.alive) return false;

        const currentTime = Date.now(); // Current time in ms
        const timeSinceLastFire = currentTime - this.lastFireTime;

        // Ensure enough time has passed since the last fire.
        if (timeSinceLastFire < (1000 / this.wtype.firerate)) return false;
        this.lastFireTime = currentTime; // Update last fire time

        // Play weapon attack sound if they have one
        if (this.wtype.fireaudio) this.wtype.fireaudio.play();

        // Register damage to nearby enemies if melee
        if (this.wtype.hasmelee) {
            // Owner's box -> clone -> take half only in the direction facing
            // -> extend in direction by melee range
            let weaponbox = this.owner.box.clone();
            const faceangle = Direction.radians(this.owner.facing);
            const shrinkvec = new Vector2D(0, 0).fromPolar(1, faceangle);
            shrinkvec.x *= (weaponbox.width >> 1);
            shrinkvec.y *= (weaponbox.height >> 1);
            weaponbox.shrink(shrinkvec);
            weaponbox.extend(new Vector2D(0, 0).fromPolar(
                this.wtype.meleerange, faceangle
            ));

            // Hit all characters that intersect weaponbox
            this.owner.arena.characters.forEach((character) => {
                // Skip characters of the same type (e.g., Enemy on Enemy).
                if ((this.owner instanceof Enemy)
                        == (character instanceof Enemy)) return;

                if (character.checkHit(weaponbox))
                    character.takeDamage(this.wtype.damage);
            });
        }

        // Create projetiles if ranged
        if (this.wtype.hasranged) {
            // Set target to player if null
            if (target == null) {
                const plyrbox = this.owner.arena.getPlayer();
                target = new Vector2D(
                    plyrbox.x + (plyrbox.width >> 1),
                    plyrbox.y + (plyrbox.height >> 1)
                );
            }

            // Projectile spawn position
            const spawn = new Vector2D(
                this.owner.box.x + (this.owner.box.width >> 1),
                this.owner.box.y + (this.owner.box.height >> 1)
            );

            // Compute angle towards target from spawn position
            const targetAngle = Math.atan2(
                target.y - spawn.y,
                target.x - spawn.x
            );

            this.projectiles.push({
                pos: spawn,
                vel: new Vector2D(0, 0).fromPolar(this.wtype.projspeed,
                        targetAngle)
            });
        }

        return true; // successful fire
    }

    /**
     * Updates the movement of all active projectiles.
     * Removes projectiles upon impact and registers any applicable damage.
     */
    update() {
        // Iterate in reverse for element deletion
        const accuracy = 5; // Higher -> more accurate, slower
        for (let i=this.projectiles.length-1; i>=0; i--) {
            const projectile = this.projectiles[i];
            // Repeat a few times for extra precision with fast moving objects
            const accuvel = projectile.vel.clone();
            accuvel.x /= accuracy;
            accuvel.y /= accuracy;
            for (let j=0; j<accuracy; j++) {
                // Update position from velocity
                projectile.pos.add(accuvel);

                // Check impacts with characters and deal damage
                // Remove projectile afterwards if any characters were hit
                let hitany = false;
                const projbox = new Box(projectile.pos.x, projectile.pos.y,
                        this.projwidth, this.projheight);
                this.owner.arena.characters.forEach((character) => {
                    // Skip characters of the same type
                    if ((this.owner instanceof Enemy)
                            == (character instanceof Enemy)) return;

                    if (character.alive && character.checkHit(projbox)) {
                        character.takeDamage(this.wtype.damage);
                        hitany = true;
                    }

                    // TODO need to add support for rocket
                    //  - hitType for ranged weapons in WeaponTypes.json
                    //      - single - what is written above
                    //      - blast - for rockets - does aoe damage to ALL 
                    //      characters in range, even player
                    //  - parse that upon hit and do single damage (above) or
                    //  spawn at most ONE blast and deal damage to all in radius
                    //  - for blast also show impact audio and impact sprites
                });
            
                // Check collision with map bounds and remove if so
                if (hitany || !this.owner.arena.isValidBoxLocation(projbox)) {
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * Draws all active projectiles and effects made by this weapon.
     */
    draw() {
        this.projectiles.forEach((projectile) => {
            imageMode(CENTER);
            image(this.wtype.projsprite, projectile.pos.x, projectile.pos.y,
                    this.projwidth, this.projheight);
            imageMode(CORNER);
        });
    }

    /**
     * Scales this weapon by the passed scale factors.
     */
	scale(scalex, scaley) {
        // Scale projwidth/projheight
        this.projwidth *= scalex;
        this.projheight *= scaley;

        // Scale projectiles pos/vel
        this.projectiles.forEach((projectile) => {
            this.pos.x *= scalex;
            this.pos.y *= scaley;
            this.vel.x *= scalex;
            this.vel.y *= scaley;
        });
    }
}
