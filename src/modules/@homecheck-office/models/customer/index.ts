export class OfficeCustomer {
  id: number = 0;
  name: string = "";
  constractor: string = "";
  tel1: string = "";
  tel2: string = "";
  tag: string = "";
  email: string = "";

  static Parse(input: Partial<OfficeCustomer>): OfficeCustomer {
    const output = new OfficeCustomer();
    Object.assign(output, input);
    return output;
  }
}

export class OfficeSurvey {
  id: number = 0;
  type: string = "";

  // Cheatsheet에서 index에 따라 매칭시켜 값으로 변환
  value: number[] = [];
  customer_id: number = 0;
  timestamp: string = "";

  static Parse(input: Partial<OfficeSurvey>): OfficeSurvey {
    const output = new OfficeSurvey();
    Object.assign(output, input);
    return output;
  }
}

// 1. 한번 등록시 절대로 변경할 수 없음.
export class OfficeSurveyCheatsheet {
  id: number = 0;
  data: object = [];
  timestamp: string = "";

  static Parse(input: Partial<OfficeSurveyCheatsheet>): OfficeSurveyCheatsheet {
    const output = new OfficeSurveyCheatsheet();
    Object.assign(output, input);
    return output;
  }
}