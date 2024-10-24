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
 * for each color component for each pixel. */
function read_image_pixels(filepath) {
    let databuf = fs.readFileSync(filepath);

    // Verify PPM format with magic "P6"
    // TODO

    // Header info
    // TODO
    
    // Read into object and return
    // TODO
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
    let obj = {};

    // Find red/blue pixels and load in rest to bool 2D array
    // TODO error handling no find red or blue, or see non red/blue/white/blk?

    // Find optimal boxes
    // TODO

    // Write to file
    write_obj(inpath_outpath.outpath, obj);
    // TODO finish writing, test with map0-debug-bounds.png -> ppm -> json
    //      -> read json and check got all correct.
}

main();
