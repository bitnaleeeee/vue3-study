import { encrypt, decrypt } from "../Encrypt";
import { ParseJson } from "../Functions";

const EncryptKey = "ug8w1a3fj0";

function EncryptData(value: any) {
  return encrypt(JSON.stringify(value), EncryptKey);
}

function DecryptData(value: string) {
    return ParseJson(decrypt(value, EncryptKey))
}



export default {
    EncryptData,
    DecryptData
}