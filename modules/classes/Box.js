/*
 * A Box describes a two-dimensional grid-aligned rectangle.
 */
class Box {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

// Export if running in node (for testing)
if ((typeof exports) !== "undefined") exports.Box = Box;
