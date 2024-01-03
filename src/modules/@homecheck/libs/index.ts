import { CacheStorageDB } from "./CacheStorage"


export * from "./Functions"
export * from './Searcher'

export * from './LocalDocument'
export * from './WebRequests'
/*
export * from './WebRequests'
*/

type LibraryInitType = {
  packageName: string;
  platform: string;
  appVersion: string; // 앱 버전 관리
  storagePath?: "local" | "none";
  isWeb? : boolean
  codepush?: CodepushConfig;
};
export type CodepushConfig = {
    latestVersionURL : string
    updating? : () => void
}


export namespace Lib {
    export var packageName = '';
    export var platform = '';
    export var isWeb : boolean = false;
    export var appVersion: string = ''
    export var storagePath: "local" | "none" = 'none'
    export var account : string = ""
    export const Init = async (config : LibraryInitType) => {
        console.log('[@homecheck]', config.packageName, `: init [${config.appVersion}/ ${config.platform}]`)
        packageName = config.packageName
        platform = config.platform
        appVersion = config.appVersion
        if (config.storagePath) {
          storagePath = config.storagePath;  
      }
        if (config.isWeb != undefined) {
          isWeb = config.isWeb
        }
        if (!isWeb && config.codepush) {
          // 코드푸시 적용
          console.log("Codepush Loaded! ");
          const {CodePush} = await import('./Codepush')
          CodePush.Init(config.codepush!);
        }
        
    }

    export const setAccount = async (_account: string) => {
        account = _account
        if (storagePath == "local") {
            await CacheStorageDB.set("account", _account)
        }
    }
}   