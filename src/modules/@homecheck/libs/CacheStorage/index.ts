import moment from 'moment'

import { formatBytes, getUnixtime } from '../Functions'
import { blobToFile } from '../Functions/files'
import { WebRequests } from '../WebRequests'
import { srcToWebP, blobToWebP, arrayBufferToWebP } from "webp-converter-browser";

const homecheckURL = "https://homecheck.kr/cdn/?f="


const cachename = "CacheStorageDB";
const cacheImg = "CacheImage"



export namespace CacheStorageAPI {
  export const getInfo = async () => {
    // quota.usage -> 사용 중인 용량(byte)
    // quota.quota -> 사용할 수 있는 전체 용량(byte)

    if (navigator.storage && navigator.storage.estimate) {
      const quota = await navigator.storage.estimate();
      const percentageUsed = (quota.usage / quota.quota) * 100;
      console.log(`사용할 수 있는 용량의 ${percentageUsed}%를 사용하고 있습니다.`);
      const remaining = quota.quota - quota.usage;
      console.log(`앞으로 ${formatBytes(remaining)} 를 더 사용할 수 있습니다.`);
    }
  }
}


export namespace CacheStorageDB {
  export const set = async (key: string, value: any) => {
    const storage = await window.caches.open(cachename);
    const newData = { data: value };
    const response = new Response(JSON.stringify(newData), { headers: { "content-type": "application/json; charset=utf-8" } });
    await storage.put(`/${key}.json`, response);
  };

  export const get = async (key: string): Promise<any> => {
    const storage = await window.caches.open(cachename);
    const response = await storage.match(`/${key}.json`);
    if (!response || !response.ok) return undefined;
    const result = await response.json();
    if (!result.data) return undefined;
    return result.data;
  };




}

export namespace CacheImage {
  const maxRetry = 2;
  let storage: Cache;
  let blobs : string[] = []

  export async function init(){
    console.time("[@homecheck] CacheImage, init")
    storage = await window.caches.open(cacheImg);
    console.timeEnd("[@homecheck] CacheImage, init")
  }

  export  function getBlobs() {
    return blobs
  }

  export function toDefaultCDNUrl(url : string) {
    
     return url.replace("homecheck.kr/cdn", "cdn1.homecheck.kr");
  }


  export let num = 0;

  export const isExist = async (url: string): Promise<boolean> => {
    const res = await storage.match(toDefaultCDNUrl(url))
    return res ? true : false
  }

  export const uploadURL = async (url: string) => {
    const res = await getCacheResponse(url);
    const file = await responseToFile(res)
    const webp = await blobToWebP(blob)
    return;
    return await WebRequests.uploadFile(file)
  }


  // 기존 CacheStorage의 URL이 Webp로 변경됨 확인 완료
  export const webpUpload = async (url: string) : Promise<string> => {
    const res = await getCacheResponse(url);
    if (!res || res.status != 200) {
      return {
        message : url + " : res is undefined"
      }
    }
      const webpFile = await responseToWebp(res)
      await insertFile(url, webpFile, 'uploaded')
      return  await WebRequests.uploadFile(webpFile);
    };


  export const getCDN = async (url : string, retry : number = 0) : Promise<string>=> {
    return await get(`${homecheckURL}${url}`, retry)
  }

  export const getCacheResponse = async (url: string): Promise<Response> => {
    return await storage.match(url);
  };



  const FindInserted = []
  export const FindWithInserted = async (url: string, excepts : string[]): Promise<string> => {
    return new Promise(async (resolve) => {
      const res = await storage.match(url);
      if (res && res.status == 200) {
        return resolve("webp");
      }
      
      const targetUnixtTime = parseInt(url.split("_")[2].split(".")[0].slice(0, 10));
      //const targetUnixtTime = 1698729142;

      // 1. inserted가 일치하는경우

      if (FindInserted.length == 0) {

        const cdnKeyParser = (text: string) => {
          if(!text) return ""
          if (text.split("_").length == 2) {
            return text.split("_")[1]
          }
          else {
            return text
          }
        }

        const keys = await storage.keys();
        console.log(excepts)
        const exceptKeys = excepts.map((_url) => {
          return cdnKeyParser(_url.url.split("?f=")[1]);
        });
        
        console.log(exceptKeys);
        for await (let key of keys) {

          if (key.url) {
            const _cdnKey = cdnKeyParser(key.url.split("?f=")[1]);
            
            console.log(_cdnKey);
            const findDuplicate = exceptKeys.find(_key => _key.includes(_cdnKey)
            || _cdnKey.includes(_key) 
            )
            if (_cdnKey && findDuplicate) {
              console.log("already uploaded : ", key.url);
              continue;
            }
            
          }
          const response = await storage.match(key.url);
          const headers = [];
          let insertedObject: { [key in string]: string } = {};

          for (let headerKey of response.headers.keys()) {
            headers.push(headerKey);
          }
          // cdn에서 받아온 항목들 거르기
          if (!headers.includes("filename")) continue;

          insertedObject.url = key.url;
          // 오브젝트형태로 만들어서 전달
          for (let headerKey of headers) {
            insertedObject[headerKey] = response?.headers.get(headerKey);
          }

          insertedObject.inserted = parseInt(`${insertedObject.inserted}`);
          const filename = insertedObject.filename;
          if (filename.includes("JPEG")) {
            let filenameTime = `${filename.split("_")[1]}${filename.split("_")[2]}`;
            insertedObject.inserted2 = moment(filenameTime, "YYYYMMDDHHmmss").unix();
          } else {
            insertedObject.inserted2 = parseInt(`${filename.split("_")[2].split(".")[0]}`);
          }

          FindInserted.push(insertedObject);
        }
        console.log(FindInserted);
      }

      const sorted = FindInserted.filter((item) => item.inserted2 > targetUnixtTime - 120).sort(function (a, b) {
        if (a.inserted2 > b.inserted2) return 1;
        if (a.inserted2 === b.inserted2) return 0;
        if (a.inserted2 < b.inserted2) return -1;
      });
      sorted.length = 8
      resolve(sorted)
      
    });
  }


  export const get = async (url : string, retry : number = 0) : Promise<string>=> {
    try {
      const targetURL = url.replace("homecheck.kr/cdn", "cdn1.homecheck.kr")
      const response = await storage.match(targetURL);
      retry++
      // response가 undefined 인 경우,
      if(!response) {
  
        return await tryDownload(targetURL, retry)
      }

      // 오프라인일 때도 response가 제대로 되는거 보면, 아마 첫 fetch가 문제인듯
      // 또는 첫 fetch시 cdn에서 잘못된 신호를 받을 수도?
      if(!response.ok) {
        // 따라서 삭제
        storage.delete(url)
        storage.delete(targetURL);
        return await tryDownload(targetURL, retry)
      }

     return responseToBlob(response)
    }
    catch(ex)
    {
      console.log(ex)
      return ""
    }
  }


  export const getFile = async(url : string) => {
    const response = await storage.match(url);
    if(!response){
      return null;
    }
    return await responseToFile(response)

  }

  // base64로 response에 저장시, content-type과 상관없이 불러올 수 있는지
  // 확인하기.
  export const insertFile = async (url : string, file : File, tag : string = 'default') => {
    if (file.size == 0) return;


    const response = new Response(file, {
      headers: {
        "Content-Type": `${file.type}`,
        "Content-Length": `${file.size}`,
        filename: encodeURI(file.name),
        inserted: `${getUnixtime()}`,
        tag: tag,
      },
    });
    await storage.put(url, response);
    const res = await storage.match(url)
    if (res) {
      return res.status == 200
    }
    
    return false
  }

  export const set = async (url : string) => {
    const targetURL = toDefaultCDNUrl(url)
    try
    {
      const response = await fetch(url, {
        redirect: "follow",
        mode: "no-cors",
      });
      await storage.put(url, response)

      return await CacheImage.get(targetURL,4)

    }
    catch(ex)
    {
      switch(ex.message){
        case 'Failed to fetch':
          return "";
          break;
        default:
          return ""
      }

    }


  }



  export const changeURL = async (from : string, to: string) : Promise<Boolean> => {
    const response = await storage.match(from)
    if(!response) return false;

    // 새로운 URL 로 response를 이전
    await storage.put(to, response)

    // 이전 URL을 삭제
    await storage.delete(from)
    
    return true
  }


  export const getLocalKeys = async () => {
    const keys = await storage.keys();
    return keys.map(key => key.url).filter(key => !key.includes('homecheck.kr'))
  }

  export const getKeys = async () => {
    const keys = await storage.keys();
    return keys.map(key => key.url).filter(key => key.includes('homecheck.kr'))
  }


  async function responseToBlob(res : Response) : Promise<string>{
    const blob = await res?.blob()
    const blobURL = URL.createObjectURL(blob!);
    blobs.push(blobURL)
    return blobURL
  }

  async function responseToFile(res: Response) : Promise<File> {
    const blob = await res!.blob()
    const filename = decodeURI(res.headers.get("filename"));
    return blobToFile(blob, filename);
  }

  export const responseToWebp = async (res: Response): Promise<File> => {
    const filename = decodeURI(res.headers.get("filename"));
    const blob = await res.blob();
    const webp = await blobToWebP(blob);
    return blobToFile(webp, filename);
  };

  async function tryDownload(url: string, retry: number) {
    console.log('trydownload :', url , "," , retry)
    if(retry == maxRetry) return undefined;

    const res = await CacheImage.set(url)
    if(!res){
      return await tryDownload(url, retry + 1)
    }
    return res;
  }

  export const release = (url?: string) => {
    if (url) {
      URL.revokeObjectURL(url)
      blobs = blobs.filter(blob => blob != url)
    }
    else {
      for (let _url of blobs) {
        URL.revokeObjectURL(_url)
      }
      blobs = []
    }
  }




}