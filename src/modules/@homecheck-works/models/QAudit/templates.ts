import { getRandomString, toImgUrl } from '@/modules/@homecheck/libs'

import type {SequenceRule, SequenceInput } from './types'
import type { Coordinate } from '../Common/path'
import {ConditionType, RecordDataStatus} from './enum'


// 템플릿은 기본 단위

export class HyundaiQAuditTemplate {
  _id: string = getRandomString(8, false);
  name: string = "";
  // cdn의 md5 key
  img: string = "";
  width: number = 0;
  height: number = 0;

  sequenceGroups: HyundaiQAuditTemplatesSequenceGroup[] = [];
  // 항목들을 별도로 데이터를 저장하고,
  // 묶음들을

  sequences: HyundaiQAuditTemplatesSequence[] = [];

  __deleted__: number = 0;


  toImgUrl() {
    return toImgUrl(this.img)
}


  static Parse(value: Partial<HyundaiQAuditTemplate>) {
    const output = new HyundaiQAuditTemplate();
    Object.assign(output, value);
    output.sequenceGroups = output.sequenceGroups.map((obj) => HyundaiQAuditTemplatesSequenceGroup.Parse(obj));
    output.sequences = output.sequences.map((obj) => HyundaiQAuditTemplatesSequence.Parse(obj));

    return output
  }
  getSequences() {
    return this.sequences.filter((seq) => seq.__deleted__ == 0);
  }

  getSequenceById(id : string){
    return this.sequences.find((seq) => seq._id == id)!
  }

  groupSequences(){
    let prev = ""
    let count = -1;
    const output = []
    for(let sequence of this.getSequences()){
      if(prev != sequence.category){
        output.push({
          category : sequence.category,
          items : [sequence]
        })
        prev = sequence.category
        count++;
        continue;
      }
      output[count].items.push(sequence)


    }

    return output
  }


  getSequenceGroups() {
    return this.sequenceGroups.filter((group) => group.__deleted__ == 0);
  }

  getSequenceGroupById(id : string) {
    return this.sequenceGroups.find(group => group._id == id)
  }


  getGroupIndexBySequenceId(id : string){
    return this.groupSequences().findIndex(group => group.items.find(seq => seq._id == id))
  }

  refreshId() {
    this._id = getRandomString(8, false);
  }
}



// SequenceGroup
// 위치 기반으로 그룹되어짐.

export class HyundaiQAuditTemplatesSequenceGroup {
  _id: string = getRandomString(8, false);
  name: string = "";
  category: string = "";
  memo: string = "";
  includedSequencecs: SequenceRule[] = [];
  __deleted__: number = 0;

  refreshId() {
    this._id = getRandomString(8, false);
  }


  getMarks() : SequenceRule[] {
    return this.includedSequencecs.filter(rule => rule.path.x != 0 || rule.path.y != 0)
  }


  getRule(sequence_id: string): SequenceRule {
    const found = this.includedSequencecs.find((rule) => rule.sequence_id == sequence_id);
    if (!found) {
      this.includedSequencecs.push({
        sequence_id,
        path: { x: 0, y: 0 },
        status : RecordDataStatus.Default
      })

      return this.getRule(sequence_id);
    }

    return found;
  }

  static Parse(value: Partial<HyundaiQAuditTemplatesSequenceGroup>) {
    const output = new HyundaiQAuditTemplatesSequenceGroup();
    Object.assign(output, value);
    return output
  }
}




export class HyundaiQAuditTemplatesSequence {
  _id: string = getRandomString(8, false);

    // 지도상에 표시되는 간단 메모
    name : string = ""
  description: string = "";
  category: string = "";
  memo: string = "";

    // 정상 범주 판단 방법
  condition: ConditionType = ConditionType.AND;
  inputs: SequenceInput[] = [];
  // True or False ?
  // 숫자 범위 ?

  __deleted__: number = 0;

    static Parse(value: Partial<HyundaiQAuditTemplatesSequence>) {
      const output = new HyundaiQAuditTemplatesSequence();
      Object.assign(output, value);
    return output
    }
  refreshId() {
    this._id = getRandomString(8, false);
  }
}