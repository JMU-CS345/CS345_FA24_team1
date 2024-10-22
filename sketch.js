/*
 * Main sketch file. Delegates everything to Arena.
 */

let arena;
let ui;
let player;

function setup() {
    createCanvas(windowWidth, windowHeight);
    // arena = new Arena();
    player = {health:5}; // just for now, while player class isn't finished
    ui = new UI(player);
    ui.startTime();
}

function draw() {
    background(255);
    ui.draw();
    // arena.update();
    // arena.draw();
}
