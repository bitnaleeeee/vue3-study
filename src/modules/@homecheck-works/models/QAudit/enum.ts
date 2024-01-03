export enum RecordDataStatus {
    Unavailable = "unavailable",
    Hidden = "hidden",
    NotEnoughProgress = "not-enough",

    Default = "default",

}


export const RecordDataStatusString: { [key in RecordDataStatus]: string } = {
  [RecordDataStatus.Unavailable]: "해당되지 않음",
  [RecordDataStatus.Hidden]: "육안 식별 불가능",
  [RecordDataStatus.NotEnoughProgress]: "시공/ 공사 되지 않음",

  [RecordDataStatus.Default]: "지정되지 않음",
};

export enum RecordDataType {
  Sequence, // 일반 체크리스트를 따라가는 경우
  Exception, // 예외사항 발견시
}



export enum InputType {
  Number,
  String,
  Boolean
}

export const InputTypeString : { [key in InputType] : string} = {
  [InputType.Number]: '숫자',
  [InputType.String]: "문자열",
  [InputType.Boolean] : "명제"
}


export enum ConditionType {
  AND,
  OR
}


export const ConditionTypeString: { [key in ConditionType]: string } = {
  [ConditionType.AND]: "모두 참인 경우",
  [ConditionType.OR] : "하나라도 참인 경우"
}

export enum ConditionNumber {
  Exceed,
  Over,
  Equal,
  Under,
  Less
}

export const ConditionNumberString: { [key in ConditionNumber]: string } = {
  [ConditionNumber.Exceed]: "초과",
  [ConditionNumber.Over]: "이상",
  [ConditionNumber.Equal]: "같음",
  [ConditionNumber.Under]: "이하",
  [ConditionNumber.Less] : "미만"
}
