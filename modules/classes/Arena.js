class Arena {
  constructor(assets) {
    // Initialize map properties and dimensions
    this.map = { bgImage: assets.mapbg, info: assets.mapinfo };
    this.width = this.map.bgImage.width;
    this.height = this.map.bgImage.height;

    // Initialize weapon and character arrays
    this.weapons = assets.weapons.weapons;
    this.characters = [
      new Player(
        this,
        new Vector2D(0, 0).fromOther(this.map.info.playerSpawn), // Player spawn location
        1, // Player health
        assets.playersprite, // Player sprite
        new Box(
          this.map.info.playerSpawn.x,
          this.map.info.playerSpawn.y,
          80,
          80
        ), // Player hitbox
        5 // Player speed
      ),
    ];

    // Equip player with initial weapon
    this.getPlayer().addWeapon(
      new Weapon(
        this.weapons.find((wtype) => wtype.name == "katana"), // Initial weapon (katana)
        this.getPlayer()
      ),
      true
    );

    this.playerAlive = true; // Track if player is alive
    this.enemies = assets.enemies.enemies; // Load enemy definitions

    // Initialize waves and wave management variables
    this.waves = assets.waves.waves;
    this.wave = 0; // Current wave number
    this.spawnTimer = null; // Timer for enemy spawn intervals
    this.nextSpawnID1 = 0; // Enemy type index within the wave
    this.nextSpawnID2 = 0; // Count of specific enemy type in the wave

    this.time = 0; // Game time tracker
    this.timerReference = null; // Reference for game time interval

    this.startTime(); // Start game timer
  }

  // Start the game timer
  startTime() {
    this.timerReference = setInterval(() => {
      this.time++;
    }, 1000);
  }

  // Stop the game timer
  stopTimer() {
    if (this.timerReference !== null) {
      clearInterval(this.timerReference);
      this.timerReference = null;
    }
  }

  // Reset the game timer
  resetTimer() {
    this.time = 0;
  }

  // Get the current game time
  getTime() {
    return this.time;
  }

  // Get the player object
  getPlayer() {
    return this.characters[0];
  }

  // Get the current number of enemies
  numEnemies() {
    return this.characters.length - 1;
  }

  nextWave() {
    const waveIndex = this.wave % this.waves.length;
    const waveInfo = this.waves[waveIndex];
    this.wave++;
    this.nextSpawnID1 = 0;
    this.nextSpawnID2 = 0;

    // Scaling multipliers based on the wave number
    const healthMultiplier = 1 + this.wave * 0.1; // Increase health by 10% each wave
    const damageMultiplier = 1 + this.wave * 0.1; // Increase damage by 10% each wave

    // Clear any previous spawn timer
    clearInterval(this.spawnTimer);
    this.spawnTimer = setInterval(() => {
      const enemy = waveInfo.enemies[this.nextSpawnID1];
      const enemyInfo = this.enemies.find((e) => e.name == enemy.name);

      if (enemyInfo) {
        // Use fixed spawn location without randomization
        const spawnLocation = new Vector2D(0, 0).fromOther(
          this.map.info.enemySpawn
        );

        // Scale enemy health
        const scaledHealth = enemyInfo.health * healthMultiplier;

        const enemyObj = new Enemy(
          this, // Reference to the arena
          spawnLocation, //  spawn location
          scaledHealth, // Scaled health
          enemyInfo.sprite, // Sprite image
          new Box(spawnLocation.x, spawnLocation.y, 80, 80), // Hitbox
          enemyInfo.speed // Movement speed
        );

        // Scale weapon damage if enemy has a weapon
        const weaponInfo = this.weapons.find((w) => w.name == enemyInfo.weapon);
        if (weaponInfo) {
          const scaledDamage = weaponInfo.damage * damageMultiplier;
          const scaledWeapon = new Weapon(
            { ...weaponInfo, damage: scaledDamage }, // Weapon with scaled damage
            enemyObj
          );
          enemyObj.addWeapon(scaledWeapon, true);
        }

        this.characters.push(enemyObj); // Add enemy to characters list
      }

      // Manage spawning logic for each enemy type in the wave
      if (++this.nextSpawnID2 === enemy.count) {
        this.nextSpawnID1++;
        this.nextSpawnID2 = 0;

        // Stop spawn timer if all enemies in the wave are spawned
        if (this.nextSpawnID1 === waveInfo.enemies.length) {
          clearInterval(this.spawnTimer);
          this.spawnTimer = null;
        }
      }
    }, 1000); 
  }

  // Update game state for each frame
  update() {
    if (!this.getPlayer().alive) {
      this.stopTimer();
      return;
    }

    // Filter out dead enemies and update active characters
    this.characters = this.characters.filter((character) => {
      if (character instanceof Enemy && character.health <= 0) {
        character.alive = false;
        return false; // Remove dead enemies
      }
      character.update();
      return true;
    });

    // Check if all enemies are defeated and start the next wave if true
    const enemiesRemaining = this.characters.some(
      (c) => c instanceof Enemy && c.alive
    );
    if (!enemiesRemaining && !this.spawnTimer) {
      this.nextWave();
    }
  }

  // Draw all game elements to the screen
  draw() {
    image(this.map.bgImage, 0, 0, this.width, this.height);
    this.characters.forEach((character) => character.draw());
  }

  // Check if a box location is valid (does not intersect map boundaries)
  isValidBoxLocation(box) {
    return this.map.info.bounds.every((bbox) => !box.intersects(bbox));
  }

  // Scale the map and character dimensions
  scaleMap(scalex, scaley) {
    const info = this.map.info;
    const locs = [info.playerSpawn, info.enemySpawn];
    const boxes = info.bounds;

    // Scale player and enemy spawn points
    locs.forEach((loc) => {
      loc.x *= scalex;
      loc.y *= scaley;
    });
    // Scale boundary boxes
    boxes.forEach((box) => {
      box.x *= scalex;
      box.width *= scalex;
      box.y *= scaley;
      box.height *= scaley;
    });
  }

  // Resize the arena and adjust all characters accordingly
  setSize(newwidth, newheight) {
    const sfx = (1.0 * newwidth) / this.width;
    const sfy = (1.0 * newheight) / this.height;
    this.width = newwidth;
    this.height = newheight;

    this.scaleMap(sfx, sfy); // Adjust map scale
    this.characters.forEach((ch) => ch.scale(sfx, sfy)); // Scale each character
  }
}
