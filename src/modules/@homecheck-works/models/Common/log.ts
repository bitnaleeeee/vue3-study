import { getRandomString, getUnixtime } from "@/modules/@homecheck/libs/min";
import _ from "lodash";

type EventListener = {
  [eventName: string]: any;
};
type logDelegator = {
  log_id: string;
};

class log {
  a : string = ""
  //time
  t: Number = getUnixtime();
  // property key
  k: string = "";

  // from
  f: any = "";

  // value
  v: any = "";

  constructor(action: string, key: string, from: any, to: any) {
    this.a = action;
    this.k = key;
    this.f = from;
    this.v = to;
  }
}

export class LoggingModel {

  // 이벤트 리스트
  protected __event__: string[] = [];
  protected __event_list__: EventListener = {
    onChanged: (property: string, to: any, from : any) => {},
  };

  // 로그 저장소
  protected __log__: Array<log> = [];
  

  addEventListener(eventName: string, event: () => void) {
    this.__event_list__[eventName] = event;
  }

  protected onChanged(property : string, value : any, from : value) {
      console.log("onChanged : ", property , ", to : ", value, ", from :", from);
      this.__event_list__.onChanged(property, value, from);
      this.addLog(property, from, value)
  }
  protected addLog(key: string, from: any, to: any) {
    this.__log__.unshift(new log("", key, from, to));
  }


  toJson() {
    const output = {};
    for (let key in this) {
      output[key] = this[key];
    }
    return output;
    //return JSON.parse(JSON.stringify(this))
  }

  getLog() {
    return this.__log__;
    }
    
    setValue(property: string, value: any) {
        console.log(this[property])
        this[`${property}:modified`] = getUnixtime();
        const from = this[`${property}`]
        _.set(this, property, value)
        this.onChanged(property, value, from)
    }

    setIndex(property:string, index: number, value : any){
      this[`${property}`][index] = value;
      if(!this[`${property}:modified`]){
        this[`${property}:modified`] = []
      }
      this[`${property}:modified`][index] = getUnixtime();
      
      this.onChanged(`${property}[${index}]`, value, this[`${property}`][index])
    }
}
