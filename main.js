const http = require('http');
const sqlite3 = require("sqlite3");
const url = require("url");

const morgan = require('morgan');
const logger = morgan('combined');

const sourceConfigs = require('source-configs');
const schema = require('./configs-schema');
const configs = sourceConfigs(schema);

try {
    configs.databases = parseDatabases(configs.databases);
} catch (err) {
    console.error(err);
    process.exit();
}

const databases = configs.databases;

const mode = configs.mode;
const port = configs.port;

let databaseAlias = Object.keys(databases);
databaseAlias.forEach(element => {
    databases[element].db = new sqlite3.Database(databases[element].filePath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.log("Failed to load: " + databases[element].filePath);
            throw err;
        }
    });
});

const requestListener = function (req, res) {
    logger(req, res, function(err) {
        if (err) {
            return done(err)
        }
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
                    res.writeHead(200, {
                        "Content-Type": "image/png"
                    });
                    res.end(row.tile_data);
                }
            });
        } else {
            res.writeHead(400);
            res.end();
        }
    })
}

const server = http.createServer(requestListener);
server.listen(port);
server.on("error", err => console.log(err));
console.log("Listening for connections on port: " + port);

function parseUrl(url) {
    return url.split("/");
}

function parseDatabases(databasesConfig) {
    if (!databasesConfig) {
        throw new Error("No databases defined");
    }
    let databases = {};

    databasesSplit = databasesConfig.split(',');

    databasesSplit.forEach(database => {
        const databaseSplit = database.split(';');
        if (databaseSplit.length != 2) {
            throw new Error("Unable to parse Database string. Possible use of wrong delimiter");
        }
        databases[databaseSplit[0]] = {
            filePath: databaseSplit[1]
        }
    })
    return databases;
}
