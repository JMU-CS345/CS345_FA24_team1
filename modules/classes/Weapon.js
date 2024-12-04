class Weapon {
    /** 
     * Constructs a Weapon object from the passed weapon type object and owning character object. 
     * @param {Object} wtype - Weapon type object defining weapon behavior.
     * @param {Object} owner - The character owning this weapon.
     */
    constructor(wtype, owner) {
        this.wtype = wtype;
        this.owner = owner;

        /* TODO rewrite this file + sketch.js + WeaponTypes.json */
        // TODO also support for nuke weapon ????
        // TODO fix animation weapon ani playing even when not firing

        // Instance-specific weapon info - last fire time + projectiles
        // + projwidth/projheight. Each element in projectiles is of form
        // {vel: <Vector2D>, pos: <Vector2D>}
        this.lastFireTime = -1;
        this.projectiles = []; // Array of active projectiles.
        if (this.wtype.hasranged) {
            // 1/4th of owner in height and proportional width
            // TODO fix how make better?
            this.projheight = this.owner.box.height >> 2;
            this.projwidth = this.wtype.projsprite.width * this.projheight
                    / this.wtype.projsprite.height;
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
            // TODO FIX MELEE LOGIC - extend -> shift() write in Box
            // Extend the owner's hitbox in the direction of the attack.
            let weaponbox = this.owner.box.clone();
            weaponbox.extend(new Vector2D(0, 0).fromPolar(
                this.wtype.meleerange,Direction.radians(this.owner.facing)
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

            // TODO test mouse firing works, test enemies still kill player

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

                // Check impacts with characters and deal damage + remove if so
                let hitany = false;
                const projbox = new Box(projectile.pos.x, projectile.pos.y,
                        this.projwidth, this.projheight);
                this.owner.arena.characters.forEach((character) => {
                    // Skip characters of the same type
                    if ((this.owner instanceof Enemy)
                            == (character instanceof Enemy)) return;

                    if (character.checkHit(projbox)) {
                        character.takeDamage(this.wtype.damage);
                        hitany = true;
                    }

                    // TODO need blastType in weaponTypes for nuke
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
