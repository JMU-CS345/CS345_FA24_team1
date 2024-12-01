/*
 * Main sketch file. Delegates everything to Arena and UI.
 */

let arena, ui, assets, gameAudio;

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
        strings: loadJSON("assets/locale/en_US.json"),
        playersprites: {
            katana: loadImage("assets/characters/sprite_sheets/samurai.png"),
            pistol: loadImage("assets/characters/sprite_sheets/pistol_stance.png"),
            shotgun: loadImage("assets/characters/sprite_sheets/shotgun_stance.png"),
            rifle: loadImage("assets/characters/sprite_sheets/rifle_stance.png"),
            rocket: loadImage("assets/characters/sprite_sheets/rocket_stance.png")
        },
        weaponImages: {
            katana: loadImage("assets/weapons/katana_slot_1.png"),
            pistol: loadImage("assets/weapons/pistol_slot_2.png"),
            shotgun: loadImage("assets/weapons/shotgun_slot_3.png"),
            rifle: loadImage("assets/weapons/rifle_slot_4.png"),
            rocket: loadImage("assets/weapons/rocket_slot_5.png")
        },
        gameaudio: loadSound("assets/sound/game_loop.mp3"),
        gameoveraudio: loadSound("assets/sound/game_over.wav"),
        playergrunt: loadSound("assets/sound/player_grunt.wav") // https://opengameart.org/content/grunt
    };
}

function setup() {
    getAudioContext().suspend();
    arena = new Arena(assets);
    ui = new UI(assets, arena);
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
    ui.draw();
}
