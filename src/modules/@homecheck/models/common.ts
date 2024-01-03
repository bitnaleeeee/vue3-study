import { getRandomString, getUnixtime } from "../libs/min";
import _ from "lodash";

type EventListener = {
  [eventName: string]: any;
};
type logDelegator = {
  log_id: string;
};

class log {
  _id: string = getRandomString(8, false);
  id: string | undefined | null;
  //time
  t: Number = getUnixtime();
  // property key
  k: string = "";

  // from
  f: any = "";

  // value
  v: any = "";

  constructor(id: string, key: string, from: any, to: any) {
    if (!id) {
      delete this.id;
    } else {
      this.id = id;
    }
    this.k = key;
    this.f = from;
    this.v = to;
  }
}

export type _dataType = {
    _id: string,
    memo: string,
    __created__: number,
    __deleted__: number,
    __modified__ : number
}
export class _data {
  _id: string = getRandomString(10, false);
  memo: string = "";
  __created__: number = getUnixtime();
  // 삭제 시간 0 = 삭제 안됨, 1 이상 = 삭제 시간
   __deleted__: number = 0;
  // 수정된 시각
   __modified__: number = getUnixtime();
  delete() {
    this.__deleted__ = getUnixtime();
  }
  isDeleted() {
    return this.__deleted__ != 0 ? true : false;
  }
}

export class basic extends _data {
  protected __logDebounceTime__: number = 5000;
  protected __logLimit__: number = 8;

  // 이벤트 리스트
  protected __event__: string[] = [];
  protected __event_list__: EventListener = {};

  // 로그 저장소
  protected __log__: Array<log> = [];
  constructor() {
    super();
    this.init();
  }
  onChanged() {
    console.log("onChanged!");
    this.__modified__ = getUnixtime();
    if (this.__event_list__["local:onChanged"]) {
      this.__event_list__["local:onChanged"]();
    }
  }

  addEventListener(eventName: string, event: () => void) {
    this.__event_list__[eventName] = event;
  }

  protected addLog(key: string, from: any, to: any) {
    this.__log__.unshift(new log("", key, from, to));
  }
  protected __addLog(delegator: logDelegator, target: basic, logObj: object) {
    const log_id = delegator.log_id ? delegator.log_id : getRandomString(4, false);
    target.__log__.unshift(new log(log_id, logObj.k, logObj.f, logObj.v));

    // 로그끼리 비교하여 이상한 항목 지우기
    const filteredWithLog = target.__log__.filter((_log) => _log.id == log_id);
    if (filteredWithLog.length == 2) {
      target.__log__.unshift(new log("", filteredWithLog[0].k, filteredWithLog[1].f, filteredWithLog[0].v));
      target.__log__ = target.__log__.filter((_item) => _item.id != log_id);
    }
    if (target.__log__.length > target.__logLimit__) {
      target.__log__.length = target.__logLimit__;
    }
    delegator.log_id = "";
    return log_id;
  }

  protected init() {
    setTimeout(() => {
      for (let key of Object.keys(this)) {
        if (key.includes("__modified__") || key == "_id") {
          Object.defineProperty(this, `${key}`, {
            value: this[key],
            writable: true,
            //enumerable : false,
            configurable: true,
          });
          continue;
        }
        if (typeof this[key] == "object") {
          continue;
        }
        const addLogDebounce = _.debounce(this.__addLog, this.__logDebounceTime__, {
          leading: true,
        });
        Object.defineProperty(this, `$__${key}`, {
          value: this[key],
          writable: true,
        });
        let delegator = <logDelegator>{
          log_id: "",
        };
        Object.defineProperty(this, `${key}`, {
          get() {
            return this[`$__${key}`];
          },
          set(value) {
            this.onChanged();
            let nextLogId = addLogDebounce(delegator, this, {
              k: key,
              f: this[`$__${key}`],
              v: value,
            });
            delegator.log_id = nextLogId;
            this[`$__${key}`] = value;
          },
        });
      }
    });
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

  static builder(obj: Object) {
    // 최대한 obj 의 내용을 활용하면서 생성하기
    let output = new this();
    for (let key in obj) {
      /*
            if(this.properties.includes(key)){
                output[key] = obj[key]
            }
            */
    }
    return output;
  }
}
