/*
 * Main sketch file. Delegates everything to Arena and UI.
 */

let arena, ui;

function preload() {
    arena = new Arena();
    ui = new UI(arena);
}

function draw() {
    arena.update();
    ui.draw();
}
