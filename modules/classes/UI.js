// TODO: Finish writing Player class and make sure this UI class conforms to it

class UI {

	constructor(arena) {
		this.arena = arena;
		this.time = 0;
		this.timerReference = null;
	}

	/*
	*	Starts the UI timer, should be parsed as h:m:s when drawn.
	*/
	startTime() {
		this.timerReference = setInterval(() => {
			this.time++;
		}, 1000);
	}

	/*
	* 	Stops the UI timer.
	*/
	stopTime() {
		setInterval(() => {
			clearInterval(this.timerReference);
		}, 1);
	}

	/*
	*	Boilerplate UI drawing, need to change positioning, size etc. once Arena/Map is done.
	*/
	draw() {
		this.arena.draw();

		textSize(24);
		fill(0);
		noStroke();

		const minutes = Math.floor(this.time / 60);
		const seconds = this.time % 60;
		const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		text(`Health: ${this.arena.getPlayer().health}\tTime: ${formattedTime}\tLevel: ${this.arena.wave}`, 10, 30);
	}
}
