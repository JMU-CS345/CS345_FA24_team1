// TODO: Finish writing Player class and make sure this UI class conforms to it

class UI {

	constructor(player) {
		this.health = player.health;
		this.time = 0;
		this.level = 1;
		this.timerReference = null;
	}

	/*
	*	Updates health for UI, called alongside every update to a players health.
	*/
	updateHealth(player) {
		this.health = player.health;
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
	*	Increments the level count.
	*	There should be no need to go backwards, as the UI will be reset every time the game ends.
	*/
	nextLevel() {
		this.level++;
	}

	/*
	*	Boilerplate UI drawing, need to change positioning, size etc. once Arena/Map is done.
	*/
	draw() {
		background(255);
		textSize(24);
		fill(0);
		noStroke();

		text(`Health: ${this.health}`, 10, 30);

		const minutes = Math.floor(this.time / 60);
		const seconds = this.time % 60;
		const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
		text(`Time: ${formattedTime}`, 10, 60);

		text(`Level: ${this.level}`, 10, 90);
	}
}
