/*
 * Arena class: the arena that the map + all characters exist within.
 */
class Arena {
    /* Constructs a new Arena. */
    constructor() {
        // TODO dependency injection
        this.map = this.loadMap("/assets/maps/map0-debug.png",
                "/assets/maps/map0-debug-bounds.png");
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
        return characters.length - 1;
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

    /* Draws the map onto the canvas. */
    draw() {
        // image(this.map.bgImage, 0, 0, width, height); TODO once map loaded
    }

    /* Loads the passed map files into memory. Returns an object containing
     * the background image at bgImage and the map info JSON at info. */
    loadMap(bgpath, infopath) {
        // TODO implement (+ scale after loading?)
        return {bgImage: null, info: null};
    }

    /* Scales this.map.info to reflect the new canvas size. */
    scaleMap(oldwidth, oldheight, newwidth, newheight) {
        // TODO implement
    }
}
