# jamendo-client

a thin http client for Jamendo API v3.0

## usage

to download "mp3" in order.

```js
'use strict'
var fs        = require('fs')
var path      = require('path')
var mkdirp    = require('mkdirp')
var through   = require('through2')
var jamendo   = require('../jamendo')(your_client_id, {
    https: true
  , followRedirects: true
})

jamendo.request('/tracks', {
    artist_name: 'Golden Duck Orchestra'
  , order: 'name'
})
    .on('error', err => console.error(err))
    .once('Jamendo.Api.Response', ret => console.dir(ret.headers))

.pipe(through.obj((result, _, done) => {
    var dirPath = path.join(__dirname, result.artist_name, result.album_name)
    mkdirp(dirPath, err => {
        if (err) return onError(err)

        var filePath = path.join(dirPath, result.name) + '.mp3'

        console.log('[download start "%s"]', result.name)

        jamendo.request('/tracks/file', {id: result.id})
            .on('error', onError)

        .pipe( fs.createWriteStream(filePath))
            .on('error', onError)
            .once('finish', () => {
                console.log('[download ok   "%s"]', result.name)
                done()
            })
    })

    function onError (err) {
        console.error(err)
        done()
    }
})
```
