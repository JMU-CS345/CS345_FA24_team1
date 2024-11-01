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

    // Characters (player+enemies)
    this.characters = [new Player(
      this, new Vector2D(0,0).fromOther(this.map.info.playerSpawn),
      1, assets.playersprite,
      new Box(
        this.map.info.playerSpawn.x, this.map.info.playerSpawn.y,
        assets.playersprite.width, assets.playersprite.height
      ), 1, 1, 1
    )];
    this.playerAlive = true;
    this.enemies = assets.enemies.enemies;

    // Waves, wave, wave enemy spawn timer, next enemy to spawn
    this.waves = assets.waves.waves;
    this.wave = 0;
    this.spawnTimer = null;
    this.nextSpawnID1 = 0; // index of waves.enemies
    this.nextSpawnID2 = 0; // spawn n'th enemy of that index
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

      this.characters.push(new Enemy(
        this,                                   // arena
        new Vector2D(0,0).fromOther(this.map.info.enemySpawn), // spawn location
        enemyinfo.health,                       // starting health
        enemyinfo.sprite,                       // sprite image
        new Box(                                // hitbox
          this.map.info.enemySpawn.x, this.map.info.enemySpawn.y,
          enemyinfo.sprite.width, enemyinfo.sprite.height
        ),
        enemyinfo.speed,                        // movement speed
        enemyinfo.fireRate,                     // fire rate
        enemyinfo.damage                        // damage
      ));

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
    /* PLAYER MOVEMENT */
    // TODO: bounds check is commented out since there is an error
    if (keyIsDown(UP_ARROW)) {
      const newBox = new Box(this.getPlayer().box.x, this.getPlayer().box.y - this.getPlayer().speed, this.getPlayer().box.width, this.getPlayer().box.height);
      if (this.isValidBoxLocation(newBox)) {
        this.getPlayer().move("up");
      }
    }
    if (keyIsDown(DOWN_ARROW)) {
      const newBox = new Box(this.getPlayer().box.x, this.getPlayer().box.y + this.getPlayer().speed, this.getPlayer().box.width, this.getPlayer().box.height);
      if (this.isValidBoxLocation(newBox)) {
        this.getPlayer().move("down");
      }
    }
    if (keyIsDown(LEFT_ARROW)) {
      const newBox = new Box(this.getPlayer().box.x - this.getPlayer().speed, this.getPlayer().box.y, this.getPlayer().box.width, this.getPlayer().box.height);
      if (this.isValidBoxLocation(newBox)) {
        this.getPlayer().move("left");
      }
    }
    if (keyIsDown(RIGHT_ARROW)) {
      const newBox = new Box(this.getPlayer().box.x + this.getPlayer().speed, this.getPlayer().box.y, this.getPlayer().box.width, this.getPlayer().box.height);
      if (this.isValidBoxLocation(newBox)) {
        this.getPlayer().move("right");
      }
    }
    /* END PLAYER MOVEMENT */

    // TODO should be moved to Enemy and then we can call
    // this.characters.forEach(character => character.update());
    this.characters.forEach(character => {
      if (character instanceof Enemy) {
        // Get the player's position
        const player = this.getPlayer();
        const playerBox = player.box;

        // Simple logic to move towards the player
        if (character.box.x < playerBox.x) {
          character.move("right");
        } else if (character.box.x > playerBox.x) {
          character.move("left");
        }

        if (character.box.y < playerBox.y) {
          character.move("down");
        } else if (character.box.y > playerBox.y) {
          character.move("up");
        }
      }
    });

    /* Wave updates when enemies == 0 */
    if (this.characters.length == 1) {
      //this.nextWave(); // enemies don't spawn yet which causes a bug
    }
  }

  /* Draws the map and characters onto the canvas. */
  draw() {
    this.update();
    image(this.map.bgImage, 0, 0, this.width, this.height);
    this.characters.forEach(character => character.draw());
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
