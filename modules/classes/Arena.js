/*
 * Arena class: the arena that the map + all characters exist within.
 */
class Arena {
  /* Constructs a new Arena. Passed object has references to loaded assets. */
  constructor(assets) {
    // Map and arena dimensions
    this.map = { bgImage: assets.mapbg, info: assets.mapinfo };
    this.width = this.map.bgImage.width;
    this.height = this.map.bgImage.height;

    // Weapons and character sprite animations
    this.weapons = assets.weapons.weapons;
    this.charanimations = assets.charanimations.charanimations;

    // Characters (player + enemies)
    // Create player, equip with a weapon, and mark player as alive
    this.characters = [new Player(
      this,
      new Vector2D(0, 0).fromOther(this.map.info.playerSpawn),
      25, assets.playersprites.katana,
      new Box(
        this.map.info.playerSpawn.x, this.map.info.playerSpawn.y, 24, 51
      ), 5, this.charanimations
    )];
    this.getPlayer().addWeapon(new Weapon(this.weapons.find(
      (wtype) => wtype.name == "katana"), this.getPlayer()), true);
    this.playerAlive = true;
    this.enemies = assets.enemies.enemies;
    this.gameaudio = assets.gameaudio;
    this.gameoveraudio = assets.gameoveraudio;
    this.playergrunt = assets.playergrunt;


    // Initialize pathfinding
    this.pathing = new Pathfinding(this.map, this.getPlayer().box);

    // Wave information
    this.waves = assets.waves.waves;
    this.wave = 0; // Current wave index
    this.spawnTimer = null; // Timer for spawning enemies
    this.nextSpawnID1 = 0; // Current wave enemy type index
    this.nextSpawnID2 = 0; // Current enemy spawn count

    // Timer for tracking game duration
    this.time = 0;
    this.timerReference = null;
    
    this.enemyCount = 3;
  }

  /* Starts the game timer, incrementing time every second. */
  startTime() {
    this.timerReference = setInterval(() => {
      this.time++;
    }, 1000);
  }

  /* Stops the game timer if running. */
  stopTimer() {
    if (this.timerReference !== null) {
      clearInterval(this.timerReference);
      this.timerReference = null;
    }
  }

  /* Resets the game timer to zero. */
  resetTimer() {
    this.time = 0;
  }

  /* Returns the current time in seconds. */
  getTime() {
    return this.time;
  }

  /* Returns the player character. */
  getPlayer() {
    return this.characters[0];
  }

  /* Returns the number of enemies currently in the arena. */
  numEnemies() {
    return this.characters.length - 1;
  }

  /* Advances the arena to the next wave and spawns enemies with scaling stats. */
  nextWave() {
    // Loop waves if all predefined waves are complete
    const waveIndex = this.wave % this.waves.length;
    const waveinfo = this.waves[waveIndex];
    this.wave++;

    // Scale enemy health and weapon damage based on the current wave
    const healthMultiplier = 1 + this.wave * 0.2;
    const damageMultiplier = 1 + this.wave * 0.2;

    // Reset spawn indices
    this.nextSpawnID1 = 0;
    this.nextSpawnID2 = 0;

    // Spawn enemies at intervals
    this.spawnTimer = setInterval(() => {
      const enemy = waveinfo.enemies[this.nextSpawnID1];
      const enemyinfo = this.enemies.find((eobj) => eobj.name == enemy.name);

      // Randomize spawn location for enemy
      const randidx = Math.floor(Math.random() * this.map.info.enemySpawn.length);
      const enemySpawn = this.map.info.enemySpawn[randidx];

      // Scale enemy health
      const scaledHealth = enemyinfo.health * healthMultiplier;

      // Create enemy object
      const enemyobj = new Enemy(
        this,
        new Vector2D(0, 0).fromOther(enemySpawn),
        scaledHealth,
        enemyinfo.sprite,
        new Box(enemySpawn.x, enemySpawn.y, 24, 51),
        enemyinfo.speed,
        this.charanimations
      );

      // Scale and assign weapon to the enemy
      const weaponInfo = this.weapons.find((wtype) => wtype.name == enemyinfo.weapon);
      if (weaponInfo) {
        const scaledDamage = weaponInfo.damage * damageMultiplier;
        const scaledWeapon = new Weapon(
          { ...weaponInfo, damage: scaledDamage },
          enemyobj
        );
        enemyobj.addWeapon(scaledWeapon, true);
      }

      // Add enemy to the arena
      this.characters.push(enemyobj);

      // Advance spawn indices, stop timer when all enemies are spawned
      if ((++this.nextSpawnID2) == this.enemyCount) {
        if ((++this.nextSpawnID1) == waveinfo.enemies.length) {
          clearInterval(this.spawnTimer);
          this.spawnTimer = null;
        }
      }
    }, 1000);
  }

  /* Checks if the passed Box is entirely within the map bounds. */
  isValidBoxLocation(box) {
    return this.map.info.bounds.every((bbox) => !box.intersects(bbox));
  }

  /* Updates the arena's state and handles game logic per tick. */
  update() {
    if (!this.getPlayer().alive && (this.timerReference != null)) {
      this.stopTimer();
      this.gameaudio.stop();
      this.gameoveraudio.play();
    }
  
    this.characters.forEach(character => character.update());
  
    // Check if all enemies are defeated and start the next wave if true
    const enemiesRemaining = this.characters.some(
      (c) => c instanceof Enemy && c.alive
    );
    if (!enemiesRemaining && !this.spawnTimer && this.timerReference) {
      this.enemyCount = Math.ceil(this.enemyCount * 1.4);
      this.nextWave();
    }
  }

  /* Draws the arena map and characters. */
  draw() {
    image(this.map.bgImage, 0, 0, this.width, this.height);
    
    // Draw characters, dead zombies then live zombies then player
    this.characters.forEach((chr) => {
        if ((chr instanceof Enemy) && (!chr.alive)) chr.draw();
    });
    this.characters.forEach((chr) => {
        if ((chr instanceof Enemy) && (chr.alive)) chr.draw();
    });
    this.characters[0].draw();
  }

  /* Scales the map and associated elements by the given factors. */
  scaleMap(scalex, scaley) {
    const info = this.map.info;
    const locs = [info.playerSpawn].concat(info.enemySpawn).concat(info.graph);
    const boxes = info.bounds;

    // Scale spawn locations and bounding boxes
    locs.forEach(loc => {
      loc.x *= scalex;
      loc.y *= scaley;
    });
    boxes.forEach(box => {
      box.x *= scalex;
      box.width *= scalex;
      box.y *= scaley;
      box.height *= scaley;
    });
  }

  /* Updates the arena's size and scales objects accordingly. */
  setSize(newwidth, newheight) {
    const sfx = 1.0 * newwidth / this.width;
    const sfy = 1.0 * newheight / this.height;
    this.width = newwidth;
    this.height = newheight;

    this.scaleMap(sfx, sfy);
    this.characters.forEach(ch => ch.scale(sfx, sfy));
  }
}
