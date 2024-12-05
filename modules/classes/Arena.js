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
    this.bossanimations = assets.bossanimations.bossanimations;

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

    // Start out unpaused
    this.paused = false;
    this.lastPauseToggle = Date.now(); // time of last pause/resume

    this.score = 0; // score-tracking
    this.highscore = (getItem("highScore") == null ? 0 : getItem("highScore"));
  }

  /* Pauses the game state entirely. */
  pause() {
    if (this.paused) return; // Do nothing if already paused

    this.paused = true;
    this.lastPauseToggle = Date.now();

    this.stopTimer(); // Stop game clock
    clearInterval(this.spawnTimer); // Stop spawn timer (if it exists currently)
  }

  /* Resumes the game from being paused. */
  resume() {
    if (!this.paused) return; // Do nothing if not paused

    this.paused = false;
    this.lastPauseToggle = Date.now();

    if ((this.wave > 0) && this.getPlayer().alive)
      this.startTime(); // Restart game clock if it was running
    if (this.spawnTimer != null)
      this.nextWave(true); // Restart spawn timer if it was running
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

  /* Advances the arena to the next wave and spawns enemies with scaling stats. 
   * If contTimer is true, do not advance to the next wave; instead, continue
   * spawning enemies with the spawnTimer where this function left off. */
  nextWave(contTimer = false) {
    // Scale number of enemies if not the first wave
    if (!contTimer && (this.wave > 0))
      this.enemyCount = Math.ceil(this.enemyCount * 1.4);

    // Loop waves if all predefined waves are complete
    const waveIndex = this.wave % this.waves.length;
    const waveinfo = this.waves[waveIndex];

    // Scale enemy health and weapon damage based on the current wave
    const healthMultiplier = 1 + this.wave * 0.2;
    const damageMultiplier = 1 + this.wave * 0.2;

    // Increment wave number, reset spawn indices
    if (!contTimer) {
      this.wave++;
      this.nextSpawnID1 = 0;
      this.nextSpawnID2 = 0;
    }
     // If it's a boss wave (every 5th wave)
     if (this.wave % 5=== 0) { // for testing purposes , change to 5 when the boss animation is done 
      const bossInfo = this.enemies.find((eobj) => eobj.name === "boss");
      const bossSpawn = this.map.info.enemySpawn[0]; // Spawn at the first location
      const scaledHealth = bossInfo.health * healthMultiplier;

      const boss = new Enemy(
          this,
          new Vector2D(0, 0).fromOther(bossSpawn),
          scaledHealth,
          bossInfo.sprite,
          new Box(bossSpawn.x, bossSpawn.y, 40, 84), // Adjust box for boss size
          bossInfo.speed,
          this.bossanimations
      );

      const bossWeaponInfo = this.weapons.find((wtype) => wtype.name === bossInfo.weapon);
      if (bossWeaponInfo) {
          const scaledDamage = bossWeaponInfo.damage * damageMultiplier;
          const bossWeapon = new Weapon(
              { ...bossWeaponInfo, damage: scaledDamage },
              boss
          );
          boss.addWeapon(bossWeapon, true);
      }

      this.characters.push(boss);
      return; // Boss wave only spawns the boss
  }

    // Spawn enemies at intervals
    this.spawnTimer = setInterval(() => {
      const enemy = waveinfo.enemies[this.nextSpawnID1];


      // Find all matching enemies with the same name and pick one randomly
      const matchingEnemies = this.enemies.filter((eobj) => eobj.name == enemy.name);
      let enemyinfo = null;

      if (matchingEnemies.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchingEnemies.length);
        enemyinfo = matchingEnemies[randomIndex];
      }

      if (matchingEnemies.length > 0) {
        const randomIndex = Math.floor(Math.random() * matchingEnemies.length);
        enemyinfo = matchingEnemies[randomIndex];
      }
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
    if (this.paused) return; // Do nothing if paused

    if (!this.getPlayer().alive && (this.timerReference === null)) {
      if (keyIsDown(13)) {
        ui.components = [];
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

        // Initialize pathfinding
        this.pathing = new Pathfinding(this.map, this.getPlayer().box);

        this.wave = 0; // Current wave index
        this.spawnTimer = null; // Timer for spawning enemies
        this.nextSpawnID1 = 0; // Current wave enemy type index
        this.nextSpawnID2 = 0; // Current enemy spawn count

        // Timer for tracking game duration
        this.time = 0;
        this.timerReference = null;
    
        this.enemyCount = 3;

        // Start out unpaused
        this.paused = false;
        this.lastPauseToggle = Date.now(); // time of last pause/resume

        this.score = 0; // score-tracking
        this.highscore = (getItem("highScore") == null ? 0 : getItem("highScore"));
      }
      return;
    }

    if (!this.getPlayer().alive && (this.timerReference != null)) {
      this.stopTimer();
      this.gameaudio.stop();
      this.gameoveraudio.play();
      ui.addComponent({
        draw: function() {
          background(0, 235);

          stroke(255, 255, 255);
          strokeWeight(1);
          fill(255, 0, 0);
          textSize(75);
          textAlign(CENTER, CENTER);
          text("GAME OVER", arena.width>>1, arena.height>>1);

          textSize(40);
          textAlign(CENTER, CENTER);
          text(`${ui.strings.waveText} ${ui.arena.wave}`, arena.width>>1, arena.height - (Math.round(arena.width / Math.pow(2, 2.5))));
          text(`${ui.strings.scoreText}: ${ui.arena.score}`, arena.width>>1, arena.height - (Math.round(arena.width / Math.pow(2, 2.25))));
        } 
      })
    }
  
    this.characters.forEach(character => character.update());
  
    // Check if all enemies are defeated and add start next wave menu if true
    const enemiesRemaining = this.characters.some(
        (c) => c instanceof Enemy && c.alive);
    if (!enemiesRemaining && !this.spawnTimer && this.getPlayer().alive 
        && ui.components.every((comp) => comp.id != 1)) {
      // Whole object refers to global assets/UI/Arena contexts as 'this'
      // refers to the component object
      ui.addComponent({
        // Identifier as the next wave menu
        id: 1,
        creationFrame: frameCount, // Frame created in (for animation logic)
        draw: function() {
          stroke(255, 255, 255);
          strokeWeight(1);
          fill(255, 255, 255);
          textSize(25);
          textAlign(LEFT, TOP);

          if (arena.wave == 0) {
            // Start of game - starting text
            background(0, 0, 0);

            const txtstr = assets.strings.introText, /* text to display */
                  aniDelay = 30, /* # of frames to delay start of animation */
                  framesPerChar = 3; /* # of frames for each character load */
            
            const curstrlen = Math.min(
              txtstr.length, 
              Math.floor(Math.max(frameCount - this.creationFrame - aniDelay, 0)
                  / framesPerChar)
            );

            const textx = arena.width >> 3, /* 1/8th from left/top edges */
                  texty = arena.height >> 3,
                  textw = (arena.width >> 2) * 3, /* 3/4ths across page w/h */
                  texth = (arena.height >> 2) * 3;
            text(txtstr.substring(0, curstrlen), textx, texty, 
                textw, texth);
          }

          // Start next wave text
          textAlign(CENTER, CENTER);
          text(assets.strings.newWaveText,
              arena.width>>1, arena.height - (arena.height>>3));

          // Start next wave if enter is pressed
          if (keyIsDown(13)) { // ENTER
            // Start audio and game timer if first wave
            if (arena.wave == 0) {
              userStartAudio();
              assets.gameaudio.setVolume(0.45);
              assets.gameaudio.loop();
              arena.startTime();
            }

            arena.nextWave();
            
            ui.removeComponent(this); // Remove from components list
          }
        }
      });
    }

    // Pause game if ESC pressed
    // Check lastPauseToggle to not immediately pause/resume with holding ESC
    if (keyIsDown(27) && ((Date.now() - this.lastPauseToggle) > 500)) {
      this.pause();
      ui.addComponent({
        draw: function() {
          // Unpause and delete self if ESC pressed again
          if (keyIsDown(27) && ((Date.now() - arena.lastPauseToggle) > 500)) {
            arena.resume();
            ui.removeComponent(this);
          }

          // Dim game in background
          background(0, 200);

          // Pause screen text
          stroke(255, 255, 255);
          strokeWeight(1);
          fill(255, 255, 255);
          textSize(40);
          textAlign(CENTER, CENTER);
          text(assets.strings.pausedText, arena.width>>1, arena.height>>3);
          textSize(25);
          textAlign(LEFT, TOP);
          text(assets.strings.controlsText, arena.width>>2, arena.height>>2);
        }
      });
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
