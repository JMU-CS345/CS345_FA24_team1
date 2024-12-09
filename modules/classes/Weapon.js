class Weapon {
    /** 
     * Constructs a Weapon object from the passed weapon type object and owning character object. 
     * @param {Object} wtype - Weapon type object defining weapon behavior.
     * @param {Object} owner - The character owning this weapon.
     */
    constructor(wtype, owner) {
        this.wtype = wtype;
        this.owner = owner;

        // Frames spent on each animation image (default for all weapons)
        this.ANIMATION_DELAY = 12;

        // Instance-specific weapon info - last fire time + projectiles
        // + blasts + projwidth/projheight. Each element in projectiles is of
        // form {vel: <Vector2D>, pos: <Vector2D>, creationFrame: <integer>}
        // blasts elements are {pos: <Vector2D>, creationFrame: <integer>}
        this.lastFireTime = -1;
        this.projectiles = []; // Array of active projectiles.
        this.blasts = [];
        if (this.wtype.hasranged) {
            // Square root of damage in height, proportional width
            this.projheight = Math.sqrt(this.wtype.damage) | 0
            this.projwidth = (this.wtype.projsprites[0].width * this.projheight
                    / this.wtype.projsprites[0].height) | 0;
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
                        targetAngle),
                creationFrame: frameCount
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
                        // Deal damage if not an AoE weapon
                        if (this.wtype.blastradius === undefined)
                            character.takeDamage(this.wtype.damage);
                        hitany = true;
                    }
                });
            
                // Handle any collisions (either with character or with bounds)
                if (hitany || !this.owner.arena.isValidBoxLocation(projbox)) {
                    this.projectiles.splice(i, 1); // Remove projectile

                    // Create blast animation object if this weapon has
                    // blast sprites
                    if (this.wtype.blastsprites) {
                        this.blasts.push({
                            pos: projectile.pos,
                            creationFrame: frameCount
                        });
                    }

                    // Play impact sound if there is one
                    if (this.wtype.impactaudio)
                        this.wtype.impactaudio.play();

                    // Deal any AoE damage
                    if (this.wtype.blastradius) {
                        const blst2 = this.wtype.blastradius
                                * this.wtype.blastradius; // radius squared
                        this.owner.arena.characters.forEach((chr) => {
                            const dst2 = this.owner.arena.pathing.dist2(
                                    projectile.pos, chr.location);
                            if (dst2 < blst2) chr.takeDamage(this.wtype.damage);
                        });
                    }

                    break;
                }
            }
        }
    }

    /**
     * Draws all active projectiles and effects made by this weapon.
     */
    draw() {
        // Draw projectiles
        this.projectiles.forEach((projectile) => {
            const curidx = Math.floor((frameCount - projectile.creationFrame)
                    / this.ANIMATION_DELAY) % this.wtype.projsprites.length,
                  img = this.wtype.projsprites[curidx];

            // Center mode -> translate origin to projectile location
            // -> rotate to correct orientation -> draw
            imageMode(CENTER);
            translate(projectile.pos.x, projectile.pos.y);
            rotate(Math.atan2(projectile.vel.y, projectile.vel.x));
            image(img, 0, 0, this.projwidth, this.projheight);

            // Undo everything
            imageMode(CORNER);
            resetMatrix();
        });

        // Remove any completed blast animations
        this.blasts = this.blasts.filter((blast) => {
            const idx = (frameCount - blast.creationFrame),
                  lim = this.wtype.blastsprites.length * this.ANIMATION_DELAY;
            return idx < lim;
        });

        // Draw blasts
        for (let i=this.blasts.length-1; i>=0; i--) {
            const blast = this.blasts[i],
                  curidx = Math.floor((frameCount - blast.creationFrame)
                    / this.ANIMATION_DELAY);

            // Remove blast animation object if animation finished
            if (curidx >= this.wtype.blastsprites.length) {
                this.blasts.splice(i, 1);
                break;
            }

            // Otherwise, draw sprite.
            const img = this.wtype.blastsprites[curidx],
                  dwh = this.wtype.blastradius << 1;
            imageMode(CENTER);
            image(img, blast.pos.x, blast.pos.y, dwh, dwh);
            imageMode(CORNER);
        }
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
