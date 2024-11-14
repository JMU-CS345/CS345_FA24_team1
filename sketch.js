/*
 * Main sketch file. Delegates everything to Arena and UI.
 */

let arena, assets;

function preload() {
    // Preload all assets
    assets = {
        charanimations: loadJSON("/modules/configs/character_animations.json"),
        playersprite: loadImage("/assets/characters/sprite_sheets/samurai.png")
    };
}

function setup() {
    arena = new Arena(assets);
    createCanvas(windowWidth, windowHeight);
    arena.setSize(windowWidth, windowHeight);
}

function windowResized() {
    // Keep canvas size equal to window size
    resizeCanvas(windowWidth, windowHeight);
    arena.setSize(windowWidth, windowHeight);
}

function draw() {
    noSmooth(); // NO ANTIALIASING!!!!!!!!!!!!!!!!
    arena.update();
    arena.draw();
}
