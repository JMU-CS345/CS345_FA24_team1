// TODO: Finish writing Player class and make sure this UI class conforms to it

class UI {

	constructor(arena) {
		this.arena = arena;
		this.time = 0;
		this.timerReference = null;
        this.weaponSlotCount = 5;
        this.slotSize = 50;
        this.slotPadding = 10;
        this.selectedWeaponIndex = 0;

        this.weaponUnlockRounds = [0, 3, 6, 9, 12];

        this.components = []; /* Currently active components */
	}

	/*
	*	Boilerplate UI drawing, need to change positioning, size etc. once Arena/Map is done.
	*/
    draw() {
        noSmooth(); // Disable antialiasing
        this.arena.draw();

        textAlign(LEFT, BOTTOM);
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
        this.checkSlotSwitch();
        this.drawWeaponHotbar();

        // Draw all components
        this.components.forEach((comp) => comp.draw());
    }

    checkSlotSwitch() {
        let previousWeaponIndex = this.selectedWeaponIndex;

        if (keyIsDown(49)) this.selectedWeaponIndex = 0; // Key "1"
        else if (keyIsDown(50)) this.selectedWeaponIndex = 1; // Key "2"
        else if (keyIsDown(51)) this.selectedWeaponIndex = 2; // Key "3"
        else if (keyIsDown(52)) this.selectedWeaponIndex = 3; // Key "4"
        else if (keyIsDown(53)) this.selectedWeaponIndex = 4; // Key "5"

        const wave = this.arena.wave;

        if (this.weaponUnlockRounds[this.selectedWeaponIndex] > wave) {
            this.selectedWeaponIndex = previousWeaponIndex; // Revert if not unlocked
        }

        if (previousWeaponIndex !== this.selectedWeaponIndex) {
            const weaponKeys = ["katana", "pistol", "shotgun", "rifle", "rocket"];
            const newWeapon = weaponKeys[this.selectedWeaponIndex];
            this.arena.getPlayer().sprite = assets.playersprites[newWeapon];
        }
    }

    drawWeaponHotbar() {
        const hotbarWidth = (this.slotSize * this.weaponSlotCount) + (this.slotPadding * (this.weaponSlotCount - 1));
        const hotbarX = (width - hotbarWidth) / 2;  // Center hotbar horizontally
        const hotbarY = height - this.slotSize - 20;
        const weaponImageKeys = ["katana", "pistol", "shotgun", "rifle", "rocket"];
        const currentWave = this.arena.wave;
        
        for (let i = 0; i < this.weaponSlotCount; i++) {
            const slotX = hotbarX + i * (this.slotSize + this.slotPadding);
    
            // Highlight selected weapon slot based on key press
            if (i === this.selectedWeaponIndex) {
                fill(200, 200, 50); // Highlight color for the selected slot
                stroke(255);
                strokeWeight(3);
            } else {
                fill(100);
                noStroke();
            }
            
            // Draw the slot
            rect(slotX, hotbarY, this.slotSize, this.slotSize);

            if (currentWave >= this.weaponUnlockRounds[i]) {
                const weaponImage = assets.weaponImages[weaponImageKeys[i]];
                if (weaponImage) {
                    image(weaponImage, slotX, hotbarY, this.slotSize, this.slotSize);
                }
            }
        }
    }
    
    /* Adds a new component object to the UI. Each component must implement its
     * own draw() method, called at the end of UI's draw(). */
    addComponent(component) {
        this.components.push(component);
    }

    /* Removes the specified component from the UI. */
    removeComponent(component) {
        this.components.splice(this.components.indexOf(component), 1);
    }
}

