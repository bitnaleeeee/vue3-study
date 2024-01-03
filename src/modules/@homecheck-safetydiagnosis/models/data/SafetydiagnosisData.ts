import { getRandomString, getUnixtime } from "@/modules/@homecheck/libs/min";

import { data } from "./reference";
import { DataTypes, DataTypesString } from "./enum";
import type { pathShape, PathShape, Render } from "../values/render";
import type { AvailableValue } from "./types";

import {
  safetyInspection,
  AppearenceInspection,
  SafetyInspectionBasicValue,
  type appearenceType,
  type inspectionsType,
  StaticValues,
  staticValue,
  appearenceInspection,
  AreaValue,
  CrackValue,
  EtcValue,
  LengthValue,
  MultiValue,
  CarbonationValue,
  MeasurementValue,
  RebarValue,
  SchmidtValue,
  SlopeValue,
  SubsidenceValue,
} from "../values";

export type SafetydiagnosisDataType = {
  _id: string;
  values: AvailableValue[];
  floorplans_id?: string;
  floorplan_id: string;
  schedule_id: string;
  render?: Render;
  path?: PathShape;

  __skip__: boolean;
  __deleted__: number;
  type?: DataTypes;
} & data;

// 사전점검 데이터
export class SafetydiagnosisData extends data {
  _id: string = getRandomString(10, false);
  type: DataTypes = DataTypes.SAFETYDIAGNOSIS;
  values: AvailableValue[] = [];

  floorplans_id: string = ""; // 건축물의 아이디
  floorplan_id: string = ""; // 평면도의 아이디
  schedule_id: string = ""; // 기록의 id
  render?: Render;
  path?: PathShape;

  __skip__: boolean = false;
  __deleted__: number = 0;

  isPrevious(scheduleId: string) {
    return this.schedule_id != scheduleId;
  }

  setRender(render: Partial<Render>) {
    this.render = render;
  }

  getValues() {
    return this.values.filter((_value) => _value.__deleted__ < 1);
  }

  getValueById(valueId: string) {
    return this.getValues().find((_item) => _item._id == valueId);
  }
  getValueByIdWithDeleted(valueId: string) {
    return this.values.find((_item) => _item._id == valueId);
  }

  getValuesOnlyMaterials() {
    return this.getValues().filter((_item) => _item.type == safetyInspection.CarbonationValue || _item.type == safetyInspection.RebarValue || _item.type == safetyInspection.SchmidtValue);
  }

  getValuesOnlyMeasurements() {
    return this.getValues().filter((_item) => _item.type == safetyInspection.MeasurementValue);
  }

  movePath(value: number, property: string) {
    if (!this.path) return;
    switch (property) {
      case "x":
        this.path!.x = value;
        break;
      case "y":
        this.path!.y = value;
        break;
    }
  }

  movePathRelative(value: number, property: string) {
    if (!this.path) return;
    switch (property) {
      case "x":
        this.path!.x = this.path!.x + value;
        break;
      case "y":
        this.path!.y = this.path!.y + value;
        break;
    }
  }

  createdString() {
    return new Date(this.__created__ * 1000).toLocaleString();
  }
  getLength() {
    return this.getValues().length;
  }
  getPathShapeType() {
    return this.path!.type;
  }
  setPathShapeType(shape: pathShape) {
    this.path!.type = shape;
  }
  addItem(type?: appearenceInspection | safetyInspection): AppearenceInspection | SafetyInspectionBasicValue | undefined {
    if (type) {
      switch (type) {
        case appearenceInspection.AreaValue:
          return new AreaValue();
        case appearenceInspection.CrackValue:
          return new CrackValue();
        case appearenceInspection.EtcValue:
          return new EtcValue();
        case appearenceInspection.LengthValue:
          return new LengthValue();
        case appearenceInspection.MultiValue:
          return new MultiValue();
        case safetyInspection.CarbonationValue:
          return new CarbonationValue();
        case safetyInspection.MeasurementValue:
          return new MeasurementValue();
        case safetyInspection.RebarValue:
          return new RebarValue();
        case safetyInspection.SchmidtValue:
          return new SchmidtValue();
        case safetyInspection.SlopeValue:
          return new SlopeValue();
        case safetyInspection.SubsidenceValue:
          return new SubsidenceValue();
      }
    }

    switch (this.type) {
      case DataTypes.SAFETYDIAGNOSIS_APPEARENCE:
        return new AppearenceInspection();
        break;
      case DataTypes.SAFETYDIAGNOSIS_INSPECTION:
        return new SafetyInspectionBasicValue();
        break;
      default:
        return undefined;
    }
  }
  pushItem(input: AvailableValue) {
    this.values.push(input);
  }

  delete() {
    this.__deleted__ = getUnixtime();
  }

  addPushItem(type?: appearenceInspection | safetyInspection) {
    const _pushItem = this.addItem(type);
    if (_pushItem) {
      this.pushItem(_pushItem);
    }
    return _pushItem;
  }
  setPathShape(path: PathShape) {
    this.path = path;
  }
  setScheduleId(Id: string): void {
    this.schedule_id = Id;
  }
  setFloorplanId(Id: string): void {
    this.floorplan_id = Id;
  }
  setFloorplansId(Id: string): void {
    this.floorplans_id = Id;
  }
  setDataType(types: DataTypes): void {
    this.type = types;
  }

  getScheduleIdString(cheatsheet: { string: string }) {
    return this.schedule_id == "Annonymous" ? "정확하지 않음" : cheatsheet[this.schedule_id];
  }

  Parser(input: inspectionsType | appearenceType) {
    switch (this.type) {
      case DataTypes.SAFETYDIAGNOSIS_APPEARENCE:
        return AppearenceInspection.Parser(input as appearenceType);
      case DataTypes.SAFETYDIAGNOSIS_INSPECTION:
        return SafetyInspectionBasicValue.Parser(input as inspectionsType);
      case DataTypes.SAFETYDIAGNOSIS_STATIC:
        return StaticValues.Parser(input);
    }
  }

  updateValue(item: AvailableValue) {
    let output;
    this.values = this.values.map((_item) => {
      if (_item._id == item._id) {
        output = this.Parser(item);

        return output;
      }
      return _item;
    });

    return output;
  }

  isAppearence(): boolean {
    return this.type == DataTypes.SAFETYDIAGNOSIS_APPEARENCE;
  }
  isInspections(): boolean {
    return this.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION;
  }
  isNew() {
    return this.type == DataTypes.SAFETYDIAGNOSIS;
  }

  getTitleString() {
    return this.type == DataTypes.SAFETYDIAGNOSIS ? "미지정" : DataTypesString[this.type];
  }
  getValueByType(type: staticValue | safetyInspection) {
    return this.getValues().find((_item) => _item.type == type);
  }
  getValuesByType(type: staticValue | safetyInspection) {
    return this.getValues().filter((_item) => _item.type == type);
  }

  static Parse(data: SafetydiagnosisDataType): SafetydiagnosisData {
    const output = new SafetydiagnosisData();
    //value를 제외한 모든 항목 반영
    for (let key in data) {
      if (key == "values") {
        continue;
      }
      output[key] = data[key];
    }
    output.values = data.values.map((_item) => {
      switch (data.type) {
        case DataTypes.SAFETYDIAGNOSIS:
          return;
          break;
        case DataTypes.SAFETYDIAGNOSIS_APPEARENCE:
          return AppearenceInspection.Parser(_item as appearenceType);
        case DataTypes.SAFETYDIAGNOSIS_INSPECTION:
          return SafetyInspectionBasicValue.Parser(_item as inspectionsType);
        case DataTypes.SAFETYDIAGNOSIS_STATIC:
          return StaticValues.Parser(_item);

          break;
      }
    });
    return output;
  }
}
