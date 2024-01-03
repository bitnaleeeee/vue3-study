import { encrypt, decrypt } from './index'

const EncryptKey = "1a5g7e1r4s"


export const decryptData = (data: any) => {
   return ParseJson(decrypt(data, EncryptKey));
}

export const encryptData = (data : any) => {
      let input = data == undefined ? null : data;
      if (typeof input == 'object') {
          input = JSON.stringify(input)
    }
    
    return encrypt(`${input}`, EncryptKey)
}


 const ParseJson = (value : any) => {
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