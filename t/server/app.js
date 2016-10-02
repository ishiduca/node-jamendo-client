'use strict'
const url       = require('url')
const http      = require('http')
const https     = require('https')
const Router    = require('router-line').Router
const client_id = require('../../test_client_id').client_id

const entities = ('albums artists autocomplete feeds playlists radios reviews tracks users').split(' ')

module.exports = function (port, _protocol, test) {
    const protocol = _protocol.indexOf('https') === -1 ? http : https
    const router   = new Router()

    entities.forEach( entity => {
        router.GET(`/v3.0/${entity}/`, (req, res, pathname, params) => {
            const clntId = params.client_id; delete params.client_id
            if (clntId !== client_id) {
                return res.end(error(5, 'Invalid Client Id'
                , 'client not found ' + clntId))
            }

            if (Object.keys(params).length === 0) {
                return res.end(error(8, 'Needed Parameter'
                , 'params empty'))
            }

            Success(res, [{
                id: 'dummy', name: pathname, params: params
            }])
        })
    })

    ;('albums playlists tracks').split(' ').forEach( entity => {
        router.GET(`/v3.0/${entity}/file/`, (req, res, pathname, params) => {
            var ent = entity.slice(0, entity.length - 1)
            res.writeHead(302, {
                'Location': 'http://0.0.0.0:' + port + '/dummy.txt'
            })
            res.end()
        })
    })

    const app = protocol.createServer((req, res) => {
        const method = req.method.toUpperCase()
        const opt    = url.parse(req.url, true)

        if (method !== 'GET') {
            return res.end(error(2, 'Http Method'
             ,'The received http method is not supported for this method'))
        }

        const result = router.route(method, opt.pathname)

        if (result) result.value(req, res, opt.pathname, opt.query)
        else res.end(error(7, 'Method Not Found', opt.pathname))
    })

    app.listen(port, () => test(app))

    return app
}


function error (code, status, error_message) {
    return JSON.stringify({headers: {
        code: code, status: status, error_message: error_message
    }})
}

function Success (res, results) {
    res.statusCode = 200
    res.end(JSON.stringify({
        headers: {
            code: 0
          , status: 'success'
         }
       , results: results
    }))
}
