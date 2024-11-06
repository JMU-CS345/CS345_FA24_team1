/*
 * Direction.js: global enum object describing game directions.
 */
const Direction = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,

    /* Returns the angle of a Direction in degrees. */
    degrees: function(direction) {
        const degs = [180, 0, 270, 90];
        return degs[direction];
    },

    /* Returns the angle of a Direction in radians. */
    radians: function(direction) {
        const rads = [PI, 0.0, PI+HALF_PI, HALF_PI];
        return rads[direction];
    },

    /* Returns a Direction of the most important change in direction between
     * Vector2Ds start to end. Horizontal takes priority over vertical. */
    primaryDirectionChange: function(start, end) {
        // Any horizontal change - return left/right
        const xmove = end.x - start.x;
        if (xmove != 0) return (xmove > 0) ? Direction.RIGHT : Direction.LEFT;

        // Purely vertical - return up/down
        return (end.y > start.y) ? Direction.DOWN : Direction.UP;
    }
};
