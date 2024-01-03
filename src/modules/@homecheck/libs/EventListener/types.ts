export type EventTypes = {
    [key in string] : EventCallBack
}

export type EventCallBack = (data : any) => void 