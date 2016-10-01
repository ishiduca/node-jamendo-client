'use strict'
const test      = require('tape')
const url       = require('url')
const fs        = require('fs')
const http      = require('http')
const client_id = require('../test_client_id').client_id
const Jamendo   = require('../jamendo')

test('const readStream = jamendo.request("/xxx/file", params)', t => {
    const jamendo = new Jamendo(client_id)
    jamendo.hostname = '0.0.0.0:9999'

    setup(9999, (app) => {
        const copyFilePath = __dirname + '/server/copy/dummy.mp3'
        jamendo.request('/tracks/file', {id: 'foo'})
            .on('error', onError)
            .pipe(fs.createWriteStream(copyFilePath))
            .on('error', onError)
            .on('finish', () => {
                const orgStat = fs.statSync(__dirname + '/server/download/dummy.mp3')
                const copStat = fs.statSync(copyFilePath)
                t.is(orgStat.size, copStat.size, 'orgStat.size eq copyStat.size')

                fs.unlink(copyFilePath, err => {
                    err ? onError(err) : doEnd(app)
                })
            })

        function onError (err) {
            console.log(err)
            doEnd()
        }

        function doEnd (app) {
            t.end()
            app.close()
        }
    })
})

test('jamendo.request("/xxx/file", params, null, cb)', t => {
    const jamendo = new Jamendo(client_id)
    jamendo.hostname = '0.0.0.0:9999'

    setup(9999, (app) => {
        const copyFilePath = __dirname + '/server/copy/dummy.mp3'
        jamendo.request('/tracks/file', {id: 'foo'}, (err, data, response) => {
            t.notOk(err, 'no exists error')
            t.ok(response instanceof http.IncomingMessage, 'response instanceof http.IncomingMessage')
            fs.writeFile(copyFilePath, data, err => {
                if (err) return onError(err)
                const orgStat = fs.statSync(__dirname + '/server/download/dummy.mp3')
                const copStat = fs.statSync(copyFilePath)
                t.is(orgStat.size, copStat.size, 'orgStat.size eq copyStat.size')
                fs.unlink(copyFilePath, err => {
                    err ? onError(err) : doEnd(app)
                })
            })
        })

        function onError (err) {
            console.log(err)
            doEnd()
        }

        function doEnd (app) {
            t.end()
            app.close()
        }
    })
})

function setup (port, cb) {
    const app = http.createServer((req, res) => {
        const pathname = url.parse(req.url).pathname

        if (pathname === '/v3.0/tracks/file/') redirect()
        else download(pathname)

        function redirect () {
            res.statusCode = 302
            res.setHeader('location', '/server/download/dummy.mp3')
            return res.end()
        }

        function download (pathname) {
            fs.createReadStream(__dirname + pathname).on('error', onError)
              .pipe(res)
        }

        function onError (err) {
            res.statusCode = 404
            res.end(String(err))
        }
    })

    app.listen(port, () => cb(app))

    return app
}
