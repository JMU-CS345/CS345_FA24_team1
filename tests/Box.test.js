const Box = require("../modules/classes/Box.js").Box;

describe("Box class", () => {
    test("constructor, fields", () => {
        let b = new Box(20, 9999, 10, 69);
        expect(b.x).toBe(20);
        expect(b.y).toBe(9999);
        expect(b.width).toBe(10);
        expect(b.height).toBe(69);
    });
});
