/*
 * Pathfinding.js: class for all pathfinding calculations
 */
class Pathfinding {
    /* Constructor - just take map info and starting player box */
    constructor(map, playerBox) {
        this.map = map;

        this.nodes = this.map.graph.map((node) => {
            node: node, /* actual node with position and edges */
            distance: Infinity, /* distance to closest player node */
            target: -2 /* index of target node, -1 for player, -2 for undef */
        });

        // Determine closest node to player, initial Dijkstra run
        this.playerBox = null;
        this.root = -1; /* index of closest node to player in line of sight */
        this.updatePlayerBox(playerBox);
    }

    /* Updates pathfinding to reflect the player's new hitbox. */
    updatePlayerBox(newbox) {
        this.playerBox = newbox;

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
        // Draw all nodes, root in pink (TODO rest in grey?)
        // Draw path from every node to root
    }

    /* Searches for and returns the closest node to the player's current
     * position, with the requirement that it must be in the player's line of
     * sight. */
    findBestRoot() {
        // TODO implement by starting at root and travelling until find closest in BFS where none children closer, if -1 then run over all in norm loop
    }

    /* Runs through graph with Dijkstra. Called when root node changes. */
    pathfind() {
        // TODO
    }

    /* true if Vector2D p1 has line of sight to Vector2D p2, false otherwise. */
    hasLOS(p1, p2) {
        // TODO copypaste from bgtool
    }

    // scale not here, just scale map info in Arena TODO
}
