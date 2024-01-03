import type {Coordinate} from '../Common/path'
import type { RecordDataStatus, InputType, ConditionNumber } from './enum'


export type SequenceInput = {
  type: InputType;

    name: string;
    

    value_default_string: string;
    value_default_number: number;
    value_default_boolean: boolean;



    value_number_conditions: SequenceInputNumberCondition[];
  value_number_unit: string;

  value_boolean_true: string;
  value_boolean_false: string;
};


export type SequenceInputNumberCondition = {
    condition: ConditionNumber
    value: number;
}




export type SequenceValue = {
  value_string: string;

  value_number: number;

  value_boolean: boolean;

  result: boolean;
};



export type SequenceRule = {
  group_id? : string;
  sequence_id: string;
  status: RecordDataStatus;
  path: Coordinate;
};


// 조건에 따라 status를 변경해야 함
export type RecordRule = {
    // 속성 이름
    property: string;
    
    // 속성 값
    target: string;

    // 변화할 status
    status : RecordDataStatus
}