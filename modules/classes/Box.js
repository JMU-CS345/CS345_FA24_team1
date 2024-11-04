/*
 * A Box describes a two-dimensional grid-aligned rectangle.
 */
class Box {
    constructor(x, y, width, height) {
        // Check width and height non-negative
        if ((width<0) || (height<0) || !isFinite(width) || !isFinite(height))
            throw new RangeError(
                    "width and height must be non-negative finite numbers");

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /* true if this Box overlaps with Box other, false otherwise */
    intersects(other) {
        let tx1 = this.x, ty1 = this.y,
            tx2 = this.x + this.width, ty2 = this.y + this.height,
            ox1 = other.x, oy1 = other.y,
            ox2 = other.x + other.width, oy2 = other.y + other.height;

        // https://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
        // No intersection if this Box is completely above, below, left, or
        // right of the other Box. Intesection if none of those are true.
        return !((ty2 < oy1) || (ty1 > oy2) || (tx2 < ox1) || (tx1 > ox2));
    }

    /* true if this Box has identical values as other, false otherwise */
    equals(other) {
        return (this.x == other.x) && (this.y == other.y)
            && (this.width == other.width) && (this.height == other.height);
    }

    /* Creates a deep copy of this Box. */
    clone() {
        return new Box(this.x, this.y, this.width, this.height);
    }
}

// Export if running in node (for testing)
if ((typeof exports) !== "undefined") exports.Box = Box;
