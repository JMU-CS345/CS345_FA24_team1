const Box = require("../modules/classes/Box.js").Box;

describe("Box class", () => {
    test("constructor, fields", () => {
        let b = new Box(20, 9999, 10, 69);
        expect(b.x).toBe(20);
        expect(b.y).toBe(9999);
        expect(b.width).toBe(10);
        expect(b.height).toBe(69);

        new Box(0, 0, 0, 0);
        new Box(-1, -1, 0, 0);
        new Box(999999, 99999999, 999999999, 9999999);

        expect(() => {
            new Box(0, 0, 0, -1);
        }).toThrow(RangeError);
        expect(() => {
            new Box(1, 1, -1, 1);
        }).toThrow(RangeError);
        expect(() => {
            new Box(1, 1, 1, NaN);
        }).toThrow(RangeError);
        expect(() => {
            new Box(1, 1, Infinity, 1);
        }).toThrow(RangeError);
        expect(() => {
            new Box(1, 1, "one", 1);
        }).toThrow(RangeError);
    });

    test("equals", () => {
        let b0 = new Box(0, 0, 0, 0),
            b1 = new Box(5, 6, 7, 8),
            b2 = new Box(8, 7, 6, 5),
            b3 = new Box(5, 6, 7, 8);

        expect(b0.equals(b0)).toBeTruthy();
        expect(b0.equals(b1)).toBeFalsy();
        expect(b0.equals(b2)).toBeFalsy();
        expect(b0.equals(b3)).toBeFalsy();

        expect(b1.equals(b0)).toBeFalsy();
        expect(b1.equals(b1)).toBeTruthy();
        expect(b1.equals(b2)).toBeFalsy();
        expect(b1.equals(b3)).toBeTruthy();

        expect(b2.equals(b0)).toBeFalsy();
        expect(b2.equals(b1)).toBeFalsy();
        expect(b2.equals(b2)).toBeTruthy();
        expect(b2.equals(b3)).toBeFalsy();

        expect(b3.equals(b0)).toBeFalsy();
        expect(b3.equals(b1)).toBeTruthy();
        expect(b3.equals(b2)).toBeFalsy();
        expect(b3.equals(b3)).toBeTruthy();
    });

    test("clone", () => {
        let b0 = new Box(0, 0, 10, 10),
            b1 = new Box(0, 0, 1, 1),
            b2 = new Box(5, 5, 1, 1),
            b3 = new Box(5, -9999, 1, 100),
            b4 = new Box(100, 1, 10, 10),
            b5 = new Box(-14, 0, 15, 1);

        expect(b0.clone().equals(new Box(0, 0, 10, 10))).toBeTruthy();
        expect(b1.clone().equals(new Box(0, 0, 1, 1))).toBeTruthy();
        expect(b2.clone().equals(new Box(5, 5, 1, 1))).toBeTruthy();
        expect(b3.clone().equals(new Box(5, -9999, 1, 100))).toBeTruthy();
        expect(b4.clone().equals(new Box(100, 1, 10, 10))).toBeTruthy();
        expect(b5.clone().equals(new Box(-14, 0, 15, 1))).toBeTruthy();
    });

    test("intersects", () => {
        let b0 = new Box(0, 0, 10, 10),
            b1 = new Box(10, 10, 1, 1),
            b2 = new Box(5, 5, 1, 1),
            b3 = new Box(5, 5, 1, 100),
            b4 = new Box(100, 1, 10, 10),
            b5 = new Box(-14, 0, 15, 1);

        expect(b0.intersects(b0)).toBeTruthy();
        expect(b0.intersects(b1)).toBeTruthy();
        expect(b0.intersects(b2)).toBeTruthy();
        expect(b0.intersects(b3)).toBeTruthy();
        expect(b0.intersects(b4)).toBeFalsy();
        expect(b0.intersects(b5)).toBeTruthy();

        expect(b1.intersects(b0)).toBeTruthy();
        expect(b1.intersects(b1)).toBeTruthy();
        expect(b1.intersects(b2)).toBeFalsy();
        expect(b1.intersects(b3)).toBeFalsy();
        expect(b1.intersects(b4)).toBeFalsy();
        expect(b1.intersects(b5)).toBeFalsy();

        expect(b2.intersects(b0)).toBeTruthy();
        expect(b2.intersects(b1)).toBeFalsy();
        expect(b2.intersects(b2)).toBeTruthy();
        expect(b2.intersects(b3)).toBeTruthy();
        expect(b2.intersects(b4)).toBeFalsy();
        expect(b2.intersects(b5)).toBeFalsy();

        expect(b3.intersects(b0)).toBeTruthy();
        expect(b3.intersects(b1)).toBeFalsy();
        expect(b3.intersects(b2)).toBeTruthy();
        expect(b3.intersects(b3)).toBeTruthy();
        expect(b3.intersects(b4)).toBeFalsy();
        expect(b3.intersects(b5)).toBeFalsy();

        expect(b4.intersects(b0)).toBeFalsy();
        expect(b4.intersects(b1)).toBeFalsy();
        expect(b4.intersects(b2)).toBeFalsy();
        expect(b4.intersects(b3)).toBeFalsy();
        expect(b4.intersects(b4)).toBeTruthy();
        expect(b4.intersects(b5)).toBeFalsy();

        expect(b5.intersects(b0)).toBeTruthy();
        expect(b5.intersects(b1)).toBeFalsy();
        expect(b5.intersects(b2)).toBeFalsy();
        expect(b5.intersects(b3)).toBeFalsy();
        expect(b5.intersects(b4)).toBeFalsy();
        expect(b5.intersects(b5)).toBeTruthy();
    });
});
