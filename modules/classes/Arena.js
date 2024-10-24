class Arena {

  constructor(picture, characters, playerAlive, mapBounds) {
    this.picture = picture;
    this.characters = characters;
    this.wave = 1;
    this.playerALive = true;
    this.mapBounds = mapBounds;

    this.img = NULL;
  }

  nextWave() {
    //adds new_length to the characters array to add additional enemies to the map, based on wave number
    if (wave < 5) {
      new_length = characters.length + 10;
      //add new_length to characters array
    }
    if (wave >= 5) {
      new_length = floor(characters.length * 1.25);
      //add new_length to characters array
    }
  
    wave +=1;
    //increments wave
  }

  isValidLocation(location) {
    //true if locations x & y values are within the bounds, false otherwise
    return (location.x > 1133 || location.x < 0 || location.y > 752 || location.y < 0);
  }

  //functions to put the picture on screen
  preload() {
    this.img = loadImage(picture);
  }
  setup() {
    createCanvas(1133, 752);
  }

  draw() {
    image(img, 0, 0);
  }
}