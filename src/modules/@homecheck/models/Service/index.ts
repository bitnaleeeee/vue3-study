import { GENERAL , GENERAL_DATA } from '../Inspections/data'
import { basic } from '../common'
import type { InspectionInfo } from '../Inspections'
import _ from 'lodash'

enum ServiceType {
    GENERAL = 'ST_G',// 사전 점검
    AFTER_GENERAL = 'ST_AG',// 사후 점검
    SAFETYDIAGNOSIS = 'ST_SAFE', // 안전 진단
}

// 서비스 시간쪽 클래스 빡세게 만들기
enum ServiceDateType {
    Period  = 'Period',   //기간
    Request = 'Request',   // 요청
    None    = '',         // 단일
}


type ServiceDate = {} | {
    time : string// '10:00~야근'
    enddate : string// '2023-05-24'
    startdate : string
}








type Apartment = {
    _id? : string
    name : string,
    address1 : string,
    address2 : string
}



type ServiceTarget = Apartment | {}


const ServiceTypeString : { [key in ServiceType] : string} = {
    [ServiceType.GENERAL] : '사전 점검',
    [ServiceType.AFTER_GENERAL] : '사후 점검',
    [ServiceType.SAFETYDIAGNOSIS] : '안전 진단'
}

type UserInfo = {
    name : string
}
export class Service extends basic{
    protected __logLimit__: number = 1000;
    service : ServiceReadOnly = new ServiceReadOnly()
    data : GENERAL_DATA  = new GENERAL_DATA()
    info : InspectionInfo = {
        contact : {
            phone : '',
            mail : ''
        },
        memo : '',
        team : [],
        equipment : ''
    }

    getPhone(){
        return this.info.contact.phone
    }

    // 데이터 추가 용
    addData(data : GENERAL){
        this.data.push(data)
        this.addLog('data.push', undefined, data)
    }
}

type ServiceReadOnlyType = {
    user_info : UserInfo
    type : ServiceType
    date : ServiceDate
    target : ServiceTarget
}

// App 용으로 치환해서 내보내는.
export class ServiceReadOnly implements ServiceReadOnlyType {
    user_info : UserInfo = { name : ''} // 클라이언트로 내려줄 때, 없애고 내려보내기?
    type : ServiceType = ServiceType.GENERAL
    date : ServiceDate = {}
    target : ServiceTarget = {}

    getServiceName(){
        return ServiceTypeString[this.type]
    
    }
    getUserName(){
        return this.user_info.name
    }

    static Parse(obj : ServiceReadOnlyType) : ServiceReadOnly {
        const output = new ServiceReadOnly();
        for(let key in obj){
            _.set(output, key, obj[key as keyof ServiceReadOnlyType])
        }
        return output
    }
}



export class ServiceRequest {
    user_id : string = '' // 클라이언트로 내려줄 때, 없애고 내려보내기?
    type : ServiceType = ServiceType.GENERAL
    date : ServiceDate = {}
    target : ServiceTarget = {}
}