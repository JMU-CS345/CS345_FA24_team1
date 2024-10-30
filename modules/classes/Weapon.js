const WeaponType = Object.freeze ({
    MELEE: 'melee',
    RANGED: 'ranged'

});

class Weapon {

    constructor (type, damage, fireRate) {
        this.type = type; // WeaponType
        this.damage = damage; // Damage dealt by the weapon (double)
        this.fireRate = fireRate; // Hits per second (double)
        this.lastFireTime = 0; // Timestamp of the last fire action (long)
    }

    fire () {
        const currentTime = Date.now();
        const timeSinceLastFire = currentTime - this.lastFireTime;

        // Check if the weapon can fire again based on fire rate
        if (timeSinceLastFire >= (1000 / this.fireRate)) {
            this.lastFireTime = currentTime; // Update last fire time
        }
    }

    switchWeapon() {
        //switches weapon equipped
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
}