/*
 * Arena class: the arena that the map + all characters exist within.
 */
class Arena {
  constructor(assets) {
    this.width = 1500;
    this.height = 750;
    this.player = new Player(
      this, new Vector2D(100,100), 1, assets.playersprite,
      new Box(100, 100, 48, 102), 5, assets.charanimations.charanimations
    );
  }

  isValidBoxLocation(box) {
    return true;
  }

  update() {
    this.player.update();
  }

  draw() {
    background(255);
    this.player.draw();
  }

  setSize(newwidth, newheight) {
    const sfx = 1.0 * newwidth / this.width,
      sfy = 1.0 * newheight / this.height;
    this.width = newwidth;
    this.height = newheight;
    this.player.scale(sfx, sfy);
  }
}
