import express from 'express'
import helmet from 'helmet'

import { PuppeteerWrapper, ISnapOptions } from './browser'

class ServerWrapper {
    Server!: express.Express
    Puppeteer: PuppeteerWrapper
    CurrentState = { req: 0, success: 0, fail: 0 }

    constructor(ppt: PuppeteerWrapper) {
        this.Puppeteer = ppt
    }

    async init(port: number) {
        this.Server = express()
        this.handleRoutes()

        this.Server.listen(port, () => {
            console.log(`server listening on port`, port)
        })
    }

    handleRoutes() {
        this.Server
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use(helmet({ contentSecurityPolicy: false }))
            .use((_, __, next) => {
                this.CurrentState.req++
                next()
            })
            .get('/state', (_, res) => {
                res.json(this.CurrentState)
            })
            .all('/snap', async (req, res) => {
                const requestData = req.method === 'GET' ? req.query : req.body

                if ( !requestData.url || !requestData.selector ) {
                    res.status(400).end('url and selector are required.')
                    return
                }

                const opts: ISnapOptions = {
                    url: requestData.url,
                    selector: requestData.selector,
                    format: requestData?.format || 'png',
                    transparent: Boolean(requestData?.transparent) || false,
                    viewport: {
                        width: parseInt(requestData?.vw) || 1280,
                        height: parseInt(requestData?.vh) || 800
                    },
                    waitUntil: requestData?.waitUntil || 'networkidle0'
                }

                try {
                    const resData = await this.Puppeteer.snap(opts)
                    res.contentType(opts.format as string).end(resData)

                    this.CurrentState.success++
                    console.log(`snap success: ${this.CurrentState.success}x - ${opts.url}`)
                } catch (e) {
                    console.error(e)
                    this.CurrentState.fail++

                    res.status(500).end(e?.toString())
                    console.log(`snap fail: ${this.CurrentState.fail}x - ${opts.url}`)
                }
            })
            .all('*', async (_, res) => {
                res.send(await Bun.file('si.html').text())
            })
        
        console.log('server route added.')
    }
}

export {
    ServerWrapper
}