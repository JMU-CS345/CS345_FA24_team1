// TODO: Figure out whether to draw UI from UI class or Arena class
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
	*	Starts the UI timer, should be parsed as y:m:d:h:m:s when drawn.
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
}
