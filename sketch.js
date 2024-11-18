/*
 * Main sketch file. Delegates everything to Arena and UI.
 */

let arena, ui, assets;

function preload() {
    // Preload all assets
    assets = {
        enemies: loadJSON("modules/configs/Enemies.json", (obj) => {
            // Load enemy sprites and enemy.sprite to loaded image
            obj.enemies.forEach((enemy) =>
                    enemy.sprite = loadImage(enemy.sprite));
        }),
        waves: loadJSON("modules/configs/waves.json"),
        weapons: loadJSON("modules/configs/WeaponTypes.json", (obj) => {
            // Load projectile sprites
            obj.weapons.forEach((wtype) => {
                if (wtype.hasranged)
                    wtype.projsprite = loadImage(wtype.projsprite);
            });
        }),
        charanimations: loadJSON("modules/configs/character_animations.json"),
        mapbg: loadImage("assets/maps/OriginalMap.jpg"),
        mapinfo: loadJSON("assets/maps/OriginalMap-bounds.json"),
        playersprite: loadImage("assets/characters/sprite_sheets/samurai.png"),
        weaponImages: {
            katana: loadImage("assets/weapons/katana_slot_1.png"),
            pistol: loadImage("assets/weapons/pistol_slot_2.png"),
            shotgun: loadImage("assets/weapons/shotgun_slot_3.png"),
            rifle: loadImage("assets/weapons/rifle_slot_4.png"),
            rocket: loadImage("assets/weapons/rocket_slot_5.png")
        }
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
