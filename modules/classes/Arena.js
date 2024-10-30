/*
 * Arena class: the arena that the map + all characters exist within.
 */
class Arena {
    /* Constructs a new Arena. */
    constructor() {
        // TODO dependency injection

        // Map, arena size
        this.map = this.loadMap("/assets/maps/map0-debug.png",
                "/assets/maps/map0-debug-bounds.json");
        this.width = this.map.bgImage.width;
        this.height = this.map.bgImage.height;

        // Characters (player+enemies)
        this.characters = [new Player(this, new Vector2D(0,0), 1, "/assets/characters/player-debug.png", new Box(0,0,0,0), 1, 1, 1)]; // TODO
        this.playerAlive = true;

        // Wave
        this.wave = 1;
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
        // TODO spawn enemies depending on wave, what else?
    }

    /* Returns true if passed Location is within the bounds of the map,
     * false otherwise. */
    isValidLocation(loc) {
        return true; // TODO implement
    }

    /* Updates everything in the Arena, advancing the state of the game by
     * one game tick. */
    update() {
        // TODO - enemies move towards player and try to attack, what else?
    }

    /* Draws the map and characters onto the canvas. */
    draw() {
        image(this.map.bgImage, 0, 0, this.width, this.height);
        
        // Currently errors until Player/Enemy written TODO
        //this.characters.forEach(character => character.draw());
    }

    /* Loads the passed map files into memory. Returns an object containing
     * the background image at bgImage and the map info JSON at info. */
    loadMap(bgpath, infopath) {
        return {
            bgImage: loadImage(bgpath),
            info: loadJSON(infopath)
        };
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
