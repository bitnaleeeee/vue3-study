export * from './formula'
import _, { reject } from 'lodash'

export const getImageSize = async (url : string) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.src = url;
  });
}



export const ParseJson = (value : any) => {
	switch(typeof value){
		case 'string' :// JSON 안되기도 함
		try{
			return JSON.parse(value)
		}
		catch(ex){
			// SyntaxError:Unexpected end of JSON input 
			// SyntaxError:Unexpected token 'q', "q2" is not valid JSON 
			return value
		}
		case 'object' :
		case 'undefined' : // 안됨
		return value
		case 'boolean' : //됨
		case 'number' : // 됨
		return JSON.parse(JSON.stringify(value))
	}
}
export const includeCDN = (url: string) => {
    return url.includes("https://homecheck.kr/cdn")
}

export const translateCDN = (url: string) => {
	return url.includes("https://homecheck.kr/cdn/") ? url.replace("https://homecheck.kr/cdn/", "https://homecheck.kr/cdn") : url; 
}


export const DebugJsonObject = (obj : Object) =>{
	const output = {}
	for(let key in obj){
		if(!key.startsWith('__') && !key.endsWith('__')){
		    _.set(output, key, obj[key as keyof Object])
        }
	}
	return output
}


export const exceptCharacters = (text : string) => {
	const characters = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

	"!@#$%^&*()-_=+,<.>?|"

	return text.replace(characters, '')
}

export const getUnixtime = ()=> {
	return parseInt(`${Date.now()}`.slice(0,10))
  }

export const getRandomString = (length : number,withCharacter :Boolean) => {
	var charsNumber   = "0123456789";
	var charsLower    = "abcdefghijklmnopqrstuvwxyz";
	var charsUpper    = "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
	var charsSpecial  = "!@#$%^&*()-_=+,<.>?|";
	var charsAll      = [charsNumber,charsLower,charsUpper];  //  Include special character by default but allow checkbox to toggle option
	if(withCharacter) {  //  Evaluate checkbox status
		charsAll = [charsNumber,charsLower,charsUpper,charsSpecial];
	}
	var chars         = charsAll.join('');
	var randomString  = '';
	for (var i=0; i<length; i++) {                               // Get string length
		var randNum    = Math.floor(Math.random() * chars.length);      // and then
		randomString  += chars.substring(randNum,randNum+1);            // randomize it
	}

  return randomString
}


export const getToday = () =>{
    let today = new Date();
    let returnValue = `${today.getFullYear()}.${addZero((today.getMonth() + 1) , 2)}.${addZero(today.getDate(), 2)}`
    return returnValue
}

export const addZero = (number : number, length : number) => {
    let numStr= number.toString()
    return '0'.repeat((length - numStr.length) < 0 ? 0 : (length - numStr.length) ) + numStr
}

export const deleteProperty = (obj : any, path : string) => {
    return _.unset(obj, path)
}

export const getRandomInt = (min : number, max : number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const formatBytes = (bytes : number, decimals = 2) => {
	if (!+bytes) return '0 Bytes'
  
	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
	const i = Math.floor(Math.log(bytes) / Math.log(k))
  
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }


export const base64ToFile = async (base64 : string, filename: string, mime? : string):Promise<File> => {
	return new Promise(resolve => {
		fetch(mime ? `data:${mime};base64,${base64}` : `${base64}`).then((res) => {
			res.blob().then(async (blob) => {
				resolve(new File([blob], filename, { type: mime }))
			}).catch((_ex)=>{
				reject(_ex)
			})
		}).catch((ex)=>{
			reject(ex)
		})
	})
}

export const base64FromUrl2 = async (url : string) : Promise<string> => {
	return new Promise(resolve => {
		fetch(url).then(async (imageUrlData) => {
			/*
			const buffer = await imageUrlData.arrayBuffer();
			const stringifiedBuffer = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
			const contentType = imageUrlData.headers.get("content-type");
			const imageBase64 = `data:${contentType};base64,${stringifiedBuffer}`;
			*/
			resolve(`data:${imageUrlData.headers.get('content-type')};base64,${btoa(String.fromCharCode(...new Uint8Array(await imageUrlData.arrayBuffer())))}`);
		});
	})
}

export const base64FromUrl = async (url: string): Promise<string> => {
	return new Promise(resolve => {
	fetch(url).then(async (imageUrlData) => {
		/*
		const buffer = await imageUrlData.arrayBuffer();
		const stringifiedBuffer = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
		const contentType = imageUrlData.headers.get("content-type");
		const imageBase64 = `data:${contentType};base64,${stringifiedBuffer}`;
		*/
		arrayBufferToBase64(await imageUrlData.arrayBuffer(), resolve);
	});
})
}
function arrayBufferToBase64( buffer : ArrayBuffer, callback : ()=> void ) {
    var blob = new Blob([buffer],{type:'application/octet-binary'});
    var reader = new FileReader();
    reader.onload = function(evt){
        var dataurl = evt.target.result;
        callback(dataurl.substr(dataurl.indexOf(',')+1));
    };
    reader.readAsDataURL(blob);
}


export const isNumeric = (n: any) => {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

export const FitToSize = (width :number, height : number, fitWidth : number, fitHeight : number) : { width : number, height : number} => {

	// 0. width 와 height의 크기 비교는 되어서 들어옴

	//1. origin width 를 fit width 에 맞춤

	let calculatedWidth = 0;
	let calculatedHeight = 0;
	let calculatedScale = 0; // 비율
	if (width > fitWidth) {
		// 실제 width가 더 큰 경우
		calculatedWidth = fitWidth
		calculatedScale = fitWidth / width

		const estimateHeight = (height * calculatedScale)
		if (estimateHeight > fitHeight) {
			calculatedHeight = fitHeight;
			calculatedScale = fitHeight / estimateHeight
			calculatedWidth = calculatedWidth * calculatedScale
		}
		else {
			calculatedHeight = estimateHeight
		}
  }
	else {
		// 실제 width가 더 작은 경우
		calculatedWidth = width;
		calculatedScale = width / fitWidth

		const estimateHeight = height * calculatedScale;
		if (estimateHeight > fitHeight) {
			calculatedHeight = fitHeight;
			calculatedScale = fitHeight / estimateHeight;
			calculatedWidth = calculatedWidth * calculatedScale;
			} else {
			calculatedHeight = estimateHeight;
		}
	}
	





	return {
		width: calculatedWidth,
		height: calculatedHeight
	}
}


export default {
	exceptCharacters,
	getUnixtime,
	getRandomInt,
	getRandomString,
	getToday,
	addZero,
	deleteProperty,
	sleep,
	formatBytes,
	base64ToFile,
	isNumeric
}