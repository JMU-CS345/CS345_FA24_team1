/*
 * Direction.js: global enum object describing game directions.
 */
const Direction = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,

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
