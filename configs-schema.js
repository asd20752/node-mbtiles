module.exports = {
  port: {
    description: 'Server port',
    default: 5000,
    commandLineArg: ['--port', '-p'],
    envVar: 'NODEMBTILE_PORT'
  },
  mode: {
    description: 'Mode selection configures how the server will server URLs. Refer to the README for more information',
    commandLineArg: ['--mode', '-m'],
    default: "pretty",
    envVar: 'NODEMBTILE_MODE'
  },
  databases: {
    description: 'MbTiles Databases. Comma-delimited like databaseAlias1;pathToMbTileFile,databaseAlias2;pathToSecondMbTileFile',
    commandLineArg: ['--databases', '-d'],
    envVar: 'NODEMBTILE_DATABASES'
  }
}
