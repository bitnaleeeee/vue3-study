import { Filesystem, Directory, Encoding, type FileInfo } from '@capacitor/filesystem';
import { encode, decode } from 'js-base64'
import { ParseJson } from '../Functions';
import { Lib } from '..';
import { includeCDN } from '../Functions'

// 플랫폼 지정
const isWeb           = () =>Lib.platform == 'web'
const Fixed_Directory = Directory.External
const BASE_PATH = 'file'

// 1) 파일 저장소는 하나로 묶어야함


// 2) 간단한 localStorage 대신할 애도 필요
export namespace Files{
  export const LocalhostPath = ()=>{
    return `http://localhost/_capacitor_file_/storage/emulated/0/Android/data/${Lib.packageName}/data/${BASE_PATH}`
  }
  export const LocalhostFilePath = () => {
    return `http://localhost/_capacitor_file_/storage/emulated/0/Android/data/${Lib.packageName}/files/${BASE_PATH}`;
  }

  export const toLocalPath = (url: string) => {
    return `${LocalhostPath()}/${url}`
  }
  export const toLocalFilePath = (url: string) => {
    return `${LocalhostFilePath()}/${url}`;
    
  }



  export const toImgUrl = (url: string) => {
    if (includeCDN(url)) {
      return url;
    } else {
      return toLocalPath(url);
    }
  };


  export const get = async (key : string) : Promise<string> => {
    return new Promise(resolve => {
        if(isWeb()){
            return resolve(ParseJson(localStorage.getItem(key)))
        }
        Filesystem.readFile({
            path     : `${BASE_PATH}/${key}`,
            directory: Fixed_Directory
        }).then(readFile => {
            resolve(ParseJson(decode(readFile.data)))
        })
    })
  }
  
  export const set = async (key : string, value : any) => {
    const input = value == undefined ? null : value
    return new Promise(resolve => {
        if(isWeb()){
            return resolve(localStorage.setItem(key, input))
        }
        Filesystem.writeFile({
          path: `${BASE_PATH}/${key}`,
          data: encode(typeof value == 'object' ? JSON.stringify(value) : value),
          directory: Fixed_Directory,
          recursive: true
        }).then(result => {
            resolve(result)
        })
        
    })
  }

    export const setFile = async (filename : string, base64: string) => {
      return new Promise((resolve) => {
        if (isWeb()) {
          return resolve(localStorage.setItem(filename, base64));
        }
        Filesystem.writeFile({
          path: `${BASE_PATH}/${filename}`,
          data: base64,
          directory: Fixed_Directory,
          recursive: true,
        }).then((result) => {
          resolve(result);
        });
      });
  };

  export const setProtectedFile = async (filename: string, base64: string) => {
    return new Promise((resolve) => {
      if (isWeb()) {
        return resolve(localStorage.setItem(filename, base64));
      }
      Filesystem.writeFile({
        path: `${BASE_PATH}/$$$$_${filename}`,
        data: base64,
        directory: Fixed_Directory,
        recursive: true,
      }).then((result) => {
        resolve(result);
      });
    });
  };
   export const getFile = async (filename: string) : Promise<string> => {
    return new Promise((resolve) => {
      if (isWeb()) {
        return resolve(ParseJson(localStorage.getItem(filename)));
      }
      Filesystem.readFile({
        path: `${BASE_PATH}/${filename}`,
        directory: Fixed_Directory,
      }).then((readFile) => {
        resolve(readFile.data);
      });
    });
  };
  
  export const getProtectedFile = async (filename: string): Promise<string> => {
    return new Promise((resolve) => {
      if (isWeb()) {
        return resolve(ParseJson(localStorage.getItem(filename)));
      }
      Filesystem.readFile({
        path: `${BASE_PATH}/${filename}`,
        directory: Fixed_Directory,
      }).then((readFile) => {
        resolve(readFile.data);
      });
    });
  };
  
  export const del = async (key : string) => {
    return new Promise(resolve => {
        if(isWeb()){
            return localStorage.removeItem(key)
        }
        Filesystem.deleteFile({
            path: `${BASE_PATH}/${key}`,
            directory: Fixed_Directory
        }).then(result => {
            resolve(result)
        })
    })
  }

  export const isExist = async (key : string) => {
      try {
        await Filesystem.stat({
          path: `${BASE_PATH}/${key}`,
          directory: Fixed_Directory,
        });
        return true;
      } catch (checkDirException : any) {
        if (checkDirException.message === "File does not exist") {
          return false;
        } else {
          throw checkDirException;
        }
      }
  }
  
  export const getKeys = async ():Promise<FileInfo[]> => {
    return new Promise(resolve => {
        if(isWeb()){
            const output = []
            for(let i= 0; i < localStorage.length; i++){
                output.push(localStorage.key(i))
            }
            return resolve(output)
        }
        Filesystem.readdir({
            path: `${BASE_PATH}/`,
            directory: Fixed_Directory
          }).then(result => {
            return resolve(result.files)
          }).catch(()=>{
            return resolve([])
          })
    })
  }
  
  
  export const clear = async () => {
    return new Promise(resolve => {
        if(isWeb()){
            return localStorage.clear();
        }
        getKeys().then(result =>{
            let count = 0;
          
          
          const DeleteFiles = result.filter((file) => !file.name.includes('$$$$_'));
          if (DeleteFiles.length == 0) {
            resolve({status : 'ok'})
            return;
          }  
          
          DeleteFiles.map(file => {
              Filesystem.deleteFile({
                path: `${BASE_PATH}/${file.name}`,
                directory: Fixed_Directory,
              }).then(() => {
                count++;
                if (DeleteFiles.length == count) {
                  resolve({ status: "ok" });
                }
              });


            })
          })
    })
  }
}

