/*
 * Main sketch file. Delegates everything to Arena and UI.
 */

let arena, ui;

function preload() {
    // Create Arena and UI in preload() to allow for image loading to finish
    arena = new Arena();
    ui = new UI(arena);
}

function setup() {
    // Canvas must be created no earlier than the start of setup()
    createCanvas(windowWidth, windowHeight);
    arena.setSize(windowWidth, windowHeight);
}

function draw() {
    arena.update();
    ui.draw();
}
