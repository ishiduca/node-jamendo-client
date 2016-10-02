'use strict'
const http = require('http')
const client_id = require('../test_client_id').client_id
const jamendo = require('../jamendo')(client_id, {
    https: true
  , followRedirects: true
  , redirectToFile:  true
})

const app = http.createServer((req, res) => {
    console.log(req.method)
    console.dir(req.headers)

    jamendo.request('/tracks/file', {id: 1269020, action: 'stream'})
        .once('response', response => {
            console.log(response.headers)
            res.setHeader('content-type', response.headers['content-type'])
            res.setHeader('content-length', response.headers['content-length'])
            res.setHeader('connection', response.headers.connection)
        })
        .on('error', onError)
        .pipe(res)


    function onError (err) {
        res.statusCode = 500
        res.setHeader('content-type', 'text/plain; charset=utf-8')
        res.end(String(err))
        console.log(err)
    }
})


app.listen(9999, () => {
    console.log('server start to listen on port %s', app.address().port)
})
