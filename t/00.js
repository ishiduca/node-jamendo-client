'use strict'
const test = require('tape')
const Jamendo = require('../jamendo')

test('const jamendo = new Jamendo(client_id[, client_secret][, opt])', t => {
    t.throws(() => new Jamendo(), /"client_id" not found/, 'throw error: new Jamendo')
    t.throws(() => new Jamendo({client_id: 'foo'}), /"client_id" must be "string"/, 'throw error: new Jamendo({client_id: "your_client_id"})')
    t.end()
})

test('new Jamendo(client_id)', t => {
    var jam
    t.doesNotThrow(() => (jam = new Jamendo('foo')), null, 'does not throw error: new Jamendo(client_id)')
    t.is(jam.client_id, 'foo', 'jamendo.client_id eq "foo"')
    t.notOk(jam.client_secret, 'no exists jamendo.client_secret')
    t.end()
})

test('new Jamendo(client_id, client_secret)', t => {
    var jam
    t.doesNotThrow(() => (jam = new Jamendo('foo', 'bar')), null, 'does not throw error: new Jamendo(client_id, client_secret)')
    t.is(jam.client_id, 'foo', 'jamendo.client_id eq "foo"')
    t.is(jam.client_secret, 'bar', 'jamendo.client_secret eq "bar"')
    t.end()
})

test('new Jamendo(client_id, {followRedirects: 3})', t => {
    var jam
    t.doesNotThrow(() => (jam = new Jamendo('foo', {followRedirects: 3})), null, 'does not throw error: new Jamendo(client_id, opt)')
    t.is(jam.client_id, 'foo', 'jamendo.client_id eq "foo"')
    t.notOk(jam.client_secret, 'no exists jamendo.client_secret')
    t.is(jam.followRedirects, 3, 'jamendo.followRedirects eq 3')
    t.is(jam.protocol, 'http:', 'jamendo.protocol eq "http:"')
    t.end()
})

test('new Jamendo(client_id, {followRedirects: true, https: true})', t => {
    var jam
    t.doesNotThrow(() => (jam = new Jamendo('foo', {followRedirects: true, https: true})), null, 'does not throw error: new Jamendo(client_id, opt)')
    t.is(jam.client_id, 'foo', 'jamendo.client_id eq "foo"')
    t.notOk(jam.client_secret, 'no exists jamendo.client_secret')
    t.is(jam.followRedirects, true, 'jamendo.followRedirects eq true')
    t.is(jam.protocol, 'https:', 'jamendo.protocol eq "https:"')
    t.end()
})

test('new Jamendo(client_id, client_secret, {followRedirects: 2, https: true})', t => {
    var jam
    t.doesNotThrow(() => (jam = new Jamendo('foo', 'bar', {followRedirects: 2, https: true})), null, 'does not throw error: new Jamendo(client_id, opt)')
    t.is(jam.client_id, 'foo', 'jamendo.client_id eq "foo"')
    t.is(jam.client_secret, 'bar', 'jamendo.client_secret eq "bar"')
    t.is(jam.followRedirects, 2, 'jamendo.followRedirects eq 2')
    t.is(jam.protocol, 'https:', 'jamendo.protocol eq "https:"')
    t.end()

})
