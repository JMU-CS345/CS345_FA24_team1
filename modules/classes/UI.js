// TODO: Finish writing Player class and make sure this UI class conforms to it

class UI {

	constructor(arena) {
		this.arena = arena;
	}

	/*
	*	Boilerplate UI drawing, need to change positioning, size etc. once Arena/Map is done.
	*/
    draw() {
        this.arena.draw();
    }
}
