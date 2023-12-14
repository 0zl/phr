import express from 'express'
import helmet from 'helmet'

import { PuppeteerWrapper } from './browser'

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
            .use(helmet({ contentSecurityPolicy: false }))
            .use((_, __, next) => {
                this.CurrentState.req++
                next()
            })
            .get('/state', (_, res) => {
                res.json(this.CurrentState)
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