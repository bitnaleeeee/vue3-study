import axios from "axios";
import type { AxiosResponse } from "axios";
import { LocalDocument } from "../LocalDocument";
import { base64ToFile } from '../Functions/files'
import { ErrorMessage } from '../../models/Error'
import SecureModule from './secure'

const Headers = ["contents-tokens", "contents-token", "authorization"];
axios.defaults.withCredentials = false;

type WebRequestsEventList = {
  Success: () => void;
  ConnectionError: () => void; // 서버 연결 문제
  NetworkError: () => void; // 클라이언트 네트워크 문제
  AuthorizationUnvalid: () => void; // 인증 문제
  ErrorCode: () => void;
  RedirectTo: (path: string) => void;
};


var eventList : Partial<WebRequestsEventList> = {
  Success: () => {},
  ConnectionError: () => { },
  NetworkError : () => {}, 
  AuthorizationUnvalid: () => { },
  ErrorCode : ()=> {},
  RedirectTo : (path : string) => {}
}




function checkAuth(response: AxiosResponse<any, any>) {
  if (response.data.code == "010000" || response.data.code == "010002") {
    //console.log(response)
    clearAuthConfig();
    eventList.AuthorizationUnvalid()
    return false;
  }
  return true;
}

function redirectCheck(response: AxiosResponse<any, any>) {
  if (response.data.to) {
    eventList.RedirectTo(response.data.to)
    //window.location.href = response.data.to;
  }
}

async function refreshAuthConfig(response: AxiosResponse<any, any>) {
  for await (let key of Headers) {
    response.headers[key] ? await LocalDocument.set(key, response.headers[key]!) : null;
  }
}

function clearAuthConfig() {
    LocalDocument.del("contents-tokens");
    LocalDocument.del("permissionTime");
    LocalDocument.del("authorization");
    LocalDocument.del("contents-token");
    LocalDocument.del("permission");
}
async function getAuthConfig() {
  let returnValue: any = {
    "Cache-Control": "no-store",
    Pragma: "no-store",
    Expires: "0",
  };
  for (let key of Headers) {
    (await LocalDocument.get(key)) ? (returnValue[key] = await LocalDocument.get(key)) : null;
  }

  return returnValue;
}

async function get(url: string) {
  const headers = await getAuthConfig();
  //console.log('get : ', url , ',', headers)
  return new Promise(async (resolve, reject) => {
    axios.get(url, {
      headers
      
    }).then(async (res) => {
        if (!checkAuth(res)) return;
        await refreshAuthConfig(res);
        resolve(res);
        redirectCheck(res);
      })
      .catch((ex) => {
        //ERR_NETWORK
        switch (ex.code) {
          case 'ERR_NETWORK':
            eventList.NetworkError();
          break;
        }
        resolve(ex);
    });
  });
}

async function post(url: string, data: object) {
  const headers = await getAuthConfig();
  //console.log("get : ", url, ",", headers);
  return new Promise(async (resolve) => {
    axios
      .post(url, data, {
        headers
      })
      .then(async (res) => {
        if (!checkAuth(res)) return;
        await refreshAuthConfig(res);
        resolve(res);
        redirectCheck(res);
      })
      .catch((ex) => {
        switch (ex.code) {
          case "ERR_NETWORK":
            eventList.NetworkError();
            break;
        }
        resolve(ex);
      });
  });
}

function addEventListener(eventName: "ConnectionError" | "NetworkError" | "AuthorizationUnvalid" | "RedirectTo", func: ()=>void) {
  eventList[eventName] = () => {
    console.log(eventName)
    func()
  }
}



export const uploadFile  = async (file: File) : Promise<string> => {
  const _FormData = new FormData();
  _FormData.append("file", file);
  try {
    let { data } = await axios.post("https://cdn1.homecheck.kr/", _FormData);
    return data.key;
  } catch (ex) {
    console.log(ex)
    return '';
  }
}

export const checkFile = async ( name : string) : Promise<string> => {

  try {

    const res = await axios.get(`https://homecheck.kr/cdn/findByName?name=${name}`)
    if(res.data.code == 0 || res.data.code == '0'){
      return res.data.data[0].md5
    }
    return ""
  }
  catch(ex){
    return ""
  }
}


export const uploadBase64 = async (base64: string, filename : string, mime? : string): Promise<string> => {
  const _FormData = new FormData();
  _FormData.append("file", await base64ToFile(base64, filename, mime ));
  try {
    let {data} = await axios.post("https://homecheck.kr/cdn/", _FormData);
    return data.key;
  } catch (ex) {
    return "";
  }
};





export const toImgUrl = (value?: string) => {
  if (value?.includes("data:image")) {
    return value;
  } else if (value == "") {
    return "";
  }
  return `https://homecheck.kr/cdn/?f=${value}`;
}




async function setContentsTokens(tokens: string) {
  console.log("tokens : ", tokens)
  await LocalDocument.set("contents-tokens", tokens);
}
async function getContentsTokens() {
  return await LocalDocument.get("contents-tokens");
}

export const authAxios = {
    get,
    post,
  uploadFile,
  addEventListener,
  setContentsTokens,
  getContentsTokens,
  clearAuthConfig
}

export const WebRequests = {
  get,
  post,
  uploadFile,
  addEventListener,
  setContentsTokens,
  getContentsTokens,
  clearAuthConfig,
  uploadBase64,
  checkFile
};

export const Axios = axios