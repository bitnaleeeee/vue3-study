import { getRandomString } from '../Functions'
import _ from 'lodash'

type ParallelsEventList = {
    onProcessStart: () => void
    onProcessEnd : ()=> void
};

type ParallelsEvent =  'onProcessStart' | 'onProcessEnd'

type ParallelsHook = {
    complete: number;
    total: number;
}

export class Parallels {

   protected maxConcurrency: number = 200;

    protected currentConcurrency: number = 0;
    
    setConcurrency(value: number) {
        this.maxConcurrency = value
    }
    add(promise: () => Promise<any>, result: (el: any) => void) {
        this.process_count++;

        
        if (this.currentConcurrency == this.maxConcurrency) {
            setTimeout(() => {
                this.retry(promise , result)
            },250)
            return;
        }

        this.execute(promise, result)
        
    }
    protected execute(promise: () => Promise<any>, result: (el: any) => void) {
        this.currentConcurrency++;
        const process_id = getRandomString(12,false)
        this.process[process_id] = false
        promise().then((promise_result) => {
            result(promise_result)
                         
        }).finally(() => {
            this.complete_count++;
                this.currentConcurrency--;
            setTimeout(() => {
                if (this.EventList.onProcessEnd) {
                //this.worker!.postMessage(`parallels : [ ${this.complete_count}, ${this.process_count}]`);
                this.EventList.onProcessEnd();
                }
                this.process[process_id] = true;
            });
        })
    }


    protected retry(promise: () => Promise<any>, result: (el: any) => void) {
        if (this.currentConcurrency == this.maxConcurrency) {
            setTimeout(() => {
                this.retry(promise , result)
            },250)
            return;
        }
        this.execute(promise,result)
    }

    async wait():Promise<void> {
        return await this.waitForProcess()
    }


    addEventListener(eventName : ParallelsEvent, event : (arg : ParallelsHook)=> void) {
        this.EventList[eventName] = () => event({
            complete: this.complete_count,
            total : this.process_count
        });
    }


    protected EventList : Partial<ParallelsEventList> = {
    }










    protected complete_count: number = 0;

    protected process_count : number = 0;

    protected flag_check : number = 150

    protected process : any = {
    }

    protected CheckAllProcessed() : boolean {
         return _.values(this.process).filter((_bool) => !_bool).length == 0;
    }

    protected async waitForProcess():Promise<void> {
        return new Promise((resolve) => {
            setTimeout(async () => {
              if (!this.CheckAllProcessed()) {
                resolve(await this.waitForProcess());
              } else {
                resolve();
              }
            }, this.flag_check);
        });
    }


}