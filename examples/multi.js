'use strict'
const fs        = require('fs')
const path      = require('path')
const mkdirp    = require('mkdirp')
const through   = require('through2')
const client_id = require('../test_client_id').client_id
const jamendo   = require('../jamendo')(client_id, {
    https: true
  , followRedirects: true
  , redirectToFile: true
})

jamendo.request('/tracks', {album_name: 'Dark Room'}).on('error', onError)
.pipe(through.obj((result, _, done) => {
    const dirPath = path.join(__dirname, result.artist_name, result.album_name)
    mkdirp(dirPath, err => {
        if (err) return onError(err)
        const filePath = path.join(dirPath, result.name) + '.mp3'

        console.log('[download start "%s"]', result.name)

        jamendo.request('/tracks/file', {id: result.id}).on('error', onError)
            .pipe(fs.createWriteStream(filePath)).on('error', onError)
            .once('finish', () => console.log('[download ok    "%s"]', result.name))
    })

    done()
}))


function onError (err) {
    console.log(err)
    err.data && console.dir(err.data)
}
