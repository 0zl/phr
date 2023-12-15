import { Browser, executablePath } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import puppeteerStealth from 'puppeteer-extra-plugin-stealth'

interface ISnapOptions {
    url: string
    selector: string
    format?: 'png' | 'jpeg' | 'webp'
    transparent?: boolean
    viewport?: {
        width: number
        height: number
    },
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2'
}

class PuppeteerWrapper {
    Browser!: Browser

    async init(headlessMode: boolean | 'new') {
        puppeteer.use(puppeteerStealth())
        
        this.Browser = await puppeteer.launch({
            headless: headlessMode,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ],
            ignoreHTTPSErrors: true,
            executablePath: executablePath()
        })

        console.log('ppt initialized.')
    }

    async snap(opts: ISnapOptions) {
        const page = await this.Browser.newPage()
        await page.setViewport(opts.viewport || { width: 1280, height: 800 })

        try {
            await page.goto(opts.url, { waitUntil: opts.waitUntil || 'networkidle0' })
            await page.waitForSelector(opts.selector)

            const el = await page.$(opts.selector)
            if ( !el ) throw new Error(`element not found: ${opts.selector}`)

            const res = await el.screenshot({
                type: opts.format || 'png',
                omitBackground: opts.transparent || false,
                captureBeyondViewport: true
            })

            await page.close()
            return res
        } catch (e) {
            await page.close()
            throw e
        }
    }
}

export { PuppeteerWrapper, ISnapOptions }