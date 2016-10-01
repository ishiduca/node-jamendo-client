'use strict'
const fs        = require('fs')
const path      = require('path')
const mkdirp    = require('mkdirp')
const through   = require('through2')
const client_id = require('../test_client_id').client_id
const jamendo   = require('../jamendo')(client_id, {
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
    const dirPath = path.join(__dirname, result.artist_name, result.album_name)
    mkdirp(dirPath, err => {
        if (err) return onError(err)

        const filePath = path.join(dirPath, result.name) + '.mp3'

        console.log('[download start "%s"]', result.name)

        jamendo.request('/tracks/file', {id: result.id})
            .on('error', onError)
            .pipe(fs.createWriteStream(filePath))
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
}))
