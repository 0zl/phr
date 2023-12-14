import { PuppeteerWrapper } from './libs/browser'

if ( import.meta.main ) {
    const ppt = new PuppeteerWrapper()

    const signalHandle = ['SIGINT', 'SIGTERM', 'exit']
    for ( const signal of signalHandle ) {
        process.on( signal, async () => {
            await ppt.Browser.close()
            process.exit(0)
        })
        console.log(`${signal} handled.`)
    }

    await ppt.init(true)
}