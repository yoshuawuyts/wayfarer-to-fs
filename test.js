const toServer = require('wayfarer-to-server')
const wayfarer = require('wayfarer')
const rimraf = require('rimraf')
const test = require('tape')
const fs = require('fs')

const toFs = require('./')

test('should assert input types', function (t) {
  t.plan(1)
  // todo(yw): verify all input combinations
  t.throws(toFs)
})

test('should output routes to files', function (t) {
  t.plan(5)

  const router = toServer(wayfarer())
  router.on('/index.css', {
    get: function (req, res) {
      res.end('hello world')
    }
  })

  const dirname = __dirname + '/tmp'
  toFs(router, dirname, function (err) {
    t.error(err)

    fs.readdir(dirname, function (err, files) {
      t.error(err)
      t.notEqual(files.indexOf('index.css'), -1)

      rimraf(dirname, function (err) {
        t.error(err)
        t.pass('called')
      })
    })
  })
})

test('should allow path overrides', function (t) {
  t.plan(5)

  const router = toServer(wayfarer())
  router.on('/', {
    get: function (req, res) {
      res.end('hello world')
    }
  })

  const dirname = __dirname + '/tmp'
  const maps = { '/': '/index.html' }
  toFs(router, dirname, maps, function (err) {
    t.error(err)

    fs.readdir(dirname, function (err, files) {
      t.error(err)
      t.notEqual(files.indexOf('index.html'), -1)

      rimraf(dirname, function (err) {
        t.error(err)
        t.pass('called')
      })
    })
  })
})
