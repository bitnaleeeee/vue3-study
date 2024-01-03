import { ParseJson } from '../Functions';
import { encrypt, decrypt} from '../Encrypt'


const EncryptKey = "09ac581"
// 데이터 필요할 듯

// Key Value based, for low capacity
export namespace LocalDocument {
    // 플랫폼 지정
  export const get = async (key: string) => {
      return new Promise((resolve, reject) => {
          const getItem = localStorage.getItem(key);
          if (getItem) {
              return resolve(ParseJson(decrypt(getItem, EncryptKey)));
          }
          else {
              return resolve(null)
          }
    });
  };

  export const set = async (key: string, value: any) => {
      const input = value == undefined ? null : value;
      let insertValue = input;
      if (typeof input == 'object') {
          insertValue = JSON.stringify(input)
    }
    
    return new Promise((resolve) => {
        return resolve(localStorage.setItem(key, encrypt(`${insertValue}`, EncryptKey)));
    });
  };

  export const del = (key: string) => {
   localStorage.removeItem(key);
  };

  export const getKeys = async () => {
    return new Promise((resolve) => {
        const output = [];
        for (let i = 0; i < localStorage.length; i++) {
          output.push(localStorage.key(i));
        }
        return resolve(output);
    });
  };

  export const clear = async () => {
    return new Promise((resolve) => {
        return localStorage.clear();
    });
  };

  // clearCache
}