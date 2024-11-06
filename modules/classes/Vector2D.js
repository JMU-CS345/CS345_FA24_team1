/*
 * Vector2D: two-dimensional vector implementation
 * Contains various methods for working with and modifying vectors.
 * All methods that modify the vector also return the same vector, for chained
 * usage of the class methods.
 *      e.g. let j = new Vector2D(10, 20).add(new Vector2D(20, 10));
 */
class Vector2D {
    constructor(x, y) {
        this.fromCartesian(x, y);
    }

    /* Initialize vector from Cartesian (x,y) */
    fromCartesian(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /* Initialize vector from Polar (r, theta). Theta in radians. */
    fromPolar(r, theta) {
        this.x = r * Math.cos(theta);
        this.y = r * Math.sin(theta);
        return this;
    }

    /* Initialize vector from another Vector2D */
    /* TODO add tests for Vector2D.fromOther() */
    fromOther(other) {
        this.x = other.x;
        this.y = other.y;
        return this;
    }

    /* Returns magnitude of vector (r in polar coordinates). */
    magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    /* Returns angle of vector (theta in polar coordinates) */
    angle() {
        return Math.atan2(this.y, this.x);
    }

    /* Returns a new vector with r and theta components (polar notation). */
    asPolar() {
        return {r: this.magnitude(), theta: this.angle()};
    }

    /* Adds another vector to this vector. */
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    /* Subtracts another vector from this vector. */
    sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    /* Returns dot product of this vector and another vector. */
    dot(other) {
        // https://www.mathsisfun.com/algebra/vectors-dot-product.html
        // magnitude(a) * magnitude(b) * cos(angle a to b)
        let ma = this.magnitude(),
            mb = other.magnitude(),
            ang = Math.cos(this.angle() - other.angle());
        return ma * mb * ang;
    }

    /* True if this vector equals other (x==x and y==y), false otherwise. */
    equals(other) {
        return (this.x == other.x) && (this.y == other.y);
    }

    /* Returns a copy of this Vector2D (a new object). */
    clone() {
        return new Vector2D(this.x, this.y);
    }

    /**
     * Returns the Euclidean distance of this vector and another vector.
     * @param {Vector2D} otherVector 
     */
    getDistance(otherVector) {
        const dx = this.x - otherVector.x;
        const dy = this.y - otherVector.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    }

}


// Export if running in node (for testing)
if ((typeof exports) !== "undefined") exports.Vector2D = Vector2D;
