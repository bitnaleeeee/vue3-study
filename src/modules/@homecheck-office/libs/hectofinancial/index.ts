export * from './const'

import {
  PaymentMethod, getParams, getData, getPktHash, convertAES, getUrl, convertDecrypted, checkResponse,
resolveResponse,
translateBody} from './const'
import { HectoRequest, HectoOrderInfo, HectoResponse } from './types'
import axios from 'axios'



export const request = (method: PaymentMethod, order : Partial<HectoOrderInfo>) => {
  const requestURL = getUrl(method);
  const requestBody: HectoRequest = {
    params: { ...getParams(method)},
    data: {
      ...getData(method, order),
      prdtNm : order.productName,
      sellerNm: "주식회사 홈체크",
      trdAmt : `${order.price}`
    }
  }
  // mobileYn
  // osType

  // AES 암호화, OrderId 생성, PktTash 생성
  translateBody(requestBody)
  
  return new Promise((resolve, reject) => {
  axios
    .post(requestURL, requestBody)
    .then(({ data }) => {
      const response = data as HectoResponse;
      // AES 암호화 해제
      convertDecrypted(response)

      if (!checkResponse(response, order)) {
        return reject({
          code: "999999",
          message : "결제 요청에 실패하였습니다."
        })
      } 

      return resolve({
        code: "0",
        data: resolveResponse(method, response)
      });
    })
    .catch((ex) => {
      return reject({
        code: "999999",
        message: "결제 요청에 실패하였습니다.",
      });
    });  
  })
  

}