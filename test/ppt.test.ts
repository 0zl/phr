import { PuppeteerWrapper } from '../libs/browser'
import { describe, it } from 'bun:test'

let ppt: PuppeteerWrapper

describe('Initialize Puppeteer', () => {
    it('should initialize', async () => {
        ppt = new PuppeteerWrapper()
        await ppt.init(true)
    })
})

describe('Snap', () => {
    it('should success take screenshot in PNG', async () => {
        const res = await ppt.snap({
            url: 'https://example.com',
            selector: 'body'
        })

        Bun.write(`test/screenshot.test_result.png`, res)
    })

    it('should success take screenshot in JPEG', async () => {
        const res = await ppt.snap({
            url: 'https://example.com',
            selector: 'body',
            format: 'jpeg'
        })

        Bun.write(`test/screenshot.test_result.jpeg`, res)
    })

    it('should success take screenshot in WEBP', async () => {
        const res = await ppt.snap({
            url: 'https://example.com',
            selector: 'body',
            format: 'webp'
        })

        Bun.write(`test/screenshot.test_result.webp`, res)
    })
})

describe('Close', () => {
    it('should close browser', async () => {
        await ppt.Browser.close()
    })
})