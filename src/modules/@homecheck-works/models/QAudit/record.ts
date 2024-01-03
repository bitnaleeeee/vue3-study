import { getRandomString, getUnixtime } from "@/modules/@homecheck/libs";
import { CacheImage } from '@/modules/@homecheck/libs/CacheStorage'

import { LoggingModel } from '../Common/log'

import type { RecordRule, SequenceValue, SequenceRule } from './types'
import { RecordDataType, RecordDataStatusString, RecordDataStatus } from "./enum";
import { imgType, type img } from '../Common/img'
import type { HyundaiQAuditTemplatesSequence } from "./templates";




//HyundaiQAudit > Record > RecordData
export class HyundaiQAuditRecord {
  _id: string = getRandomString(8, false);
  name: string = "";
  description: string = "";
  template_id: string = "";

  data_id : string = "";
  data: HyundaiQAuditRecordData[] = [];
  permission: string[] = [];
  rules: SequenceRule[] = [];

  // 초기화 하기.
  init() {}
  // 규칙 적용하기
  applyRule() {}
  __deleted__: number = 0;


  syncStatus(){
    for(let record_data of this.data){
      const found = this.rules.find(rule => 
        rule.sequence_id == record_data.sequence_id
         && rule.group_id == record_data.group_id
         )
      if(!found) continue;

      record_data.status = found.status
    }
  }

  merge(recordDatas : HyundaiQAuditRecordData[]){
    const intersectedId : string[] = []
    // 1. group_id 와 sequence_id가 겹치는 항목.
    for(let record_data of this.data){
      const findData = recordDatas.find(_data =>  _data.sequence_id == record_data.sequence_id &&  _data.group_id == record_data.group_id)
      if(!findData){
        continue;
      }

      // modified 계산
      // memo
      if(record_data.memo != findData.memo){
        if(record_data['memo:modified'] < findData['memo:modified']){
          record_data.memo = findData.memo
          record_data['memo:modified'] = findData['memo:modified']
        }
      }




      // value
      const values = record_data.value.length >= findData.value.length ? record_data.value : findData.value

      for(let i = 0; i < values.length; i++){
        const _record_data = record_data.value[i]
        const _find_data = findData.value[i]

        if(! _find_data){
          continue;
        }

        if(!_record_data){

          record_data.value[i] = findData.value[i]
          record_data['value:modified'][i] = findData['value:modified']
        }
        else if(record_data['value:modified'][i] < findData['value:modified']){
          record_data.value[i] = findData.value[i]
          record_data['value:modified'][i] = findData['value:modified']
        }


      }















      const intersectionImgIds : string[] = []
      // imgs
      for(let img of record_data.imgs){
        const findImg = findData.imgs.find(_img => _img._id == img._id)
        if(!findImg){
          continue;
        }
        intersectionImgIds.push(findImg._id)

        if(img.__modified__ < findImg?.__modified__){
          img.__modified__ = findImg.__modified__;
          img.__deleted__ = findImg.__deleted__;
          img.memo = findImg.memo;
          img.type = findImg.type;
          img.value = findImg.value;
        }
      }
      record_data.imgs.push(...findData.imgs.filter(_img => !intersectionImgIds.includes(_img._id)))


      











      // 겹치는 항목 합치기
      intersectedId.push(findData._id)
    }

    // 2. 위에서 겹치지 않는 항목

    for(let record_data of recordDatas.filter(_data => !intersectedId.includes(_data._id))){
      this.data.push(record_data)
    }

  }






  static Parse(value: Partial<HyundaiQAuditRecord>) {
    const output = new HyundaiQAuditRecord();

    output.data = output.data.map((obj) => HyundaiQAuditRecordData.Parse(obj));

    return Object.assign(output, value);
  }

  findRule(group_id : string, sequence_id: string): SequenceRule | undefined {
    return this.rules.find((rule) => rule.sequence_id == sequence_id && rule.group_id == group_id);
  }

  getRule(group_id : string, sequence_id: string): SequenceRule {
    const found = this.rules.find((rule) => rule.sequence_id == sequence_id && rule.group_id == group_id);
    if (!found) {
      this.rules.push({
        group_id,
        sequence_id,
        path: { x: 0, y: 0 },
        status : RecordDataStatus.Default
      })

      return this.getRule(group_id, sequence_id);
    }

    return found;
  }

  addRule(value : SequenceRule){
    this.rules.push(value)
  }


  isValueValid(group_id : string, sequence_id: string, sequence : HyundaiQAuditTemplatesSequence){
    return this.findData(group_id, sequence_id)?.isValid(sequence.inputs.length)
  }

  findData(group_id : string, sequence_id: string) : HyundaiQAuditRecordData | undefined{
    const found =  this.data.find(data => data.sequence_id == sequence_id && data.group_id == group_id)
    return found
  }
  addData(group_id : string, sequence_id: string, status : RecordDataStatus){
    const newData = new HyundaiQAuditRecordData()
    newData.group_id = group_id;
    newData.sequence_id = sequence_id;
    newData.status = status
    
    this.data.push(newData)
    return newData
  }

  refresh() {
     this.data = this.data.map((obj) => HyundaiQAuditRecordData.Parse(obj));
  }
}


export class HyundaiQAuditRecordData extends LoggingModel {
  _id: string = getRandomString(8, false);
  group_id: string = "";
  sequence_id: string = ""; // SequenceId || ""
  type: RecordDataType = RecordDataType.Sequence;
  status: RecordDataStatus = RecordDataStatus.Default;
  memo: string = "";
  value: SequenceValue[] = [];
  imgs: img[] = [];

  isValid(length : number){
    return this.value.filter(val => val != undefined && val != null).length == length
  }

  getImgs(){
    return this.imgs.filter(img => img.__deleted__ == 0)
  }

  async addImg( file : File){
    const imgKey = getRandomString(32,false);
    await CacheImage.insertFile(`http://localhost/${imgKey}`, file, 'addImg')
    this.imgs.push({
      _id: getRandomString(6,false),
      type : imgType.Local,
      memo : "",
      value : imgKey,
      __deleted__ : 0,
      __modified__ : getUnixtime()
    })

  }

  deleteImg(id : string){
    const img = this.imgs.find(img => img._id = id)
    if(img ){
      img.__deleted__ = getUnixtime();
      img.__modified__ = getUnixtime();
    }
  }

  static Parse(value: Partial<HyundaiQAuditRecordData>) {
    const output = new HyundaiQAuditRecordData();
    return Object.assign(output, value);
  }
}

// target:

// QAudit 도중 발생하는 이벤트 기록
export class HyundaiQAuditRecordLog {

}