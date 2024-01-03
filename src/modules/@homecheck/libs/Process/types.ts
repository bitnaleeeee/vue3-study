export const AsyncFunction = async function () {}.constructor;

export enum ProcessPolicy {
    StopWhenError = 's',
    IgnoreError = 'i',
    IgnoreAble = 'ia'
}

export enum ProcessStatus {
    Stopped = 'st',
    Success = 'su',
    SuccessWithError = 'swe'
}


export enum ProcessActionFlag {
    Stop
}

// 오류 발생시
// 1. 멈추기
// 2. 계속 진행


export type ProcessConfig = {
    name : string
    policy : ProcessPolicy
    catch? : ProcessExceptionCallBack
    finally? : ()=> void
}

export type ProcessResult = {
    result : ProcessStatus
    errors? : ProcessError[]
}

export type ProcessError = {
    process : string,
    at : string,
    stack : string
}

export type ProcessAction = {
    name : string
    action : ProcessActionType
    policy? : ProcessPolicy
    catch ? : ProcessExceptionCallBack
    stopWhenError? : boolean// 흠

}

export type ProcessExceptionCallBack = (err : ProcessError | ProcessError[]) => void

export type ProcessActionType = typeof AsyncFunction | Function | Promise<any>

/**
 * 
 *     Process.config({
      name : "sa-app-reload",
      policy : ProcessPolicy.IgnoreError
    }).start({
      name : "account",
      action :  async ()=> { this.account = await CacheStorageDB.get("account") }
    },
    {
      name : "LocalChecklist",
      action :  async ()=> this.checklist = await getLocalChecklist(this.account)
    },
    {
      name : "action",
      action :  async ()=> this.checklist = await getLocalChecklist(this.account)
    }
     
    )
 */