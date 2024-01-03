import type { EventTypes, EventCallBack } from './types'

const Events : EventTypes   = {

}

export const AddEvents = (name : string, action : EventCallBack)=> {
    Events[name] = action
}

export const ExecuteEvent = (name : string, data : any) => {
    if(Events[name]){
        Events[name](data)
    }
}