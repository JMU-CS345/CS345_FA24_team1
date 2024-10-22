/*
 * Main sketch file. Delegates everything to Arena.
 */

var arena;

function setup() {
    arena = new Arena();
}

function draw() {
    arena.update();
    arena.draw();
}
