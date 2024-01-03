export enum imgType{
    URL,
    Local,
    CDN
}

export type img = {
    __modified__ : number;
    __deleted__: number;
    value: string;
    memo: string;
    type: imgType;
    _id : string
}