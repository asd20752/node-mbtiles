# Node mbtiles server
## What is MBTiles
MBtiles is a file format based on the SQL lite database. It's purpouse is to provide rendered rasters to maps online. This files usally have the file ending of `*.mbt` or `*.mbtile`
https://wiki.openstreetmap.org/wiki/MBTiles

## About
This project is a simple MBtiles server based on the PHP server made by [bmcbride](https://github.com/bmcbride/PHP-MBTiles-Server).
## Dependencies
* [node.js](https://nodejs.org/en/)
* [sqlite3](https://www.npmjs.com/package/sqlite3)
* [source-configs](https://www.npmjs.com/package/source-configs)
* [morgan](https://www.npmjs.com/package/morgan)

## Setup

### General

The following items can be configured. Configuration is managed through the [source-configs](https://www.npmjs.com/package/source-configs) library.

* `Port`
  * Server Listening Port
  * Default: `5000`
  * Command line: `--port` or `p`
  * Environment variable: `NODEMBTILE_PORT`
* `Mode`
  * The server supports two modes
    * `argument`
      * URLs like `http://example.com?db=alias&z={z}&x={x}&y={y>}`
    * `pretty`
      * URLs like `http://example.com/alias/{z}/{x}/{y}`
  * Default: `pretty`
  * Command line: `--mode` or `-m`
  * Environment variable: `NODEMBTILE_MODE`
* `Databases`
  * Databases are unique mbtile data files `alias`s. Databases alias are available in the URL path:
    * `<http://example.com/ALIAS1/{z}/{x}/{y}>`
    * `<http://example.com/ALIAS2/{z}/{x}/{y}>`
  * This server can serve `n` of database aliases by defining the following object in config
    * ```
      databaseAlias1: {
        filePath: "fileName.mbtiles"
      }
      ```
  * Default: []
  * Command line: `--databases` or `-d`
  * Environment variable: `NODEMBTILE_DATABASES`
  * NOTE: A comma delimited list of semi-colon delimited database configurations is used for command line and environment variables
    * Example: databaseAlias1;filePath,databaseAlias2;filePath2

### Local Command Line

* `npm install`
* `node main.js`
  * Example with command line arguments `node main.js -d mbtiles;/some/path/to/file/tiles.mbtiles`

### Docker

* `docker build -t node-mbtiles .`
* `docker run -e NODEMBTILE_DATABASES=mbtiles;/home/node/tile.mbtile -v /some/path/to/file/tiles.mbtiles:/home/node/tile.mbtile --name node-mbtiles  node-mbtiles`

## Performance
Tested on the same computer against the PHP server by bmcbride it can provide about 240% more tiles a second, almost 2.5x. Also worth noting is that pretty mode is faster then argument mode, the exact speed depends on the system but in this system it is about 20% slower in argument mode.