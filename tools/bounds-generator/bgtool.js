const fs = require("node:fs");

// Node script to generate JSON file describing map bounds, given the info
// in a image representation (PPM P6 only).
// (get PPM with '$ convert <mapboundsfile> bounds.ppm')
// Tries to find a near-minimal number of Box objects to use for the bounds, so
// it may take a little bit of time to run for larger image files.
// Also takes a while to generate the pathfinding graph.

// Read argv and return input image file path and output JSON file path.
// Expect "$ node bgtool.js <infile> [outfile]"
function read_argv() {
    if (process.argv.length < 3) { // Not enough args
        console.error("Invalid arguments (expected \"node bgtool.js <infile> [outfile]\"");
        process.exit(1);
    }
    let inpath = process.argv[2];

    // Default output path is same file as input, with image extension changed
    // to .json instead.
    // https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript
    let outpath = inpath.replace(/\.[^/.]+$/, "") + ".json";
    if (process.argv.length > 3)
        outpath = process.argv[3];

    return {inpath: inpath, outpath: outpath};
}

/* Takes path to PPM file, returns object containing three arrays (r/g/b), one
 * for each color component for each pixel. Also has width and height fields. */
function read_image_pixels(filepath) {
    const databuf = fs.readFileSync(filepath);
    const dlen = databuf.length;

    // Header info - read in start as a String[] and then go through
    const strarr = databuf.toString('utf8', 0, Math.min(dlen, 64)).split("\n");

    // Should have 3 newlines in header -> 4 sections
    // Read magic "P6"
    if ((strarr.length < 4) || (strarr[0] != "P6"))
        throw new Error("provided file is not in proper PPM P6 format");

    // Width, height
    const line2 = strarr[1].split(" "),
          width = Number(line2[0]),
          height = Number(line2[1]);

    // Max pixel value (may be 0-65535 - require 255)
    const maxpixval = Number(strarr[2]);
    if (maxpixval != 255)
        throw new Error("unsupported maximum pixel value " + maxpixval);

    // Read pixel data
    const pixobj = {width: width, height: height, r: [], g: [], b: []};
    
    // P6\n<w, h>\n<mpv>\n<pixels>
    let pos = 5 + strarr[1].length + strarr[2].length;
    for (let i=0; i<(width*height); i++) {
        pixobj.r.push(databuf[pos++]);
        pixobj.g.push(databuf[pos++]);
        pixobj.b.push(databuf[pos++]);
    }

    return pixobj;
}

/* Writes JS object obj to file at filepath as serialized JSON. */
function write_obj(filepath, obj) {
    fs.writeFileSync(filepath, JSON.stringify(obj), {flush: true});
}

/* True if p1 has a line of sight to p2 (no black pixels in way according to
 * pixwall+width+height), false otherwise. */
function hasLOS(pixwall, width, height, p1, p2) {
    // Flip p1 and p2 if p2.x is before p1.x
    if (p2.x < p1.x) {
        let tmp = p1;
        p1 = p2;
        p2 = tmp;
    }

    // Decrease to increase line precision, greatly increases execution time
    const precision = 0.25;
    // Calculate slope (y2-y1)/(x2-x1), multiplied by precision
    const mp = (p2.y-p1.y)/(p2.x-p1.x) * precision;

    // Move from x1 to x2 slowly, and increase y by mp each time
    // Add 0.5 to all xs/ys so that truncation rounds properly
    let y = p1.y + 0.5;
    for (let x=(p1.x+0.5); x<=(p2.x+0.5); x += precision) {
        // Get rounded y for real pixel value (| 0 truncates to int)
        // No LOS if wall at (x, y)
        if (pixwall[((y | 0) * width + x) | 0]) return false;

        y += mp;
    }

    // No walls encountered
    return true;
}

/* Grabs and returns the next graph node using scanned, or null if no more
 * exist. */
function grab_next_node(scanned, width, height) {
    const pidx = scanned.indexOf(false);
    if (pidx == -1) return null;
    return {x: (pidx % width), y: (pidx / width) | 0}; // floor divide
}

/* Performs 1 PRNG round. Uses Java's LCG numbers. */
const roundmul = 0x5DEECE66D;
const roundinc = 11;
const roundmsk = (1 << 48) - 1;
function round(seed) {
    return ((roundmul * seed) + roundinc) & roundmsk;
}

/* Distance from point p1 to point p2. 2D distance formula. */
function dist(p1, p2) {
    const y2y1 = p2.y-p1.y,
          x2x1 = p2.x-p1.x;
    return Math.sqrt((y2y1*y2y1)+(x2x1*x2x1));
}

function main() {
    // Parse arguments
    let inpath_outpath = read_argv(); 

    // Open and read infile, load pixels
    let pixels = read_image_pixels(inpath_outpath.inpath);
    
    // Create JSON output object
    let obj = {
        playerSpawn: {x: -1, y: -1},
        enemySpawn: [],
        bounds: [],
        graph: []
    };

    // Find red/blue pixels and create black/nonblack array
    let cpos = 0;
    let pixblk = [];
    for (let y=0; y<pixels.height; y++) {
        for (let x=0; x<pixels.width; x++) {
            let pxr = pixels.r[cpos],
                pxg = pixels.g[cpos],
                pxb = pixels.b[cpos];
            cpos++;

            // Add to pixblk
            let sum = pxr+pxg+pxb;
            pixblk.push((sum==0) ? true : false);

            // Red check
            if ((pxr == 255) && (pxg == 0) && (pxb == 0)) {
                obj.enemySpawn.push({x: x, y: y});
                continue;
            }

            // Blue check
            if ((pxr == 0) && (pxg == 0) && (pxb == 255)) {
                obj.playerSpawn.x = x;
                obj.playerSpawn.y = y;
                continue;
            }
            
            // Not red or blue or white or black -> error
            if ((sum != 0) && (sum != 765))
                throw new Error("invalid pixels in image");
        }
    }
    
    // Check found both player and enemy spawns (with at least 1 enemySpawn)
    if (obj.enemySpawn.length == 0)
        throw new Error("no enemySpawn pixels in image");
    if (obj.playerSpawn.x == -1)
        throw new Error("no playerSpawn pixel in image");
    
    // Copies of pixblk for use later
    let pixwall = Array.from(pixblk);
    let scanned = Array.from(pixblk);

    // Find boxes using pixblk
    // Scan line by line looking for next black pixel
    for (let i=0; i<pixblk.length; i++) {
        if (pixblk[i]) {
            // Black pixel - find largest area black rectangle that can be made
            // with the top left corner as this pixel, then add box to obj and
            // set all pixels in box to white in pixblk.
            // Expand outwards in square, then +x, then +y.
            let startx = i % pixels.width, // top left x
                starty = Math.floor(i / pixels.width), // top left y
                boxwidth = 1, // box width
                boxheight = 1, // box height
                mode = 0; // 0=square expand, 1=+x, 2=+y

            for (;;) {
                // New potential size
                let nextboxwidth = boxwidth,
                    nextboxheight = boxheight;
                if ((mode == 0) || (mode == 1)) nextboxwidth++;
                if ((mode == 0) || (mode == 2)) nextboxheight++;

                // Enumerate new pixels to check
                let newpixelsidxs = []; 
                if ((mode == 0) || (mode == 1)) {
                    // mode 0/1 -> add +x column to check
                    let colx = startx + boxwidth;
                    for (let y=starty; y<(starty+nextboxheight); y++)
                        newpixelsidxs.push(y*pixels.width + colx);
                }
                if ((mode == 0) || (mode == 2)) {
                    // mode 0/2 -> add +y row to check
                    let rowy = starty + boxheight;
                    for (let x=startx; x<(startx+nextboxwidth); x++)
                        newpixelsidxs.push(rowy*pixels.width + x);
                }
                // mode 0 gets bottom corner double counted but it doesn't
                // make a difference anyway
                
                // Not black -> increase mode and continue; quit if mode==2
                if (!newpixelsidxs.every((idx) => pixblk[idx])) {
                    if (mode == 2)
                        break;

                    mode++;
                    continue;
                }
                
                // All black, so mark those pixels as not black now, set new
                // box width and height, and continue looping.
                newpixelsidxs.forEach((idx) => pixblk[idx] = false);
                boxwidth = nextboxwidth;
                boxheight = nextboxheight;
            }

            // Add box to obj
            let box = {
                x: startx, y: starty, 
                width: boxwidth, height: boxheight
            };
            obj.bounds.push(box);
            //console.log(box)
        }
    }

    // Generate pathfinding graph (from pixblk) for all white pixels
    // scanned is true for pixel at [y*width+x] accessible with graph, false
    // if not. Start by adding nodes until entire map covered.
    for (;;) {
        // Pick next pixel to use as a node
        let node = grab_next_node(scanned, pixels.width, pixels.height);
        if (node === null) break;
        
        // Mark all in pixrow visible from node as scanned
        let pidx = 0;
        for (let y=0; y<pixels.height; y++) {
            for (let x=0; x<pixels.width; x++) {
                if (!scanned[pidx] && hasLOS(pixwall, pixels.width, 
                        pixels.height, node, {x: x, y: y}))
                    scanned[pidx] = true;
                pidx++;
            }
        }

        // Create list of edges - guaranteed zero at this point
        node.edges = []

        // Add to obj.graph
        obj.graph.push(node);
    }

    // Now we have nodes covering entire graph, but not overlapping. Generate
    // nodes with PRNG until entire graph connected.
    // Technically not guaranteed to create a fully connected graph, but very
    // likely to do so.
    // Constant seed for consistent graph creation
    let seed = round(round(302918282226874)); // Can change for different graph
    do {
        // Generate random coord in range ([0, width), [0, height))
        const newx = seed % pixels.width;
        seed = round(seed);
        const newy = seed % pixels.height;
        seed = round(seed);

        // Ensure not a wall pixel
        if (pixwall[newy*pixels.width+newx]) continue;

        let node = {x: newx, y: newy, edges: []};

        // Ensure not already in graph or really close to another node
        const TOO_CLOSE = 20;
        if (obj.graph.some((other) => dist(node, other) < TOO_CLOSE))
            continue;

        // Calculate edges
        obj.graph.forEach((other, otheridx) => {
            if (hasLOS(pixwall, pixels.width, pixels.height, node, other)) {
                node.edges.push(otheridx);
                other.edges.push(obj.graph.length);
            }
        });
        
        // Add to obj.graph
        obj.graph.push(node);
        //console.log("Added (" + newx + ", " + newy + "), now " + obj.graph.length);
    } while (obj.graph.some((node) => node.edges.length < 3));

    // Remove unnecessary edges; nodes with >MAX_EDGES edges get all of their
    // furthest edges removed, if those other nodes also have >MAX_EDGES edges.
    const MAX_EDGES = 5;
    obj.graph.forEach((node, nodeidx) => {
        // Sort edges by length, increasing
        let edges = node.edges;
        let dists = {};
        node.edges.forEach((edge) => dists[edge] = dist(node, obj.graph[edge]));
        edges.sort((e1, e2) => dists[e1] - dists[e2]);

        // Go through all edges backwards
        for (let i=(edges.length-1); i>=0; i--) {
            // Quit if below MAX_EDGES limit
            if (edges.length <= MAX_EDGES) break;

            // Remove edge if other node has >MAX_EDGES edges too
            let otheredges = obj.graph[node.edges[i]].edges;
            if (otheredges.length > MAX_EDGES) {
                node.edges.splice(i, 1);
                otheredges.splice(otheredges.indexOf(nodeidx), 1);
            }
        }
    });
    
    // Potential optimzation: prune unnecessary nodes until you get down to
    // e.g. 0.5% of walkable pixels are nodes, then stop there.
    // Another optimization: instead of current method of edge pruning; do
    // dijkstra to calculate shortest path from every node to every other node.
    // Delete all edges that are not in at least 1 shortest path.
    // Or just optimize by only adding until graph is fully connected
    // TODO ensure all works for map0-debug as well.

    // Write to file
    write_obj(inpath_outpath.outpath, obj);
}

main();
