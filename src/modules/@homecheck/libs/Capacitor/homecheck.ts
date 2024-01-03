import { registerPlugin, Capacitor } from '@capacitor/core'

type HomecheckPlugin = {
    checkFirstLaunch : ()=> Promise<checkFirstLaunchResult>
  }
  
  type checkFirstLaunchResult = {
    value : boolean
  }


export const getHomecheckPlugin = async () =>{
    const Homecheck = registerPlugin("Homecheck") as HomecheckPlugin
    const { value } = await Homecheck.checkFirstLaunch()
    
  console.log('[codepush] checkFirstLaunch : ', value)
    return value
}