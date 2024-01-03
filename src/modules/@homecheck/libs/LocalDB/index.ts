import { Filesystem, Directory } from '@capacitor/filesystem';
import { encode, decode } from 'js-base64'
import { ParseJson } from '../Functions';
import { Lib } from '..';


// Key Value based, for low capacity
export namespace LocalDocument {
    // 플랫폼 지정
    const isWeb = () => Lib.platform == "web";
    const Fixed_Directory = Directory.Data;
    const BASE_PATH = "db";
    export const Init = () => {
        if (Lib.platform == "web") {
            
        }
        else {
            
        }
    }
    
  export const get = async (key: string) => {
    return new Promise((resolve, reject) => {
      if (isWeb()) {
        return resolve(ParseJson(localStorage.getItem(key)));
      }
      Filesystem.readFile({
        path: `${BASE_PATH}/${key}`,
        directory: Fixed_Directory,
      })
        .then((readFile) => {
          resolve(ParseJson(decode(readFile.data)));
        })
        .catch(() => {
          console.log("noFile");
          resolve("");
        });
    });
  };

  export const set = async (key: string, value: any) => {
    const input = value == undefined ? null : value;
    return new Promise((resolve) => {
      if (isWeb()) {
        return resolve(localStorage.setItem(key, input));
      }
      Filesystem.writeFile({
        path: `${BASE_PATH}/${key}`,
        data: encode(typeof value == "object" ? JSON.stringify(value) : value),
        directory: Fixed_Directory,
        recursive: true,
      })
        .then((result) => {
          console.log(result);
          resolve(result);
        })
        .catch((ex) => {
          console.log(ex);
        });
    });
  };

  export const del = async (key: string) => {
    return new Promise((resolve) => {
      if (isWeb()) {
        return localStorage.removeItem(key);
      }
      Filesystem.deleteFile({
        path: `${BASE_PATH}/${key}`,
        directory: Fixed_Directory,
      }).then((result) => {
        resolve(result);
      });
    });
  };

  export const getKeys = async () => {
    return new Promise((resolve) => {
      if (isWeb()) {
        const output = [];
        for (let i = 0; i < localStorage.length; i++) {
          output.push(localStorage.key(i));
        }
        return resolve(output);
      }
      Filesystem.readdir({
        path: `${BASE_PATH}/`,
        directory: Fixed_Directory,
      })
        .then((result) => {
          return resolve(result.files);
        })
        .catch(() => {
          return resolve([]);
        });
    });
  };

  export const clear = async () => {
    return new Promise((resolve) => {
      if (isWeb()) {
        return localStorage.clear();
      }
      Filesystem.readdir({
        path: `${BASE_PATH}/`,
        directory: Fixed_Directory,
      }).then((result) => {
        let count = 0;
        result.files.filter((file) => {
          Filesystem.deleteFile({
            path: `${BASE_PATH}/${file}`,
            directory: Fixed_Directory,
          }).then(() => {
            count++;
            if (result.files.length == count) {
              resolve({status: "ok"});
            }
          });
        });
      });
    });
  };

  // clearCache
}