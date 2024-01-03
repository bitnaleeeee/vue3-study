import _ from "lodash";

import { getRandomString, getUnixtime } from "@/modules/@homecheck/libs/min";

import { AreaPercent, appearenceInspection } from "./appearence";
import { _basic, _static } from "./common";
import { safetyInspection, FixedSite, grade, type inspectionsType } from "./inspection";
import { DataTypes } from "../data";

export enum staticValue {
  Environments = "en",
  ScoreSupports = "ssp", // 상태평가 계산 서포트용
  StandardFloor = "stf",
}

export enum FixedEnvironment {
  Foreground = "fo",
  FallPreventionFacility = "fa",
  RoadPavement = "rp",
  RoadExpansionJoint = "re",
  Vent = "v",
  Catwalk = "c",
  Facilities = "fac",
}
export const FixedEnvironmentString: { [key in FixedEnvironment]: string } = {
  [FixedEnvironment.Foreground]: "전경",
  [FixedEnvironment.FallPreventionFacility]: "추락방지시설",
  [FixedEnvironment.RoadPavement]: "도로 포장",
  [FixedEnvironment.RoadExpansionJoint]: "도로 신축이음부",
  [FixedEnvironment.Vent]: "환기구",
  [FixedEnvironment.Catwalk]: "캣워크",
  [FixedEnvironment.Facilities]: "부대시설",
};

/**
 * 환경 요소
 *
 * 전경, 추락방지시설, 도로포장, 도로부 신축이음부, 환기구, 부대시설, 캣워크
 */

type ScoreSupportValueType = appearenceInspection.CrackValue | appearenceInspection.AreaValue | safetyInspection.CarbonationValue | safetyInspection.RebarValue | safetyInspection.SchmidtValue;

/**
 * STATIC 의 기본 값, 직접적으로 이용되진 않으며, 중간 다리용
 * */
export class StaticValues extends _static {
  type: staticValue = staticValue.Environments;
  static Parser(input: { type: staticValue }): Environments | ScoreSupports | StandardFloor {
    let output;
    switch (input.type) {
      case staticValue.Environments:
        output = new Environments();
        break;
      case staticValue.ScoreSupports:
        output = new ScoreSupports();
        break;
      case staticValue.StandardFloor:
        output = new StandardFloor();
        break;
      default:
        output = new Environments();
        break;
    }
    Object.assign(output, input);
    return output;
  }
}

export class Environments extends StaticValues {
  type: staticValue = staticValue.Environments;
  value: FixedEnvironment = FixedEnvironment.Vent;
  getValueString() {
    return FixedEnvironmentString[this.value];
  }
}

export class ScoreSupports extends StaticValues {
  type: staticValue = staticValue.ScoreSupports;

  grade: grade = grade.A;
  area = undefined;

  data_type: DataTypes.SAFETYDIAGNOSIS_APPEARENCE | DataTypes.SAFETYDIAGNOSIS_INSPECTION = DataTypes.SAFETYDIAGNOSIS_APPEARENCE;
  value_type: ScoreSupportValueType = appearenceInspection.CrackValue;
  fixedSite: FixedSite = FixedSite.Beam;
  value: "구조체 균열" | "박리" | "박락, 층분리" | "누수, 백태" | "철근 노출" = "구조체 균열";
  quantity: number = 0;

  get writeonly__quantity() {
    return this.quantity;
  }
  set writeonly__quantity(val: number) {
    this.quantity = val;
    this.__modified__ = getUnixtime();
  }
}

type FloorType = {
  floor: number;
  _id: string;
  name: string;
};

type StandardFloorType = {
  includedFloor: FloorType[];
} & FloorType;

export class StandardFloor extends StaticValues {
  type: staticValue = staticValue.StandardFloor;
  min: number = 0; // 최소 표본층 수
  values: StandardFloorType[] = [];
  included: string[] = [];
  init() {
    for (let i = 0; i < this.min; i++) {
      this.values.push({
        floor: 0,
        _id: "",
        name: "설정되지 않음",
        includedFloor: [],
      });
    }
  }

  get readonly_included() {
    return this.refreshIncludedId();
  }
  set readonly_included(val) {
    this.included = val;
  }

  refreshIncludedId(): string[] {
    const output = [];
    this.values.map((_item) => {
      output.push(_item._id);
      _item.includedFloor.map((__item) => {
        output.push(__item._id);
      });
    });

    return output;
  }

  protected _refreshIncludedId(): string[] {
    this.included = [];
    this.values.map((_item) => {
      if (!this.included.includes(_item._id)) {
        this.included.push(_item._id);
      }
      _item.includedFloor.map((__item) => {
        if (!this.included.includes(__item._id)) {
          this.included.push(__item._id);
        }
      });
    });
  }

  applyToIncludedItem(index: number, item: FloorType) {
    const findIndex = this.values[index].includedFloor.findIndex((_item) => _item._id == item._id);
    if (findIndex == -1) {
      this.values[index].includedFloor.push(item);
    } else {
      this.values[index].includedFloor.splice(findIndex, 1);
    }
    this._refreshIncludedId();
    this.valueChanged();
  }

  addItem() {
    this.values.push({
      floor: 0,
      _id: "",
      name: "설정되지 않음",
      includedFloor: [],
    });
  }
  deleteItem(index: number) {
    this.values.splice(index, 1);
  }
  getIncluded() {
    return this.refreshIncludedId();
  }

  getValues() {
    return this.values;
  }

  valueChanged() {
    this.__modified__ = getUnixtime();
  }
}
