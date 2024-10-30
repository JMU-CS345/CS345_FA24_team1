/*
 * Arena class: the arena that the map + all characters exist within.
 */
class Arena {
    /* Constructs a new Arena. */
    constructor() {
        // TODO dependency injection
        this.map = this.loadMap("/assets/maps/map0-debug.png",
                "/assets/maps/map0-debug-bounds.json");
        this.width = this.map.bgImage.width;
        this.height = this.map.bgImage.height;
        this.characters = [new Player(this, new Vector2D(0,0), 1, "/assets/characters/player-debug.png", new Box(0,0,0,0), 1, 1, 1)]; // TODO
        this.playerAlive = true;
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
        let mapobj = {
            bgImage: loadImage(bgpath),
            info: null
        };

        // See fetch API docs
        fetch(infopath).then(response => response.json().then(
                json => mapobj.info = json));

        return mapobj;
    }

    /* Scales this.map.info to reflect the new canvas size. */
    scaleMap(oldwidth, oldheight, newwidth, newheight) {
        const info = this.map.info;

        // Scale factors
        const sfx = 1.0 * newwidth / oldwidth,
              sfy = 1.0 * newheight / oldheight;

        // Boxes and Vector2Ds to scale
        const locs = [info.playerSpawn, info.enemySpawn];
        const boxes = info.bounds;

        // Scale all
        locs.forEach(loc => {
            loc.x *= sfx;
            loc.y *= sfy;
        });
        boxes.forEach(box => {
            box.x *= sfx;
            box.width *= sfx;
            box.y *= sfy;
            box.height *= sfy;
        });
    }

    /* Updates the size of the Arena. Scales objects as needed. */
    setSize(newwidth, newheight) {
        this.scaleMap(this.width, this.height, newwidth, newheight);
        this.width = newwidth;
        this.height = newheight;
    }
}
