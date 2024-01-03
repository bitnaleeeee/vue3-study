import { getRandomString } from "../../libs/min";
import _ from "lodash";

export namespace GENERAL_APP {
  //  *점검 목록 객체
  // construct 한 다음, json 방식으로 진행
  type ServiceItemType = {
    _id: string;
    name: string;
    date: string;
    schedule: string;
    caption: string;
    path: string;
    test: boolean;
  };
  export class ServiceItem {
    _id: string = getRandomString(8, false);
    name: string = "";
    date: string = "";
    schedule: string = "";
    caption: string = "";
    path: string = "";
    test: boolean = false;

    static Parse(obj: ServiceItemType): ServiceItem {
      const output = new ServiceItem();
      for (let key in obj) {
        _.set(output, key, obj[key as keyof ServiceItemType]);
      }
      return output;
    }

    isTestItem(number: Number) {
      this.test = true;
      this.name = `테스트${number}`;
    }
  }
}

// 점검 그룹

// App 자체
