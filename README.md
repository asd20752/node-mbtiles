# Node mbtiles server
## What is MBTiles
MBtiles is a file format based on the SQL lite database. It's purpouse is to provide rendered rasters to maps online. This files usally have the file ending of `*.mbt` or `*.mbtile`
https://wiki.openstreetmap.org/wiki/MBTiles

## About
This project is a simple MBtiles server based on the PHP server made by [bmcbride](https://github.com/bmcbride/PHP-MBTiles-Server). 
## Dependencies
* [node.js](https://nodejs.org/en/)
* [sqlite3](https://www.npmjs.com/package/sqlite3)

SQL lite can be installed with `npm install`
## Setup 
To setup this server there are a few values one can change. \
`port` Will spesify what port you want node to listen for HTTP trafic. \
`databases` Is the most important, here you will have to add the mbtiles databases you have avalible. This takes a javascript object with the key beeing what you want referenced in the url as the alias. ``` ski: {
        filePath: "ski.mbt"
    }``` multiple databases can be added. Here are `ski` the alias and `ski.mbt` the tile database. \
`mode` here you can set what URL format you want to use, pretty or argument. 

## Using
This server suports two modes, pretty and argument. This is for simple change of server if the PHP server has previously been implemented. The server is designed in such a way that even with the link pointing to a php file it will serve the files. \
Pretty mode: http://example.com/alias/{z}/{x}/{y} \
Arument mode: http://example.com?db=alias&z={z}&x={x}&y={y} \
To use HTTPS you will have to ether addapt the program or use a Nginx reverse proxy. 
## Performance
Tested on the same computer against the PHP server by bmcbride it can provide about 240% more tiles a second, almost 2.5x. Also worth noting is that pretty mode is faster then argument mode, the exact speed depends on the system but in this system it is about 20% slower in argument mode. 