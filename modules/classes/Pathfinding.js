/*
 * Pathfinding.js: class for all pathfinding calculations
 */
class Pathfinding {
    /* Constructor - just take map info and starting player box */
    constructor(map, playerBox) {
        this.map = map;
        this.playerBox = playerBox;

        // Need to wrap object literal inside constructor to prevent JS from
        // interpreting it as a code block
        this.nodes = this.map.info.graph.map((rnode) => new Object({
            node: rnode, /* actual node with position and edges */
            distance: Infinity, /* temp variable used in searching */
            target: null /* target node, or null for player */
        }));

        // Determine closest node to player, initial Dijkstra run
        this.root = -1; /* index of closest node to player in line of sight */
        this.updatePlayerBox();
    }

    /* Updates pathfinding to reflect the player's new hitbox. */
    updatePlayerBox() {
        // Recalculate root
        const newroot = this.findClosestNode(this.playerBox);

        // New best root? Rerun Dijkstra if so
        if (newroot != this.root) {
            this.root = newroot;
            this.pathfind();
        }
    }

    /* Calculates where the character with the passed hitbox should travel
     * towards in order to reach the player, or -1 if they should not move.
     * Requires speed of character as well.
     * Also takes parameter id, a number used for randomness that is unique to
     * every character. Returns a Direction. */
    /* TODO improve to fix behavior around corners */
    travelDirection(hitbox, speed, id) {
        const hb_center = {
            x: hitbox.x + (hitbox.width >> 1),
            y: hitbox.y + (hitbox.height >> 1)
        };

        // Travel towards player if in beeline line of sight, else use graph
        let target = this.playerBox;
        if (!this.hasBeeline(hitbox, this.playerBox)) {
            const closest = this.nodes[this.findClosestNode(hitbox)],
                  cnode = closest.node, tn = closest.target;
            
            // Default to travel towards closest node
            target = cnode;

            // Ensure target node exists, travel if in LOS
            if (tn != null) {
                const tnode = tn.node;
                if (this.hasLOS(hb_center, tnode)) target = tnode;
            }
        }

        // Random LCG constants chosen by trial and error
        // 20% of all 16-frame periods -> be stupid brainless zombie
        // Only 5% chance if LOS to player exists
        // Random 8 frames L then 8 frames U, or 8 R and 8 D.
        const randseed = ((frameCount + id) >> 4) * id,
              thresh = (target == this.playerBox) ? 0x10000 : 0x40000;
        let randval = (0xbf387 * randseed + 0xdf) & 0xfffff;
        if (randval < thresh)
            return ((randval >> 5) + ((frameCount >> 2) & 2)) & 3;

        // Preferred directions - left/right and up/down
        let prefhorz = Direction.RIGHT, badhorz = Direction.LEFT,
            prefvert = Direction.DOWN, badvert = Direction.UP;
        if (target.x < hb_center.x) {
            prefhorz = Direction.LEFT;
            badhorz = Direction.RIGHT;
        }
        if (target.y < hb_center.y) {
            prefvert = Direction.UP;
            badvert = Direction.DOWN;
        }

        // Switch often between horizontal/vertical movement, prefer to
        // travel horizontal/vertical depending on which is more extreme
        // Decide on horizontal/vertical movement for next 16 frames
        const diffx = Math.abs(target.x - hb_center.x),
              diffy = Math.abs(target.y - hb_center.y),
              threshx = (diffx << 20) / (diffx + diffy); // -> * 0x100000
        randval = (0xbf387 * randval + 0xdf) & 0xfffff;
        const dohorz = (randval < threshx); // true -> move left/right first

        // List of all movement choices in order of preference
        let movechoices;
        if (dohorz) movechoices = [prefhorz, prefvert, badhorz, badvert];
        else movechoices = [prefvert, prefhorz, badvert, badhorz];

        // New hitboxes after each of those moves
        let newboxes = [];
        movechoices.forEach((dir) => {
            const movevec = new Vector2D(0, 0).fromPolar(speed, 
                    Direction.radians(dir));
            newboxes.push(new Box(hitbox.x+movevec.x, hitbox.y+movevec.y, 
                    hitbox.width, hitbox.height));
        });

        // Put choices that result in loss of beeline LOS to target at end
        for (let i=movechoices.length-1; i>=0; i--) {
            if (!this.hasBeeline(newboxes[i], target)) {
                movechoices.push(movechoices.splice(i, 1)[0]);
                newboxes.push(newboxes.splice(i, 1)[0]);
            }
        }

        // Move in the first direction listed in movechoices that the character
        // can actually move in (not against a wall in that direction)
        for (let i=0; i<movechoices.length; i++) {
            if (this.inBounds(newboxes[i])) return movechoices[i];
        }

        // Can't go in any direction -> trapped
        return -1;
    }

    /* Draws debugging information related to pathfinding. */
    debug_draw() {
        // Display edges of current node in brown
        stroke(0x80, 0x46, 0x1b);
        strokeWeight(2);
        const rtn = this.nodes[this.root].node, rx = rtn.x, ry = rtn.y;
        rtn.edges.forEach((neighidx) => {
            const nn = this.nodes[neighidx].node;
            line(rx, ry, nn.x, nn.y);
        });

        // Draw all nodes, root in pink, rest in blue
        // Draw line to target in green
        // Draw with diameter average of width and height / 128
        const node_d = (this.map.bgImage.width + this.map.bgImage.height) >> 8;
        this.nodes.forEach((node, nodeidx) => {
            let n = node.node, t = node.target; // node, target
            if (t == null) {
                // set as middle of player box
                t = {x: this.playerBox.x + (this.playerBox.width >> 1),
                     y: this.playerBox.y + (this.playerBox.height >> 1)};
            } else {
                // set as target node
                t = t.node;
            }
            const nx = n.x, ny = n.y, tx = t.x, ty = t.y;

            stroke(0x08, 0xf2, 0x6e);
            line(nx, ny, tx, ty);

            noStroke();
            if (nodeidx == this.root) fill(0xfe, 0x6b, 0xb7);
            else fill(0x45, 0xb6, 0xfe);   
            circle(nx, ny, node_d);
        });
    }

    /* Searches for and returns the closest node to the passed hitbox, with
     * the requirement that it must be in the hitbox's line of sight. */
    findClosestNode(hitbox) {
        // Scan all nodes to find closest in LOS
        let best_idx = 0, best_node = this.nodes[0];
        this.nodes.forEach((cur_node, cur_idx) => {
            cur_node.distance = this.dist2(cur_node.node, hitbox);
            if (cur_node.distance < best_node.distance) {
                // Closer - assign best if in LOS
                if (this.hasBeeline(cur_node, hitbox)) {
                    best_node = cur_node;
                    best_idx = cur_idx;
                }
            }
        });
        return best_idx;
    }

    /* Runs through graph with Dijkstra. Called when root node changes. */
    pathfind() {
        // Reset all distances to infinity
        this.nodes.forEach((node) => node.distance = Infinity);

        // Root distance to zero, target to player
        let rootnode = this.nodes[this.root];
        rootnode.distance = 0;
        rootnode.target = null;

        // Priority queue by distance property, all unvisited nodes
        let nodepq = new PriorityQueue(this.nodes, (node) => node.distance);

        // Loop until all explorable nodes explored
        while (nodepq.size() > 0) {
            // Get next closest node to explore
            let curnode = nodepq.next();

            // Visit all unvisited neighbors of next node
            curnode.node.edges.forEach((neighidx) => {
                let neigh = this.nodes[neighidx];

                // Update target and distance if shorter
                let newdist = curnode.distance
                        + this.dist2(curnode.node, neigh.node);
                if (newdist < neigh.distance) {
                    neigh.target = curnode;
                    neigh.distance = newdist;
                    nodepq.updatedPriority(neigh);
                }
            });
        }
    }

    /* true if Vector2D p1 has line of sight to Vector2D p2, false otherwise. */
    hasLOS(p1, p2) {
        return this.map.info.bounds.every((b) =>
            !(new Box(b.x, b.y, b.width, b.height)).intersectsSegment(p1, p2));
    }

    /* true if all four corners of Box box have line of sight to Vector2D dest,
     * false otherwise. */
    hasBeeline(box, dest) {
        let p1 = new Vector2D(box.x, box.y);
        if (!this.hasLOS(p1, dest)) return false;
        p1.x += box.width;
        if (!this.hasLOS(p1, dest)) return false;
        p1.y += box.height;
        if (!this.hasLOS(p1, dest)) return false;
        p1.x -= box.width;
        return this.hasLOS(p1, dest);
    }

    /* returns 2D distance between p1 and p2, squared */
    dist2(p1, p2) {
        const y2y1 = p2.y - p1.y,
              x2x1 = p2.x - p1.x;
        return (y2y1*y2y1)+(x2x1*x2x1);
    }

    /* true if Box hitbox is in map bounds, false otherwise */
    inBounds(hitbox) {
        return this.map.info.bounds.every((b) => !hitbox.intersects(b));
    }
}
