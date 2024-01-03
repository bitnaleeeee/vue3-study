import type { HectoBody, HectoParams, HectoRequest, HectoOrderInfo, HectoResponse} from './types'
import { aes256, sha256, decryptAes256 } from './encrypter'
import { financialName } from './alias'
import moment from 'moment'

const AES_CONVERT_PROPERTY_LIST = [
  "vAcntNo", "trdAmt", "taxAmt", "vatAmt", "taxFreeAmt", "escrPwd",
  "csrcRegNo"]
const AES_DECRYPT_PROPERTY_LIST = [
  "vAcntNo", "trdAmt"
]
//라이센스 키 : 위변조 방지를 위해 해쉬값 생성에 필요한 키
const TEST_HASH_KEY = "ST1009281328226982205";

//암복호화 키 : 전자결제창 연동 시 민감정보 암복호화에 사용되는 암호화키
const TEST_AES256_KEY = "pgSettle30y739r82jtd709yOfZ2yK5K";

const MAX_EXPIRE_DAY = 3;


function getHashKey() {
  return isDevMode() ? TEST_HASH_KEY : "";
}
function getAES256Key() {
  return isDevMode() ? TEST_AES256_KEY : "";
}





export enum PaymentMode {
  Development = "dev",
  Production = "p",
}

export enum PaymentMethod {
  VirtualAccount = "va",
  All = "a",
}

var paymentMode = PaymentMode.Development


//pktHash = 거래일자 + 거래시간 + 상점아이디 + 상점주문번호 + 거래금액(평문) + 해쉬키

export const setPaymentMode = (mode: PaymentMode) => {
  paymentMode = mode
}

function isDevMode() {
  return paymentMode == PaymentMode.Development;
}

function getDomain(method: PaymentMethod) {
  let output;
  switch (method) {
    case PaymentMethod.All:
      break;
    case PaymentMethod.VirtualAccount:
      output = isDevMode() ? "tbgw" : "gw"
      break;
    default:
      output = ""
      break;
  }
  return `https://${output}.settlebank.co.kr`
}

export const getUrl : (method:PaymentMethod)=> string = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.All:
      return ""
    case PaymentMethod.VirtualAccount:
      return `${getDomain(method)}/spay/APIVBank.do`
    default: 
      return ""
  }

}

export const getParams : (method : PaymentMethod)=>Partial<HectoParams> = (method : PaymentMethod) => {
  switch (method) {
    case PaymentMethod.All:
      return {}
    case PaymentMethod.VirtualAccount:
      return {
        mchtId: 'nx_mid_il',
        ver: '0A19',
        method: "VA",
        bizType: "A0",
        encCd: "23",
        trdDt: getTrdDt(),
        trdTm : getTrdTm()
      }
    default: 
      return {}
  }
}

export const getData: (method: PaymentMethod, order : Partial<HectoOrderInfo>) => Partial<HectoBody> = (method: PaymentMethod, order : HectoOrderInfo) => {
  let output : Partial<HectoBody> = {}
  
  switch (method) {
    case PaymentMethod.All:
      output = {};
      break;
    case PaymentMethod.VirtualAccount:
      output = {
        bankCd: "004",
        acntType: "1",
        taxTypeCd: "N",
        escrAgrYn: "N",
        ordNm: order.orderName,
        dpstrNm: `홈체크_${order.orderName}`,
        csrclssReqYn : order.csrclssReqYn,
        expireDate: `${moment().add(MAX_EXPIRE_DAY, "days").format("YYYYMMDD")}235959`,
      };
      break;
    default:
      return {};
  }
  if (output.csrclssReqYn == "Y") {
    output.cashRcptPrposDivCd = order.cashRcptPrposDivCd;
    output.csrcRegNoDivCd = order.csrcRegNoDivCd;
    output.csrcRegNo = order.csrcRegNo
  }


  return output
};



export const getTrdDt = () => {
  return moment().format("YYYYMMDD");
}

export const getTrdTm = () => {
  return moment().format("HHmmss")
}


export const getPktHash = (request: HectoRequest) => {
  const plainText = `${request.params.trdDt!}${request.params.trdTm!}${request.params.mchtId}${request.params.mchtTrdNo}${request.data.trdAmt}${getHashKey()}`;

  return sha256(plainText);
};


export const checkResponse: (response: HectoResponse, order : HectoOrderInfo) => boolean = (response: HectoResponse, order : HectoOrderInfo) => {
  if (response.params.outRsltCd != "0000") {
    return false;
  }
  else if (response.data.trdAmt != order.price) {
    // 정해진 금액과 맞는지
    return false;
  }

  return true

}

export const translateBody = (request: HectoRequest) => {
    request.params.mchtTrdNo = `order_${request.params.trdDt}${request.params.trdTm}${Date.now()}`;
    request.data.pktHash = getPktHash(request);

    // 마지막 보내기전에 각 항목들 AES로 암호화
    convertAES(request);
}


export const resolveResponse = ( method : PaymentMethod, response: HectoResponse) => {
  switch (method) {
    case PaymentMethod.All:
      break;
    case PaymentMethod.VirtualAccount:
      return {
        orderId : response.params.mchtTrdNo,
        bank: financialName[response.data.bankCd!],
        expireDate: response.data.expireDate,
        account: response.data.vAcntNo,
        price : response.data.trdAmt
      };
      break;
  }
}


export const convertAES = (request: HectoRequest) => {
  for (const property of AES_CONVERT_PROPERTY_LIST) {
    if (request.data[property]) {
      request.data[property] = aes256(request.data[property], getAES256Key());
    }
    else if (request.params[property]) {
      request.params[property] = aes256(request.params[property], getAES256Key());
    }
  }
}


export const convertDecrypted = (response : HectoResponse) => {

    for (const property of AES_DECRYPT_PROPERTY_LIST) {
      if (response.data[property]) {
        response.data[property] = decryptAes256(response.data[property], getAES256Key());
      } else if (response.params[property]) {
        response.params[property] = decryptAes256(response.params[property], getAES256Key());
      }
    }
}