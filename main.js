const http = require('http');
const sqlite3 = require("sqlite3");
const url = require("url");
const databases = {
    ski: {
        alias: "ski",
        filePath: "ski.mbt"
    }
};
let databaseAlias = Object.keys(databases);
databaseAlias.forEach(element => {
    databases[element].db = new sqlite3.Database(databases[element].filePath, sqlite3.OPEN_READONLY, (err) => {});
});


const requestListener = function (req, res) {

    //Argument mode - Uncoment rows below for argument mode and comment pretty mode
    // const queryObject = url.parse(req.url, true).query;
    // let z = parseInt(queryObject.z);
    // let x = parseInt(queryObject.x);
    // let y = parseInt(queryObject.y);
    // let dbAlias = queryObject.db.split(".")[0];
    //End argument mode

    //Pretty mode - Uncoment rows below for prettymode and coment above
    args = parseUrl(req.url);
    let dbAlias = args[1];
    let z = parseInt(args[2]);
    let x = parseInt(args[3]);
    let y = parseInt(args[4]);
    //End prettymode

    if (databaseAlias.includes(dbAlias) && typeof z == "number" && typeof x == "number" && typeof y == "number") {
        
        databases[dbAlias].db.get(`SELECT * FROM tiles WHERE zoom_level = ${z} AND tile_column = ${x} AND tile_row = ${y}`, (err, row) => {
            if (err || row == undefined) {
                res.writeHead(404);
                res.end();
            } else {
                res.writeHead(200);
                res.end(row.tile_data);
            }
        });
    }
    else {
        res.writeHead(400);
        res.end()
    }
}

const server = http.createServer(requestListener);
server.listen(8080);

function parseUrl(url) {
    return url.split("/");
}