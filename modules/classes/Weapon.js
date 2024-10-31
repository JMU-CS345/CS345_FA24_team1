class Weapon {

    constructor (weapon, damage, fireRate, sprite, player) {
        this.weapon = weapon; // Weapon
        this.damage = damage; // Damage dealt by the weapon (double)
        this.fireRate = fireRate; // Hits per second (double)
        this.sprite = sprite; // The sprite for the weapon
        this.player = player;
        this.lastFireTime = 0; // Timestamp of the last fire action (long)
    }

    fire () {
        const currentTime = Date.now();
        const timeSinceLastFire = currentTime - this.lastFireTime;

        // Check if the weapon can fire again based on fire rate
        if (timeSinceLastFire >= (1000 / this.fireRate)) {
            this.lastFireTime = currentTime; // Update last fire time

        //further implementation of fire
        }
    }

    switch_Weapon(newWeapon, newWeaponSprite) {
        //switches weapon equipped
        this.weapon = newWeapon;
        change_sprite(newWeaponSprite);
        draw();
    }

    change_sprite(newWeaponSprite) {
        //can be called by player if the player changes direction or if player switches weapons
        this.sprite = newWeaponSprite;
    }

    get_sprite() {
        return this.sprite;
    }

    get_current_weapon() {
        return this.weapon;
    }

    get_damage() {
        return this.damage;
    }

    get_type() {
        return this.type;
    }

    get_fireRate() {
        return this.fireRate;
    }

    draw() {
        //draws the sprite for the current weapon
        //would need to call the current players location
        //image(sprite, player.location.x, player.location.y)
    }
}