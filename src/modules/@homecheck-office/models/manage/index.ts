import type { ApartmentScheduleType } from './type'

export class OfficeApartments {
  id: number = 0;
  name: string = "";
  app_method: number = 0;
  //주관사
  broker: string = "";

  schedules: ApartmentScheduleType[] = [];

  // TODO : 가격표
  pricetable: ApartmentScheduleType[] = [];

  memo: string = "";
  static Parse(input: Partial<OfficeApartments>): OfficeApartments {
    const output = new OfficeApartments();
    Object.assign(output, input);
    return output;
  }
}

// 추후 지정
export class OfficeWorker {



}
