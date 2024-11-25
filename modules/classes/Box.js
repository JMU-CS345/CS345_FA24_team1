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

    /* true if this Box intersects the line segment from point start to point
     * end, false otherwise */
    /* TODO write tests for intersectsSegment() */
    intersectsSegment(start, end) {
        const xmin = this.x, xmax = this.x + this.width,
              ymin = this.y, ymax = this.y + this.height,
              xseglen = end.x - start.x, yseglen = end.y - start.y;

        // https://michvalwin.com/posts/2023/04/26/ray-collisions.html
        // Time on line entering Box xmin, xmax, ymin, ymax
        const txmin = (xmin - start.x) / xseglen,
              txmax = (xmax - start.x) / xseglen,
              tymin = (ymin - start.y) / yseglen,
              tymax = (ymax - start.y) / yseglen;

        // Time entering and leaving x, entering and leaving y ranges
        const txnear = Math.min(txmin, txmax),
              txfar  = Math.max(txmin, txmax),
              tynear = Math.min(tymin, tymax),
              tyfar  = Math.max(tymin, tymax);
        
        // Time at which near sides have been entired
        // Time at which far sides have been left
        const tnear = Math.max(txnear, tynear),
              tfar = Math.min(txfar, tyfar);

        // Intersects if 0 <= near <= far <= 1
        return (0 <= tnear) && (tnear <= tfar) && (tfar <= 1) ;
    }

    /* Extends this Box in the direction of the passed Vector2D vector. */
    /* TODO write tests for extend() */
    extend(vector) {
        // Add absolute value of x,y to box width,height
        this.width += Math.abs(vector.x);
        this.height += Math.abs(vector.y);

        // Shift box x,y backwards if vector x,y negative
        // No shift if vector x,y >= zero
        this.x += Math.min(vector.x, 0);
        this.y += Math.min(vector.y, 0);
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
