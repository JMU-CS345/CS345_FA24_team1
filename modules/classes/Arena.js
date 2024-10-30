/*
 * Arena class: the arena that the map + all characters exist within.
 */
class Arena {
    /* Constructs a new Arena. Passed object has references to loaded assets. */
    constructor(assets) {
        // Map, arena size
        this.map = {bgImage: assets.mapbg, info: assets.mapinfo};
        this.width = this.map.bgImage.width;
        this.height = this.map.bgImage.height;

        // Characters (player+enemies)
        this.characters = [new Player(
            this, this.map.info.playerSpawn, 1, assets.playersprite, 
            new Box(
                this.map.info.playerSpawn.x, this.map.info.playerSpawn.y, 
                assets.playersprite.width, assets.playersprite.height
            ), 1, 1, 1
        )];
        this.playerAlive = true;

        // Wave
        this.wave = 1;
    }
    spawnEnemy() {
      const enemySpawn = this.map.info.enemySpawn;
      const enemy = new Enemy(
          this, enemySpawn, 1, this.assets.enemy1sprite, 
          new Box(enemySpawn.x, enemySpawn.y, this.assets.enemy1sprite.width, this.assets.enemy1sprite.height), 
          1, 1, 1
      );
      this.characters.push(enemy);
  }


    /* Returns the player. */
    getPlayer() {
        return this.characters[0];
    }

    /* Returns the number of enemies currently in the Arena. */
    numEnemies() {
        return this.characters.length - 1;
    }

    /* Advances the Arena to the next wave. */
    nextWave() {
        this.wave++;
        for (let i = 0; i < this.wave; i++) {
          this.spawnEnemy();
        }
        // TODO spawn enemies depending on wave, what else?

    }

    /* Returns true if passed Location is within the bounds of the map,
     * false otherwise. */
    isValidLocation(loc) {
        return loc.x >= 0 && loc.x <= this.width && loc.y >= 0 && loc.y <= this.height;
    }

    /* Updates everything in the Arena, advancing the state of the game by
     * one game tick. */
    update() {
        // TODO - enemies move towards player and try to attack, what else?
        this.characters.forEach(character => character.update());
    }

    /* Draws the map and characters onto the canvas. */
    draw() {
        image(this.map.bgImage, 0, 0, this.width, this.height);
        this.characters.forEach(character => character.draw());
        
        
        // Currently errors until Player/Enemy written TODO
        //this.characters.forEach(character => character.draw());
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
    }
}
