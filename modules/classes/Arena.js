/*
 * Arena class: the arena that the map + all characters exist within.
 */
class Arena {
  /* Constructs a new Arena. Passed object has references to loaded assets. */
  constructor(assets) {
    // Map, arena size
    this.map = { bgImage: assets.mapbg, info: assets.mapinfo };
    this.width = this.map.bgImage.width;
    this.height = this.map.bgImage.height;

    // Weapons
    this.weapons = assets.weapons.weapons;

    // Characters (player+enemies)
    // Create player, add and equip first weapon
    this.characters = [new Player(
      this, new Vector2D(0,0).fromOther(this.map.info.playerSpawn),
      1, assets.playersprite,
      new Box(
        this.map.info.playerSpawn.x, this.map.info.playerSpawn.y,
        80, 80
      ), 5
    )];
    this.getPlayer().addWeapon(new Weapon(this.weapons.find(
            (wtype) => wtype.name == "katana"), this.getPlayer()), true);
    this.playerAlive = true;
    this.enemies = assets.enemies.enemies;

    // Waves, wave, wave enemy spawn timer, next enemy to spawn
    this.waves = assets.waves.waves;
    this.wave = 0;
    this.spawnTimer = null;
    this.nextSpawnID1 = 0; // index of waves.enemies
    this.nextSpawnID2 = 0; // spawn n'th enemy of that index
      
    // Timer
    // TODO this is a really inefficient implementation - should probably use
    // Unix timestamps instead of interval timers
    this.time = 0;
    this.timerReference = null;
        
    // Putting startTime here if we want the timer to go on from start to game
    // over. Will need to be moved if we want the timer to reset every time a
    // new wave has started 
    this.startTime();
  }

  startTime() {
    this.timerReference = setInterval(() => {
      this.time++;
    }, 1000);
  }

  stopTimer() {
    if (this.timerReference !== null) {
      clearInterval(this.timerReference);
      this.timerReference = null;
    }
  }

  resetTimer() {
    this.time = 0;
  }

  getTime() {
    return this.time;
  }

  /* Returns the player. */
  getPlayer() {
    return this.characters[0];
  }

  /* Returns the number of enemies currently in the Arena. */
  numEnemies() {
    return this.characters.length - 1;
  }

  /* Advances the Arena to the next wave. Does not check if the game state is
   * ready for a next wave or not, and assumes that there is a next wave. */
  nextWave() {
    // Advance wave count and grab wave info
    const waveinfo = this.waves[this.wave];
    this.wave++;

    // Spawn one enemy per second until queue empty
    this.nextSpawnID1 = 0;
    this.nextSpawnID2 = 0;
    this.spawnTimer = setInterval(() => {
      // Spawn
      const enemy = waveinfo.enemies[this.nextSpawnID1],
        enemyinfo = this.enemies.find((eobj) => eobj.name == enemy.name);

      const enemyobj = new Enemy(
        this,                                   // arena
        new Vector2D(0,0).fromOther(this.map.info.enemySpawn), // spawn location
        enemyinfo.health,                       // starting health
        enemyinfo.sprite,                       // sprite image
        new Box(                                // hitbox
          this.map.info.enemySpawn.x, this.map.info.enemySpawn.y,
          80, 80
        ),
        enemyinfo.speed,                        // movement speed
      );
    
      // Equip enemy with weapon
      enemyobj.addWeapon(new Weapon(this.weapons.find(
            (wtype) => wtype.name == enemyinfo.weapon), enemyobj), true);

      // Add to characters
      this.characters.push(enemyobj);

      // Next enemy if at count; quit spawning if done
      if ((++this.nextSpawnID2) == enemy.count) {
        if ((++this.nextSpawnID1) == waveinfo.enemies.length) {
          clearInterval(this.spawnTimer);
          this.spawnTimer = null;
        }
      }
    }, 1000);
  }

  /* Returns true if passed Box is entirely within the bounds of the map,
   * false otherwise. */
  isValidBoxLocation(box) {
    return this.map.info.bounds.every((bbox) => !box.intersects(bbox));
  }

  /* Updates everything in the Arena, advancing the state of the game by
   * one game tick. */
  update() {

    // Game freezes when player dies (everything stops moving)
    if (!this.getPlayer().alive) {
      this.stopTimer();
      return;
    }

    // Update characters
    this.characters.forEach(character => character.update());

    /* Wave updates when enemies == 0 */
    if (this.characters.length == 1) {
      //this.nextWave(); // enemies don't spawn yet which causes a bug
    }
  }

  /* Draws the map and characters onto the canvas. */
  draw() {
    image(this.map.bgImage, 0, 0, this.width, this.height);

    // Loop through and draw in reverse order, to draw the player last over
    // any potential overlapping enemies.
    for (let i=(this.characters.length-1); i>=0; i--)
      this.characters[i].draw();
  }

  /* Scales this.map.info by the passed factors. */
  scaleMap(scalex, scaley) {
    const info = this.map.info;

    // Boxes and Vector2Ds to scale
    const locs = [info.playerSpawn, info.enemySpawn];
    const boxes = info.bounds;

    // Scale all
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

  /* Updates the size of the Arena. Scales objects as needed. */
  setSize(newwidth, newheight) {
    // Scale factors
    const sfx = 1.0 * newwidth / this.width,
      sfy = 1.0 * newheight / this.height;
    this.width = newwidth;
    this.height = newheight;

    this.scaleMap(sfx, sfy);
    this.characters.forEach(ch => ch.scale(sfx, sfy));
    // TODO character speed scaling (player + enemies)
  }
}
