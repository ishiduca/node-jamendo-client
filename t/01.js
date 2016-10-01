'use strict'
var test = require('tape')
var Jamendo = require('../jamendo')
var client_id = require('../test_client_id').client_id

test('var uriStr = Jamendo._createRequestURI(endpoint, params, protocol, host, version)', t => {
    var jam = Jamendo(client_id, {https: true})
    t.is(Jamendo._createRequestURI('/tracks', {
        format: 'jsonpretty'
      , limit:  2
      , fuzzytags: ['groove', 'rock']
      , speed:     'high veryhigh'
      , include: 'musicinfo'
      , client_id: jam.client_id
    }, jam.protocol, jam.hostname, jam.version)
    , 'https://api.jamendo.com/v3.0/tracks/?format=jsonpretty&limit=2&fuzzytags=groove+rock&speed=high+veryhigh&include=musicinfo&client_id=' + client_id
    , 'https://api.jamendo.com/v3.0/tracks/?format=jsonpretty&limit=2&fuzzytags=groove+rock&speed=high+veryhigh&include=musicinfo&client_id=' + client_id)
    t.is(Jamendo._createRequestURI('/albums/', {
        format: 'jsonpretty'
      , limit:  2
      , fuzzytags: ['groove', 'rock']
      , speed:     'high veryhigh'
      , include: 'musicinfo'
      , client_id: jam.client_id
    } , jam.protocol, jam.hostname, jam.version)
    , 'https://api.jamendo.com/v3.0/albums/?format=jsonpretty&limit=2&fuzzytags=groove+rock&speed=high+veryhigh&include=musicinfo&client_id=' + client_id
    , 'https://api.jamendo.com/v3.0/albums/?format=jsonpretty&limit=2&fuzzytags=groove+rock&speed=high+veryhigh&include=musicinfo&client_id=' + client_id)
    t.end()
})
