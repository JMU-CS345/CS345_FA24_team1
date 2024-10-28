class Arena {

  constructor(img, characters, playerAlive, mapBounds) {
    this.img = img;
    this.characters = characters;
    this.wave = 1;
    this.playerAlive = playerAlive;
    this.mapBounds = mapBounds;
  }

  numEnemies() {
    return characters.length - 1;
  }

  nextWave() {
    //adds new_length to the characters array to add additional enemies to the map, based on wave number
    //we can always change how many enemies are added another time
    if (wave < 5) {
      new_length = numEnemies() + 10;
      //add new_length to characters array
    }
    if (wave >= 5) {
      new_length = floor(numEnemies() * 1.25);
      //add new_length to characters array
    }
    wave++;
    //increments wave
  }

  isValidLocation(location) {
    //true if locations x & y values are within the bounds, false otherwise
    return true;
  }

  //function to put the picture on screen
  draw() {
    image(img, 0, 0, 400, 400);
  }
}
