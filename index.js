const getPort = require('get-server-port')
const match = require('pathname-match')
const mapLimit = require('map-limit')
const mkdirp = require('mkdirp')
const assert = require('assert')
const noop = require('noop2')
const http = require('http')
const nets = require('nets')
const path = require('path')
const pump = require('pump')
const fs = require('fs')

module.exports = toFs

// Save all wayfarer-to-server routes to disk
// (fn, str, obj?, fn?) -> null
function toFs (router, dirname, maps, cb) {
  if (!cb) {
    cb = maps
    maps = {}
  }

  dirname = dirname || './'
  maps = maps || {}
  cb = cb || noop

  assert.equal(typeof router, 'function')
  assert.equal(typeof dirname, 'string')
  assert.equal(typeof maps, 'object')
  assert.equal(typeof cb, 'function')

  maps = normalizeMap(maps)

  // create a server and mount the router
  const server = http.createServer(function (req, res) {
    router(match(req.url), req, res)
  })

  server.listen(function () {
    const port = getPort(server)
    const arr = Object.keys(router._routes.child)

    // call each path in the server
    // and write files to disk
    mapLimit(arr, Infinity, iterator, function (err, res) {
      if (err) {
        server.close()
        return cb(err)
      }
      server.close()
      cb(null, res)
    })

    // stream files from http to disk
    function iterator (route, done) {
      if (maps[route]) route = maps[route]
      const out = path.join(dirname, route)

      mkdirp(path.dirname(out), function (err) {
        if (err) return done(err)

        const rs = nets('http://localhost:' + port + '/' + route)
        const ws = fs.createWriteStream(out)

        pump(rs, ws, function (err) {
          if (err) return done(err)
          done()
        })
      })
    }
  })
}

// normalize the route mappings
// to be compatible with wayfarer
// internals. Removes all leading `/`
// obj -> obj
function normalizeMap (maps) {
  return Object.keys(maps).reduce(function (obj, key) {
    const val = replace(maps[key])
    const nwKey = replace(key)
    obj[nwKey] = val
    return obj
  }, {})

  function replace (str) {
    return str.replace(/^\//, '')
  }
}
