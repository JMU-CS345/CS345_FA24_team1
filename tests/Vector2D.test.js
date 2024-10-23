const Vector2D = require("../modules/classes/Vector2D.js").Vector2D;

describe("Vector2D class", () => {
    test("constructor, fields", () => {
        let vec = new Vector2D(0, 0);
        expect(vec.x).toBe(0);
        expect(vec.y).toBe(0);

        vec = new Vector2D(34589, -4390);
        expect(vec.x).toBe(34589);
        expect(vec.y).toBe(-4390);
    });

    test("fromCartesian, fromPolar", () => {
        let vec = new Vector2D(123, 456);
    
        vec.fromCartesian(10, 20);
        expect(vec.x).toBe(10);
        expect(vec.y).toBe(20);

        vec.fromPolar(10, 2);
        expect(vec.x).toBeCloseTo(-4.16146); // 10cos2
        expect(vec.y).toBeCloseTo(9.09297); // 10sin2
    });

    test("magnitude, angle, asPolar", () => {
        let vec = new Vector2D(123, 456),
            asp = vec.asPolar();

        expect(vec.magnitude()).toBeCloseTo(472.2975); // sqrt(223065)
        expect(asp.r).toBeCloseTo(472.2975);
        expect(vec.angle()).toBeCloseTo(1.3073); // arctan(456/123)
        expect(asp.theta).toBeCloseTo(1.3073);

        vec.fromPolar(6.543, 1.6);
        asp = vec.asPolar();

        expect(vec.magnitude()).toBeCloseTo(6.543);
        expect(asp.r).toBeCloseTo(6.543);
        expect(vec.angle()).toBeCloseTo(1.6);
        expect(asp.theta).toBeCloseTo(1.6);
    });

    test("add, sub", () => {
        let vec1 = new Vector2D(123, 456),
            vec2 = new Vector2D(0, 0),
            vec3 = new Vector2D(0, 0).fromPolar(123, 4.56);

        vec1.add(vec2);
        expect(vec1.x).toBeCloseTo(123);
        expect(vec1.y).toBeCloseTo(456);
        expect(vec2.x).toBeCloseTo(0);
        expect(vec2.y).toBeCloseTo(0);

        vec1.sub(vec2);
        expect(vec1.x).toBeCloseTo(123);
        expect(vec1.y).toBeCloseTo(456);
        expect(vec2.x).toBeCloseTo(0);
        expect(vec2.y).toBeCloseTo(0);

        let vec3c = vec3.clone(); // so that we can use this below as well
        vec3.add(vec1).add(vec3c).sub(vec3c); // vec3 now = vec1+vec3
        expect(vec1.x).toBeCloseTo(123);
        expect(vec1.y).toBeCloseTo(456);
        expect(vec2.x).toBeCloseTo(0);
        expect(vec2.y).toBeCloseTo(0);
        expect(vec3.x).toBeCloseTo(104.3286); // 123cos4.56 + 123
        expect(vec3.y).toBeCloseTo(334.4254); // 123sin4.56 + 456
    });

    test("dot", () => {
        let vec1 = new Vector2D(0, 0).fromPolar(12, 0.21),
            vec2 = new Vector2D(0, 0).fromPolar(2, 1.09);

        expect(vec1.dot(vec2)).toBeCloseTo(15.2916); // 24cos(0.88)
        expect(vec2.dot(vec1)).toBeCloseTo(15.2916);
    });

    test("equals", () => {
        let vec1 = new Vector2D(123, 456),
            vec2 = new Vector2D(456, 123),
            vec3 = new Vector2D(123, 456);

        expect(vec1.equals(vec1)).toBeTruthy();
        expect(vec1.equals(vec2)).toBeFalsy();
        expect(vec1.equals(vec3)).toBeTruthy();

        expect(vec2.equals(vec1)).toBeFalsy();
        expect(vec2.equals(vec2)).toBeTruthy();
        expect(vec2.equals(vec3)).toBeFalsy();

        expect(vec3.equals(vec1)).toBeTruthy();
        expect(vec3.equals(vec2)).toBeFalsy();
        expect(vec3.equals(vec3)).toBeTruthy();
    });

    test("clone", () => {
        let vec = new Vector2D(204588, -329),
            vec2 = vec.clone();
        expect(vec === vec2).toBeFalsy();
        expect(vec.equals(vec2)).toBeTruthy();
        expect(vec2.equals(vec)).toBeTruthy();
    });
});
