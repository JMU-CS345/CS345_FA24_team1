/*
 * Pathfinding.js: class for all pathfinding calculations
 */
class Pathfinding {
    /* Constructor - just take map info and starting player box */
    constructor(map, playerBox) {
        this.map = map;

        // Need to wrap object literal inside constructor to prevent JS from
        // interpreting it as a code block
        this.nodes = this.map.info.graph.map((rnode) => new Object({
            node: rnode, /* actual node with position and edges */
            distance: Infinity, /* temp variable used in searching */
            target: -2 /* index of target node, -1 for player, -2 for undef */
        }));

        // Determine closest node to player, initial Dijkstra run
        this.playerBox = null;
        this.root = -1; /* index of closest node to player in line of sight */
        this.updatePlayerBox(playerBox);
    }

    /* Updates pathfinding to reflect the player's new hitbox. */
    updatePlayerBox() {
        // Recalculate root
        const newroot = this.findBestRoot();

        // New best root? Rerun Dijkstra if so
        if (newroot != this.root) {
            this.root = newroot;
            this.pathfind();
        }
    }

    /* Calculates where the character with the passed hitbox should travel
     * towards in order to reach the player, or -1 if they should not move. 
     * Returns angle in radians. */
    travelAngle(hitbox) {
        // TODO
        // TODO also every once in a while travel in random direction for 0.5s
        // in order to get away from walls blocking travel and add dumb-ness
        return -1;
    }

    /* Draws debugging information related to pathfinding. */
    debug_draw() {
        // Draw all nodes, root in pink, rest in blue
        // Draw with diameter average of width and height / 128
        const node_d = (this.map.bgImage.width + this.map.bgImage.height) >> 8;
        this.nodes.forEach((node, nodeidx) => {
            noStroke();
            if (nodeidx == this.root) fill(0xfe, 0x6b, 0xb7);
            else fill(0x45, 0xb6, 0xfe);
            
            circle(node.node.x, node.node.y, node_d);
        });

        // Draw path from every node to root
        // TODO
    }

    /* Searches for and returns the closest node to the player's current
     * position, with the requirement that it must be in the player's line of
     * sight. */
    findBestRoot() {
        // Initial run - scan all nodes to find closest
        if (this.root == -1) {
            // TODO
        }

        // Expand outwards to find closest node
        let next_idx = this.root, nxtn = this.nodes[next_idx], cur_idx, curn;
        nxtn.distance = dist2(nxtn.node, this.playerBox);
        do {
            // Set new current
            cur_idx = next_idx;

            curn = this.nodes[cur_idx];
            nxtn = this.nodes[next_idx];
            
            // Find closest neighbor node in line of sight to player
            curn.node.edges.forEach((neigh, neighidx) => {
                neigh.distance = dist2(neigh.node, this.playerBox);
                if (neigh.distance < nxtn.distance) {
                    // Closer - check has LOS and set as new next if so
                    if (hasLOS(neigh.node, this.playerBox)) {
                        next_idx = neighidx;
                        nxtn = neigh;
                    }
                }
            });
        } while (nxtn.distance < curn.distance);

        return cur_idx;
    }

    /* Runs through graph with Dijkstra. Called when root node changes. */
    pathfind() {
        // TODO
    }

    /* true if Vector2D p1 has line of sight to Vector2D p2, false otherwise. */
    hasLOS(p1, p2) {
        // TODO copypaste from bgtool
        // TODO or no just add Box.intersects(line)?
        return true;
    }

    /* returns 2D distance between p1 and p2, squared */
    dist2(p1, p2) {
        const y2y1 = p2.y - p1.y,
              x2x1 = p2.x - p1.x;
        return (y2y1*y2y1)+(x2x1*x2x1);
    }
}
