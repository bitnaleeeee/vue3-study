import _ from "lodash";
import { getRandomString } from "@/modules/@homecheck/libs/min";

import type { appearenceInspection } from "../values";
import type { safetydiagnosisChecklistDataType, safetydiagnosisChecklist, SafetydiagnosisRepairs, SafetydiagnosisSites, SafetydiagnosisAppearences } from "./types";

import { SafetydiagnosisChecklistDataType } from "./enum";

export class SafetydiagnosisChecklist {
  _id: string = "";
  data: safetydiagnosisChecklistDataType[] = [];

  static Parse(input: safetydiagnosisChecklist): SafetydiagnosisChecklist {
    const output = new SafetydiagnosisChecklist();
    if(input){
      output._id = input._id;
      output.data = input.data;
    }
    return output;
  }

  protected getList(type: SafetydiagnosisChecklistDataType): safetydiagnosisChecklistDataType[] {
    const output = this.data.filter((_item) => _item.type == type);
    return output;
  }

  getItem(id: string) {
    return this.data.find((item) => item._id == id);
  }
  getSiteItems() {
    return this.getList(SafetydiagnosisChecklistDataType.Sites);
  }

  getAppearenceItems(category: appearenceInspection) {
    return this.getList(SafetydiagnosisChecklistDataType.Appearences).filter((_item) => _item.category == category);
  }

  getRepairItems() {
    return this.getList(SafetydiagnosisChecklistDataType.Repairs);
  }

  getRepairItem(repairId: string) {
    const output = this.getList(SafetydiagnosisChecklistDataType.Repairs).filter((_item) => _item._id == repairId)[0] as SafetydiagnosisRepairs;
    return output ? output : { name: "선택되지 않음" };
  }

  getRepairsKeyName() {
    const arr = this.getList(SafetydiagnosisChecklistDataType.Repairs);
    const output = {};
    for (let item of arr) {
      output[item._id] = item.name;
    }
    return output;
  }

  getRepairsKeyPPU() {
    const arr = this.getList(SafetydiagnosisChecklistDataType.Repairs);
    const output = {};
    for (let item of arr as SafetydiagnosisRepairs[]) {
      output[item._id] = item.ppu ? item.ppu : 0;
    }
    return output;
  }
  getKeyValue(type: SafetydiagnosisChecklistDataType, key: string, value: string) {
    const filtered = this.data.filter((_item) => _item.type == type);
    const output = {};
    for (let item of filtered) {
      output[key] = item[value];
    }
    return output;
  }

  addItem(type: SafetydiagnosisChecklistDataType, value: safetydiagnosisChecklistDataType) {
    console.log('addItem')
    switch (type) {
      case SafetydiagnosisChecklistDataType.Appearences:
        const aValue = value as SafetydiagnosisAppearences;
        this.data.unshift({
          _id: getRandomString(4, false),
          name: aValue.name,
          type: type,
          category: aValue.category,
          formula: aValue.formula,
          repair_id: aValue.repair_id,
        } as SafetydiagnosisAppearences);
        break;
      case SafetydiagnosisChecklistDataType.Repairs:
        const rValue = value as SafetydiagnosisRepairs;
        this.data.unshift({
          _id: getRandomString(8, false),
          name: rValue.name,
          type: type,
          ppu: rValue.ppu,
        });
        break;
      case SafetydiagnosisChecklistDataType.Sites:
        const sValue = value as SafetydiagnosisSites;
        this.data.unshift({
          _id: getRandomString(4, false),
          name: sValue.name,
          type: type,
        });
        break;
    }
  }
}
