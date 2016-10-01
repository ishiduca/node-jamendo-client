'use strict'
const url       = require('url')
const test      = require('tape')
const http      = require('http')
const client_id = require('../test_client_id').client_id
const Jamendo   = require('../jamendo')

test('followRedirects => true', t => {
    setup(9999, (app) => {
        const jamendo = new Jamendo(client_id, {followRedirects: true})
        jamendo.hostname = '0.0.0.0:9999'

        jamendo.request('/redirect/0', {}, function (err, ret, response) {
            t.notOk(err, 'no exists error')
            t.ok(response instanceof http.IncomingMessage, 'response instanceof http.IncomingMessage')
            t.is(ret.headers.status, 'success', 'ret.headers.satus eq "success"')
            t.is(ret.results.length, 10, 'ret.results.length eq 10')
            t.is(ret.results[0], 'http://0.0.0.0:9999/download/redirects/1', 'ret.results[0] eq "http://0.0.0.0:9999/download/redirects/1"')
            t.is(ret.results[9], 'http://0.0.0.0:9999/download/redirects/10', 'ret.results[9] eq "http://0.0.0.0:9999/download/redirects/10"')
            app.close()
            t.end()
        })
    })
})

test('followRedirects => undefined', t => {
    setup(9999, (app) => {
        const jamendo = new Jamendo(client_id)
        jamendo.hostname = '0.0.0.0:9999'

        jamendo.request('/redirect/0', {}, function (err, ret, response) {
            t.notOk(err, 'no exists error')
            t.notOk(ret, 'no exists ret')
            t.ok(response instanceof http.IncomingMessage, 'response instanceof http.IncomingMessage')
            t.is(response.statusCode, 302, 'response.statusCode eq ' + response.statusCode)
            t.is(response.headers['location'], 'http://0.0.0.0:9999/download/redirects/1', 'response.headers["location"] eq "http://0.0.0.0:9999/download/redirects/1"')
            app.close()
            t.end()
        })
    })
})

test('followRedirects => 2', t => {
    setup(9999, (app) => {
        const jamendo = new Jamendo(client_id, {followRedirects: 2})
        jamendo.hostname = '0.0.0.0:9999'

        jamendo.request('/redirect/0', {}, function (err, ret, response) {
            t.ok(err instanceof Error, 'err instaceof Error')
            t.is(err.message, 'Response was redirected too many times :(', err.message)
            t.notOk(ret, 'no exists ret')
            t.notOk(response, 'no exists response')
            app.close()
            t.end()
        })
    })
})

function setup (port, cb) {
    var redirects = []
    const app = http.createServer((req, res) => {
        const opt = url.parse(req.url, true)

        redirects.push('http://0.0.0.0:9999/download/redirects/' + String(redirects.length + 1))

        if (redirects.length >= 10) {
            return res.end(JSON.stringify({headers: {
                code: 0
              , status: 'success'
            }, results: redirects}))
        }

        res.statusCode = 302
        res.setHeader('Location', redirects[redirects.length - 1])
        return res.end()
    })

    app.listen(port, () => cb(app))

    return app
}
