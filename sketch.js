/*
 * Main sketch file. Delegates everything to Arena and UI.
 */

let arena, ui, assets;

function preload() {
  // Preload all assets
  assets = {
    mapbg: loadImage("/assets/maps/map0-debug.png"),
    mapinfo: loadJSON("/assets/maps/map0-debug-bounds.json"),
    playersprite: loadImage("/assets/characters/player-debug.png"),
    enemysprite: loadImage("/assets/characters/enemy-debug.png"),
  };
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  arena = new Arena(assets);
  ui = new UI(arena);
  createCanvas(windowWidth, windowHeight);
  arena.setSize(windowWidth, windowHeight);
}

function windowResized() {
  // Keep canvas size equal to window size
  resizeCanvas(windowWidth, windowHeight);
  arena.setSize(windowWidth, windowHeight);
}

function draw() {
  arena.update();
  arena.draw();
  ui.draw();
}
