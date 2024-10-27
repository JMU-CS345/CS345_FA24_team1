const fs = require("node:fs");

// Node script to generate JSON file describing map bounds, given the info
// in a image representation (PPM P6 only).
// (get PPM with '$ convert <mapboundsfile> bounds.ppm')
// Tries to find a near-minimal number of Box objects to use for the bounds, so
// it may take a little bit of time to run for larger image files.

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

function main() {
    // Parse arguments
    let inpath_outpath = read_argv(); 

    // Open and read infile, load pixels
    let pixels = read_image_pixels(inpath_outpath.inpath);
    
    // Create JSON output object
    let obj = {
        playerSpawn: {x: -1, y: -1},
        enemySpawn: {x: -1, y: -1},
        bounds: []
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
                obj.enemySpawn.x = x;
                obj.enemySpawn.y = y;
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
    
    // Check found both
    if (obj.enemySpawn.x == -1)
        throw new Error("no enemySpawn pixel in image");
    if (obj.playerSpawn.x == -1)
        throw new Error("no playerSpawn pixel in image");

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

    // Write to file
    write_obj(inpath_outpath.outpath, obj);
}

main();
