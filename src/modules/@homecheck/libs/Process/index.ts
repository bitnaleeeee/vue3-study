import { AddEvents, ExecuteEvent } from '../EventListener'
import type { EventCallBack } from '../EventListener/types'

import {ProcessPolicy, ProcessStatus,  AsyncFunction, ProcessActionFlag } from './types'

import type { ProcessConfig, ProcessResult, ProcessError, ProcessActionType, ProcessAction} from './types'



// function인 경우, function



export class Process {    
    protected config : ProcessConfig = {
        name : "",
        policy : ProcessPolicy.StopWhenError,
        catch : () => {}
    }

    public static config(config? : Partial<ProcessConfig>) : Process{
        const process = new Process()
        if(config != null){
            for(let key in config){
                process.config[key] = config[key]
            }
        }


        return process
    }


    async start(...actions : ProcessAction[]) : Promise<ProcessResult>{
        const errors : ProcessError[] = []
        return new Promise(async resolve => {
            let stopFlag = 0
            let forceStopFlag = 0
            let processCount = 0;


        
            for await(let action of actions){
                let action_result;
                // 프로세스 정책에 따라 멈추기
                if(forceStopFlag == 1) continue
                if(this.config.policy == ProcessPolicy.StopWhenError && stopFlag == 1) continue;
                try{
                    switch(typeof action.action){
                        case 'function' :
                            if(action.action instanceof AsyncFunction){
                               action_result =  await action.action()
                            }
                            else if(action.action instanceof Function){
                                action_result =  action.action()
                            }
                        break;
                        case 'object' :
                            if(action.action instanceof Promise){
                                action_result =  await action.action()
                            }
                        break;
                    }
                }
                catch(ex){
                    errors.push({
                        process : this.config.name,
                        at : action.name,
                        stack : ex.stack
                    })

                    if(action?.policy != ProcessPolicy.IgnoreAble){
                        stopFlag = 1
                    }
                }
                finally {
                    // 만약 강제 Stop 플래그가 세워졌다면,
                    if(action_result == ProcessActionFlag.Stop){
                        forceStopFlag = 1
                    }
                }
                processCount++;
            }


            // 문제 발생 확인
            const result : ProcessResult = {
                result :  stopFlag == 1 ? ProcessStatus.Stopped :  ProcessStatus.Success
            }
            if(errors.length > 0){
                result.errors = errors
            }
            if(this.config.policy == ProcessPolicy.IgnoreError && result.result == ProcessStatus.Stopped){
                result.result = ProcessStatus.SuccessWithError
            }

            // 만약, 에러라면 Catch 호출
            if(this.config.catch && this.config.policy == ProcessPolicy.StopWhenError
                && result.result == ProcessStatus.Stopped
                ){
                    this.config.catch(errors)
                }

            console.log(result)
            resolve(result)
        })
    }
}