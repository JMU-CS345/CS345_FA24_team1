/*
 * Main sketch file. Delegates everything to Arena and UI.
 */

let arena, ui, assets;

function preload() {
    // Preload all assets
    assets = {
        enemies: loadJSON("/modules/configs/Enemies.json", (obj) => {
            // Load enemy sprites and enemy.sprite to loaded image
            obj.enemies.forEach((enemy) =>
                    enemy.sprite = loadImage(enemy.sprite));
        }),
        waves: loadJSON("/modules/configs/waves.json"),
        mapbg: loadImage("/assets/maps/map0-debug.png"),
        mapinfo: loadJSON("/assets/maps/map0-debug-bounds.json"),
        playersprite: loadImage("/assets/characters/player-debug.png")
    };
}

function setup() {
    arena = new Arena(assets);
    ui = new UI(arena);
    createCanvas(windowWidth, windowHeight);
    arena.setSize(windowWidth, windowHeight);
    arena.nextWave();
}

function windowResized() {
    // Keep canvas size equal to window size
    resizeCanvas(windowWidth, windowHeight);
    arena.setSize(windowWidth, windowHeight);
}

function draw() {
    arena.update();
    ui.draw();
}
