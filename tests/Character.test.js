const Character = require("../modules/classes/Character.js");
const Box = require("../modules/classes/Box.js").Box;

describe("Character class tests", () => {
    test("Boxes intersect", () => {
        let charBox = new Box(200, 200, 10, 10);
        let char1 = new Character(null, null, null, charBox);
        let intersectingBox1 = new Box(209, 209, 10, 10);
        let intersectingBox2 = new Box(210, 210, 3, 3);
        let notIntersectingBox1 = new Box(211, 211, 10, 10);
        let notIntersectingBox2 = new Box(189, 189, 10, 10);
        expect(char1.checkHit(intersectingBox1)).toBe(true);
        expect(char1.checkHit(intersectingBox2)).toBe(true);
        expect(char1.checkHit(notIntersectingBox1)).toBe(false);
        expect(char1.checkHit(notIntersectingBox2)).toBe(false);
    });
});
