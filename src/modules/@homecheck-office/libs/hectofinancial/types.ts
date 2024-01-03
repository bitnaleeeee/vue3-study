


export type HectoOrderInfo = {
  productName: string;
  orderName: string;
    price: string | number;
    email: string;


    csrclssReqYn: "Y" | "N";
    cashRcptPrposDivCd?: "0" | "1"
    csrcRegNoDivCd?: "1" | "2" | "3" | "4"
    csrcRegNo? : string
};


export type HectoRequest = {
    params: Partial<HectoParams>,
    data : Partial<HectoBody>
}


export type HectoResponse = {
  params: Partial<HectoResponseParams>;
  data: Partial<HectoResponseData>;
};



export type HectoParams = {
    mchtId   : "nx_mid_il" | "nxva_fix" | "nxva_fix2",
    ver      : "0A19",
    method   : "VA",
    encCd    : "23",
    mchtTrdNo: string,
    trdDt    : string,
    trdTm    : string,
    mobileYn : "Y" | "N",
    osType   : "A" | "I" | "W" | "M" | "E"
}


export type HectoBody = {
    pktHash           : string;
    bankCd            : string;
    acntType          : "1" | "2" | "3";
    vAcntNo           : string;
    expireDate        : string;
    prdtNm            : string;
    sellerNm          : string;
    ordNm             : string;
    trdAmt            : string;
    dpstrNm           : string;
    taxTypeCd         : "N" | "Y" | "G";
    escrAgrYn         : "Y" | "N";
    csrclssReqYn      : "Y" | "N";
    cashRcptPrposDivCd: "1" | "0";              //0:소득증빙용, 1:지출증빙용
    csrcRegNoDivCd    : "1" | "2" | "3" | "4";  //1:카드, 2:주민번호, 3:사업자번호, 4:휴대폰번호
    csrcRegNo         : string;
    email             : string;
    notiUrl           : string;
    mchtParam         : string;
    mchtCustld        : string;
};


export type HectoResponseParams = {
    mchtId: string;
    ver: string;
    bizType: string;
    encCd: string;
    mchtTrdNo: string;
    trdNo: string;
    trdDt: string;
    trdTm: string;
    outStatCd: string;
    outRsltCd: string;
    outRsltMsg: string;
}

export type HectoResponseData = {
    pktHash: string;
    bankCd: string;
    vAcntNo: string;
    expireDate: string;
    trdAmt: string;
    acntType : string
}