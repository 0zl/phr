import { PuppeteerWrapper } from './libs/browser'
import { ServerWrapper } from './libs/server'

if ( import.meta.main ) {
    const ppt = new PuppeteerWrapper()
    const svr = new ServerWrapper(ppt)

    const signalHandle = ['SIGINT', 'SIGTERM', 'exit']
    for ( const signal of signalHandle ) {
        process.on( signal, async () => {
            if ( ppt.Browser ) {
                await ppt.Browser?.close()
            }
            
            process.exit(0)
        })
        console.log(`${signal} handled.`)
    }

    await ppt.init('new')
    await svr.init(7860)
}