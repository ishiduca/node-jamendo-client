'use strict'
const http = require('http')
const client_id = require('../test_client_id').client_id
const jamendo = require('../jamendo')(client_id, {
    https: true
  , followRedirects: true
})

const app = http.createServer((req, res) => {
    console.log(req.method)
    console.dir(req.headers)

    jamendo.request('/tracks/file', {id: 1316252, action: 'stream'}, (err, redirectURL, response) => {
        if (err) return onError(err)
        if (redirectURL) return redirect(redirectURL, response)
        onError(new Error('no redirect url'))
        console.log(response.stautsCode)
        console.log(response.headers)
    })

    function redirect (redirectURL, response) {
        res.statusCode = response.statusCode
        res.setHeader('location', redirectURL)
        res.end()
    }

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
