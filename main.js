const http = require('http');
const sqlite3 = require("sqlite3");

//Set mode of URLS
//Pretty - http://example.com/alias/{z}/{x}/{y}
const mode = "pretty";
//Argument - http://example.com?db=alias&z={z}&x={x}&y={y}
// const mode = "argument";
let url;
let port = 5000;
const databases = {
    ski: {
        filePath: "ski.mbt"
    }

};
process.argv.forEach(function (val, index, array) {
    if (val == "-p")
        port = process.argv[index + 1];
});
if (mode == "argument") {
    url = require("url");
}

let databaseAlias = Object.keys(databases);
databaseAlias.forEach(element => {
    databases[element].db = new sqlite3.Database(databases[element].filePath, sqlite3.OPEN_READONLY, (err) => {
        if (err){
            console.log("Failed to load: " + databases[element].filePath);
        throw err;}
    });
});


const requestListener = function (req, res) {
    let dbAlias;
    let z;
    let x;
    let y;
    //Argument mode - Slower, but compatible with non pretty PHP urls
    if (mode == "argument") {
        const queryObject = url.parse(req.url, true).query;
            z = (queryObject.z ? parseInt(queryObject.z) : undefined);
            x = (queryObject.x ? parseInt(queryObject.x) : undefined);
            y = (queryObject.y ? parseInt(queryObject.y) : undefined);
            dbAlias = (queryObject.db ? queryObject.db.split(".")[0] : undefined);
    }
    //End argument mode

    //Pretty mode - Faster and better to use if it is a new initiation. 
    else if (mode == "pretty") {
        args = parseUrl(req.url);
        dbAlias = args[1];
        z = (args[2] ? parseInt(args[2]) : undefined);
        x = (args[3] ? parseInt(args[3]) : undefined);
        y = (args[4] ? parseInt(args[4]) : undefined);
    }
    //End prettymode

    if (databaseAlias.includes(dbAlias) && typeof z == "number" && typeof x == "number" && typeof y == "number") {

        databases[dbAlias].db.get(`SELECT * FROM tiles WHERE zoom_level = ${z} AND tile_column = ${x} AND tile_row = ${y}`, (err, row) => {
            if (err || row == undefined) {
                res.writeHead(404);
                res.end();
            } else {
                res.writeHead(200);
                res.end(row.tile_data, {
                    "Content-Type": "image/png"
                });
            }
        });
    } else {
        res.writeHead(400);
        res.end()
    }
}

const server = http.createServer(requestListener);
server.listen(port);
console.log("Listening for connections on port: " + port);
function parseUrl(url) {
    return url.split("/");
}