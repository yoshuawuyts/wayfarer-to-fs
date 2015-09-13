# wayfarer-to-fs
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![Downloads][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

Save wayfarer-to-server routes to disk. Spiritual successor to
[brick-router](https://github.com/yoshuawuyts/brick-router).

## Installation
```sh
$ npm install wayfarer-to-fs
```

## Usage
```js
const toServer = require('wayfarer-to-server')
const toFs = require('wayfarer-to-fs')
const wayfarer = require('wayfarer')
const filed = require('filed')

const router = toServer(wayfarer())
router.on('/', {
  get: (req, res) => filed(__dirname + '/index.html').pipe(res))
})

toFs(router, __dirname + '/dist', (err) => {
  if (err) throw err
})
```

## API
### toFs(router, [dir,] [overrides,] [cb(err)])
Call all paths on a `wayfarer-to-server` router and write them to a directory.
`dir` defaults to `./`. An optional `overrides` argument can be passed in to
rename files:
```js
// Write the `/` path as `dist/index.html`
const overrides = { '/': '/index.html' }
toFs(router, __dirname + '/dist', overrides, (err) => {
  if (err) throw err
})
```

## Why?
In development an application usually goes through 3 stages:
- __experiment__ - some html, css, js to toy around locally
- __static__ - static files, usually hosted on GitHub pages
- __server__ - application with a working backend

When switching stages it's common to throw out your build process, and start
from scratch. `wayfarer-to-fs` allows you to keep the same build process by
serving files both in-memory (for experimentation and servers) and being able
to write to the filesystem (for static pages).

## TODO
- browserify example
- html composition example
- bump coverage to 100%

## See Also
- [wayfarer](https://github.com/wayfarer)
- [wayfarer-to-server](https://github.com/wayfarer-to-server)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[npm-image]: https://img.shields.io/npm/v/wayfarer-to-fs.svg?style=flat-square
[npm-url]: https://npmjs.org/package/wayfarer-to-fs
[travis-image]: https://img.shields.io/travis/yoshuawuyts/wayfarer-to-fs/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/yoshuawuyts/wayfarer-to-fs
[codecov-image]: https://img.shields.io/codecov/c/github/yoshuawuyts/wayfarer-to-fs/master.svg?style=flat-square
[codecov-url]: https://codecov.io/github/yoshuawuyts/wayfarer-to-fs
[downloads-image]: http://img.shields.io/npm/dm/wayfarer-to-fs.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/wayfarer-to-fs
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
