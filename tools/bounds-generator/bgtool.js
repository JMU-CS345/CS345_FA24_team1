const fs = require("node:fs");

// Node script to generate JSON file describing map bounds, given the info
// in a image representation (PPM P6 only).
// Tries to find a near-minimal number of Box objects to use for the bounds, so
// it may take a little bit of time to run. TODO IS THIS TRUE???

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

    // Find red/blue pixels
    let cpos = 0;
    for (let y=0; y<pixels.height; y++) {
        for (let x=0; x<pixels.width; x++) {
            let pxr = pixels.r[cpos],
                pxg = pixels.g[cpos],
                pxb = pixels.b[cpos];
            cpos++;

            // Red check TODO

            // Blue check TODO
        }
    }
    // TODO error handling no find red or blue, or see non red/blue/white/blk?

    // Find optimal boxes
    // TODO

    // Write to file
    write_obj(inpath_outpath.outpath, obj);
    // TODO finish writing, test with map0-debug-bounds.png -> ppm -> json
    //      -> read json and check got all correct.
}

main();
