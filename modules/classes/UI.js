// TODO: Finish writing Player class and make sure this UI class conforms to it

class UI {

	constructor(arena) {
		this.arena = arena;
		this.time = 0;
		this.timerReference = null;
	}

	/*
	*	Boilerplate UI drawing, need to change positioning, size etc. once Arena/Map is done.
	*/
    draw() {
        this.arena.draw();

        textSize(24);
        fill(255);
        noStroke();

        text(`Health: ${this.arena.getPlayer().health}`, 10, 30);

        const time = this.arena.getTime();
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        text(`Time: ${formattedTime}`, 10, 60);

        text(`Level: ${this.arena.wave}`, 10, 90);
    }
}
