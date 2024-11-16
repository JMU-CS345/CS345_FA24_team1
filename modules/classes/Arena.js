class Arena {
  constructor(assets) {
    this.map = { bgImage: assets.mapbg, info: assets.mapinfo };
    this.width = this.map.bgImage.width;
    this.height = this.map.bgImage.height;

    this.weapons = assets.weapons.weapons;
    this.charanimations = assets.charanimations.charanimations;

    this.characters = [new Player(
      this,
      new Vector2D(0, 0).fromOther(this.map.info.playerSpawn),
      1, assets.playersprite,
      new Box(
        this.map.info.playerSpawn.x, this.map.info.playerSpawn.y, 24, 51
      ), 5, this.charanimations
    )];
    this.getPlayer().addWeapon(new Weapon(this.weapons.find(
      (wtype) => wtype.name == "katana"), this.getPlayer()), true);
    this.playerAlive = true;
    this.enemies = assets.enemies.enemies;

    this.waves = assets.waves.waves;
    this.wave = 0;
    this.spawnTimer = null;
    this.nextSpawnID1 = 0;
    this.nextSpawnID2 = 0;

    this.time = 0;
    this.timerReference = null;

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

  getPlayer() {
    return this.characters[0];
  }

  numEnemies() {
    return this.characters.length - 1;
  }

  nextWave() {
    const waveIndex = this.wave % this.waves.length;
    const waveinfo = this.waves[waveIndex];
    this.wave++;
    const healthMultiplier = 1 + this.wave * 0.5;
    const damageMultiplier = 1 + this.wave * 0.5;

    this.nextSpawnID1 = 0;
    this.nextSpawnID2 = 0;
    this.spawnTimer = setInterval(() => {
      const enemy = waveinfo.enemies[this.nextSpawnID1];
      const enemyinfo = this.enemies.find((eobj) => eobj.name == enemy.name);

      const randidx = Math.floor(Math.random() * this.map.info.enemySpawn.length);
      const enemySpawn = this.map.info.enemySpawn[randidx];

      const scaledHealth = enemyinfo.health * healthMultiplier;

      const enemyobj = new Enemy(
        this,
        new Vector2D(0, 0).fromOther(enemySpawn),
        scaledHealth,
        enemyinfo.sprite,
        new Box(enemySpawn.x, enemySpawn.y, 24, 51),
        enemyinfo.speed,
        this.charanimations
      );

      const weaponInfo = this.weapons.find((wtype) => wtype.name == enemyinfo.weapon);
      if (weaponInfo) {
        const scaledDamage = weaponInfo.damage * damageMultiplier;
        const scaledWeapon = new Weapon(
          { ...weaponInfo, damage: scaledDamage },
          enemyobj
        );
        enemyobj.addWeapon(scaledWeapon, true);
      }

      this.characters.push(enemyobj);

      if ((++this.nextSpawnID2) == enemy.count) {
        if ((++this.nextSpawnID1) == waveinfo.enemies.length) {
          clearInterval(this.spawnTimer);
          this.spawnTimer = null;
        }
      }
    }, 1000);
  }

  isValidBoxLocation(box) {
    return this.map.info.bounds.every((bbox) => !box.intersects(bbox));
  }

  update() {
    if (!this.getPlayer().alive && (this.timerReference != null))
      this.stopTimer();

    this.characters.forEach(character => character.update());

    // Check if all enemies are defeated and start the next wave if true
    const enemiesRemaining = this.characters.some(
      (c) => c instanceof Enemy && c.alive
    );
    if (!enemiesRemaining && !this.spawnTimer) {
      this.nextWave();
    }
  }

  draw() {
    image(this.map.bgImage, 0, 0, this.width, this.height);
    for (let i = (this.characters.length - 1); i >= 0; i--)
      this.characters[i].draw();
  }

  scaleMap(scalex, scaley) {
    const info = this.map.info;
    const locs = [info.playerSpawn].concat(info.enemySpawn);
    const boxes = info.bounds;

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

  setSize(newwidth, newheight) {
    const sfx = 1.0 * newwidth / this.width;
    const sfy = 1.0 * newheight / this.height;
    this.width = newwidth;
    this.height = newheight;

    this.scaleMap(sfx, sfy);
    this.characters.forEach(ch => ch.scale(sfx, sfy));
  }
}
