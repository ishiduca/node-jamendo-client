'use strict'
var test      = require('tape')
var http      = require('http')
var Jamendo   = require('./server/app')
var client_id = require('../test_client_id').client_id
var port      = 9999
var jamendo   = require('../jamendo')(client_id, {
        followRedirects: true
    })

jamendo.hostname = '0.0.0.0:' + port

console.log('# jamendo.request(endpoint, params[, opt], cb)')
test('case success # jamendo.request("/tracks", params, cb)', t => {
    Jamendo(port, jamendo.protocol, (app) => {
        jamendo.request('/tracks', {
            artists_name: 'Golden Duck Orchestra'
        }, function (err, results, res) {
            t.is(results.headers.code, 0, 'results.headers.code eq 0')
            t.is(results.headers.status, 'success', 'results.headers.status eq "success"')
            t.ok(results.results[0], 'exists results.results[0]')
            t.ok(res instanceof http.IncomingMessage, 'res instanceof http.IncomingMessage')
            t.end()
            app.close()
        })
    })
})

test('Needed Parameter # jamendo.request("/tracks", {}, cb)', t => {
    Jamendo(port, jamendo.protocol, (app) => {
        jamendo.request('/tracks', {}, (err, results, res) => {
            t.notOk(results, 'no exsits results')
            t.is(err.data.code, 8, 'err.data.code eq 8')
            t.is(err.name, 'Needed Parameter', 'err.name eq "Needed Parameter"')
            t.is(err.message, 'params empty', 'err.message eq "params empty"')
            t.end()
            app.close()
        })
    })
})

test('Invalid Client Id # jamendo.request("/radio", params).on("error", ...).on("response", ...)', t => {
    var _client_id = jamendo.client_id; jamendo.client_id = 'Foo'
    Jamendo(port, jamendo.protocol, (app) => {
        jamendo.request('/radios', {id: 123})
        .on('error', err => {
            t.is(err.data.code, 5, 'err.data.code eq 5')
            t.is(err.name, 'Invalid Client Id', 'err.name eq "Invalid Client Id"')
            t.is(err.message, 'client not found Foo', 'err.message eq "client not found Foo"')
            t.end()
            app.close()
        })
        .once('response', function (res) {
            t.ok(res instanceof http.IncomingMessage, 'res instanceof http.IncomingMessage')
        })
    })
})

test('Method Not Found # jamendo.request("/tracks/hoge", params).on("error", ...)', t => {
    Jamendo(port, jamendo.protocol, (app) => {
        jamendo.request('/tracks/hoge', {id: 123})
        .on('error', err => {
            t.is(err.data.code, 7, 'err.data.code eq 7')
            t.is(err.name, 'Method Not Found','err.name eq "Method not Found"')
            t.is(err.message, '/v3.0/tracks/hoge/', 'err.message eq "/v3.0/tracks/hoge/"')
            t.end()
            app.close()
        })
    })
})
