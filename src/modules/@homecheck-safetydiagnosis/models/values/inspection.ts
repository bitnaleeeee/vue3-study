import _ from "lodash";
import { getUnixtime } from "@/modules/@homecheck/libs/min";

import { schmidtAngleConstant, schmidtPositionString, schmidtAngleConstantString, getConcreteConstant, getAngleCorrection, schmidtPosition } from "./const";
import { _basic } from "./common";
export * from "./const";


export enum grade {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
}

export const gradeScore: { [key in grade]: number } = {
  [grade.A]: 1,
  [grade.B]: 3,
  [grade.C]: 5,
  [grade.D]: 7,
  [grade.E]: 9,
};

export const gradeTransformString: { [key in grade]: string } = {
  [grade.A]: "예민한 기계 기초의 위험 침하 한계 (각변위 1/750 이하)",
  [grade.B]: "구조물의 균열발생 한계 (각변위 1/500 이하)",
  [grade.C]: "구조물의 경사도 감지 (각변위 1/250 이하)",
  [grade.D]: "구조물의 구조적 손상이 예상되는 한계 (각변위 1/150 이하)",
  [grade.E]: "구조물이 위할 정도 (각변위 1/150 초과)",
};

export const gradeTransformDesc: { [key in grade]: string } = {
  [grade.A]: "A : 예민한 기계 기초의 위험 침하 한계",
  [grade.B]: "B : 구조물의 균열발생 한계",
  [grade.C]: "C : 구조물의 경사도 감지",
  [grade.D]: "D : 구조물의 구조적 손상이 예상되는 한계",
  [grade.E]: "E : 구조물이 위험할 정도",
};

export const gradeTransformAngle: { [key in grade]: string } = {
  [grade.A]: "1/750 이하",
  [grade.B]: "1/500 이하",
  [grade.C]: "1/250 이하",
  [grade.D]: "1/150 이하",
  [grade.E]: "1/150 초과",
};

/**
 * 정밀 점검용 부재
 */
export enum FixedSite {
  Slab = "s", // 슬래브
  Beam = "b", // 작은 보
  Girder = "g", // 큰 보
  Column = "c", // 기둥
  Wall = "w", // 내력 벽
}
export const FixedSiteString: { [key in FixedSite]: string } = {
  [FixedSite.Beam]: "작은 보",
  [FixedSite.Column]: "기둥",
  [FixedSite.Girder]: "큰 보",
  [FixedSite.Slab]: "슬래브",
  [FixedSite.Wall]: "내력벽",
};

// safetyInspection => 정밀안전점검 항목 으로 변경

//Precise Safety Inspection
// precision safety diagnosis

export enum safetyInspection {
  SchmidtValue = "sc",
  CarbonationValue = "ca",
  RebarValue = "re",
  SlopeValue = "sl",
  SubsidenceValue = "su",
  MeasurementValue = "me",
}
export const safetyInspectionString: { [key in safetyInspection]: string } = {
  [safetyInspection.SchmidtValue]: "콘크리트 비파괴강도",
  [safetyInspection.CarbonationValue]: "콘크리트 탄산화 깊이 조사",
  [safetyInspection.MeasurementValue]: "부재단면의 규격",
  [safetyInspection.RebarValue]: "철근 탐사 시험",
  [safetyInspection.SlopeValue]: "기울기 측정",
  [safetyInspection.SubsidenceValue]: "변위ㆍ변형",
};

/*
  [safetyInspection.CrackValue]: "균열",
  [safetyInspection.ScalingValue]: "박리 (표면 노후)",
  [safetyInspection.SpallingValue]: "박락, 층분리 (표면 노후)",
*/

// * 재료 조사 항목
// == 100% 점으로 표시되어도 됨

class SafetyInspection extends _basic {
  type?: safetyInspection;
  site: FixedSite = FixedSite.Beam;
  isInspections: boolean = true;
}
export type inspectionsType = SchmidtValue | SlopeValue | SubsidenceValue | MeasurementValue | RebarValue | CarbonationValue;

export class SafetyInspectionBasicValue extends SafetyInspection {
  getName() {
    return "지정되지 않음";
  }
  getGradeString() {}
  getAreaString() {}

  getValueString(): string {
    return "";
  }
  getQuantity(): number {
    return 1;
  }
  delete() {
    this.__deleted__ = getUnixtime();
  }
  getTypeString(): string {
    return safetyInspectionString[this.type!] ? safetyInspectionString[this.type!] : "지정되지 않음";
  }
  getType(): safetyInspection {
    return this.type!;
  }

  validCheck_Values() {
    return true;
  }

  getSite(): string {
    return this.site;
  }
  getSiteUIString(): string {
    return this.site ? FixedSiteString[this.site] : "선택되지 않음";
  }

  setSite(input: FixedSite) {
    this.site = input;
  }
  setType(input: safetyInspection): void {
    this.type = input;
  }

  static Parser(input: inspectionsType): SchmidtValue | SlopeValue | SubsidenceValue | MeasurementValue | RebarValue | CarbonationValue | SafetyInspectionBasicValue {
    let output;

    switch (input.type) {
      case safetyInspection.CarbonationValue:
        output = new CarbonationValue();
        break;
      case safetyInspection.MeasurementValue:
        output = new MeasurementValue();
        break;
      case safetyInspection.RebarValue:
        output = new RebarValue();
        break;
      case safetyInspection.SchmidtValue:
        output = new SchmidtValue();
        break;
      case safetyInspection.SlopeValue:
        output = new SlopeValue();
        break;
      case safetyInspection.SubsidenceValue:
        output = new SubsidenceValue();
        break;
      default:
        output = new SafetyInspectionBasicValue();
    }
    Object.assign(output, input);
    if (input.type == safetyInspection.CarbonationValue) {
      (output as CarbonationValue).rebar = SafetyInspectionBasicValue.Parser((output as CarbonationValue).rebar) as RebarValue;
    }
    return output;
  }
}

/**
 * 슈미트 해머
 *
 * @param position - 측정 부위
 * @param value -  20개의 input 필요, [ 정수형 또는 그래프형 ] 컴포넌트
 * @param concreteInput - 콘크리트 일수?
 * 반발 경도  = computed
 * 보정치 = 각도에 따라서
 * 재령 계수 = 표가 있음
 */
export class SchmidtValue extends SafetyInspectionBasicValue {
  type = safetyInspection.SchmidtValue;
  position: schmidtPosition = schmidtPosition.Side;
  value: number[] = [];
  concreteInput: number = 1;
  angle: schmidtAngleConstant = schmidtAngleConstant.Angle0;

  designedStrength: number = 0;
  cracked: boolean = false;
  // computed : getConcreteConstant
  // computed : getAngleCorrection

  getAngle() {
    return this.angle;
  }
  setAngle(input: schmidtAngleConstant) {
    this.angle = input;
  }
  changePosition() {
    this.position = this.position == schmidtPosition.Center ? schmidtPosition.Side : schmidtPosition.Center;
  }

  changeCracked() {
    this.cracked = !this.cracked;
  }

  getCrackString() {
    return this.cracked ? "손상됨" : "손상 안됨";
  }

  getAngleString() {
    return schmidtAngleConstantString[this.angle];
  }
  getPositionString() {
    return schmidtPositionString[this.position];
  }

  getConcreteConstant() {
    return getConcreteConstant(this.concreteInput);
  }
  getAngleCorrection() {
    return getAngleCorrection(parseFloat(this.getValueAvg()), this.angle);
  }
  getName() {
    return `슈미트 해머 측정 - ${schmidtPositionString[this.position]}`;
  }

  getValue() {
    return Array.isArray(this.value) ? this.value.filter((_item) => _item != null) : [0];
  }

  getValueFilled() {
    if (Array.isArray(this.value)) {
      const output = [];
      this.value.length = 20;
      for (let val of this.value) {
        output.push(val ? val : 0);
      }
      return output;
    } else {
      return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
  }

  getValueAvg() {
    const avgArr = this.getValueFilled().filter((_item) => _item > 0);
    const Length = avgArr.length;
    if (Length == 0) {
      return 0;
    }

    const FirstAvg = _.sum(avgArr) / length;
    const under20 = FirstAvg * 0.8;
    const up20 = FirstAvg * 1.2;
    const calculatedArr = avgArr.filter((item) => {
      return item < up20 && under20 > item;
    });

    return (_.sum(calculatedArr) / calculatedArr.length).toFixed(1);
  }

  getValueString(): string {
    return `Ro: ${this.getValueAvg()}, 재령계수: ${this.getConcreteConstant()}`;
  }

  getCalculatedValue() {
    return this.getAngleCorrection() + parseFloat(this.getValueAvg());
  }

  getCalculateMethod1() {
    // 일본 재료
    return ((-18 + 1.27 * this.getCalculatedValue()) * this.getConcreteConstant()).toFixed(1);
  }

  getCalculateMethod2() {
    // 일본 건축
    return ((7.3 * this.getCalculatedValue() + 100) * 0.098 * this.getConcreteConstant()).toFixed(1);
  }

  getCalculateWithMethod(low: SchdmitCalculateMethod) {
    switch (low) {
      case SchdmitCalculateMethod.JAPAN_CONSTRUCTIONS:
        return ((7.3 * this.getCalculatedValue() + 100) * 0.098 * this.getConcreteConstant()).toFixed(1);
      case SchdmitCalculateMethod.JAPAN_MATERIALS:
        return ((-18 + 1.27 * this.getCalculatedValue()) * this.getConcreteConstant()).toFixed(1);
      case SchdmitCalculateMethod.TOKYO_INSPECTIONS:
        return ((10 * this.getCalculatedValue() - 110) * 0.098 * this.getConcreteConstant()).toFixed(1);

      /*
        case SchdmitCalculateMethod.SEOUL_UNIV:
          return ((12.1 * this.getCalculatedValue() - 177) * this.getConcreteConstant()).toFixed(1);

        case SchdmitCalculateMethod.DANKUK_UNIV:
          return ((13.5 * this.getCalculatedValue() - 188) * this.getConcreteConstant()).toFixed(1);

        case SchdmitCalculateMethod.DAEWOO:
          return ((13.15 * this.getCalculatedValue() - 108) * this.getConcreteConstant()).toFixed(1);
*/
      case SchdmitCalculateMethod.US_ARMY:
        return (((-120.6 + 8 * this.getCalculatedValue() + 0.0932 * this.getCalculatedValue()) ^ 2) * 0.098 * this.getConcreteConstant()).toFixed(1);
    }
  }
  getCalculateWithHardMethod(high: HardSchdmitCalculateMethod) {
    switch (high) {
      case HardSchdmitCalculateMethod.SCIENCE_TECH:
        return ((2.304 * this.getCalculatedValue() - 38.8) * this.getConcreteConstant()).toFixed(1);

      case HardSchdmitCalculateMethod.ETC:
        // kgf/cm2 식,
        // 1Mpa = 10.197162 kgf/cm2
        return (((15.2 * this.getCalculatedValue() - 112.8) * this.getConcreteConstant()) / 10.197162).toFixed(1);
    }
  }
}

export enum SchdmitCalculateMethod {
  JAPAN_MATERIALS = "J_M",
  JAPAN_CONSTRUCTIONS = "J_C",
  TOKYO_INSPECTIONS = "T_I",
  US_ARMY = "US",
  SEOUL_UNIV = "SEOUL",
  DANKUK_UNIV = "DU",
  DAEWOO = "DW",
}

export const SchdmitCalculateMethodString = {
  [SchdmitCalculateMethod.JAPAN_MATERIALS]: {
    name: "일본재료학회",
    formula: "Fc=-18.0 +1.27․R",
  },
  [SchdmitCalculateMethod.JAPAN_CONSTRUCTIONS]: {
    name: "일본건축학회",
    formula: "Fc=(7.3R+100)×0.098",
  },
  [SchdmitCalculateMethod.TOKYO_INSPECTIONS]: {
    name: "동경도 건축재료검사소",
    formula: "Fc=(10R-110)×0.098",
  },
  /*
  [SchdmitCalculateMethod.SEOUL_UNIV]: {
    name: "서울대학교",
    formula: "Fc=12.1R-177",
  },
  [SchdmitCalculateMethod.DANKUK_UNIV]: {
    name: "단국대학교",
    formula: "Fc=13.5R-188",
  },
  [SchdmitCalculateMethod.DAEWOO]: {
    name: "대우건설 기술연구소",
    formula: "Fc=13.15R-108",
  },
  */

  [SchdmitCalculateMethod.US_ARMY]: {
    name: "U.S Army",
    formula: "Fc=(-120.6+8.0R+0.0932R0^2)×0.098",
  },
};

export enum HardSchdmitCalculateMethod {
  SCIENCE_TECH = "ST",
  ETC = "ETC",
}
export const HardSchdmitCalculateMethodString = {
  [HardSchdmitCalculateMethod.ETC]: {
    name: "권영웅 외",
    formula: "Fc=15.2R-112.8(kgf/cm2)",
  },
  [HardSchdmitCalculateMethod.SCIENCE_TECH]: {
    name: "과학기술부",
    formula: "Fc=2.304R-38.80(Mpa)",
  },
};

/** 
 * 탄산화
    @param depth - 깊이
    @param thickness - 두께
*/
export class CarbonationValue extends SafetyInspectionBasicValue {
  type = safetyInspection.CarbonationValue;
  depth: number = 0;
  rebar: RebarValue = new RebarValue();

  getName() {
    return "탄산화 점검";
  }
  getValueString(): string {
    return `깊이 : ${this.depth}, 피복 두께 : ${this.rebar.thickness}`;
  }
  validCheck_depth(): boolean {
    return this.depth != 0;
  }

  getGrade() {
    if (this.depth <= this.rebar.thickness * 0.25) {
      return grade.A;
    } else if (this.depth <= this.rebar.thickness * 0.5) {
      return grade.B;
    } else if (this.depth <= this.rebar.thickness * 0.75) {
      return grade.C;
    } else if (this.depth <= this.rebar.thickness * 1) {
      return grade.D;
    } else {
      return grade.E;
    }
  }
  getScore() {
    return gradeScore[this.getGrade()];
  }

  getRebarPositionString() {
    switch (this.rebar.location) {
      case RebarLocation.SIDE:
        return "단부";
      case RebarLocation.CENTER:
      default:
        return "중앙부";
    }
  }
}

enum RebarLocation {
  CENTER = "c",
  SIDE = "s",
}

/** 
 * 철근탐사
    @param thickness - 두께
*/
export class RebarValue extends SafetyInspectionBasicValue {
  type = safetyInspection.RebarValue;
  thickness: number = 0;
  location: RebarLocation = RebarLocation.CENTER;
  memo: string = "";

  validCheck_thickness(): boolean {
    return this.thickness != 0;
  }
  getValueString(): string {
    return `철근 피복 두께 : ${this.thickness}`;
  }
  getName() {
    return "철근 탐사";
  }

  changeLocation() {
    this.location = this.location == RebarLocation.CENTER ? RebarLocation.SIDE : RebarLocation.CENTER;
  }

  getLocationString() {
    switch (this.location) {
      case RebarLocation.CENTER:
        return "중앙부";
      case RebarLocation.SIDE:
        return "단부";
    }
  }
  getPositionString() {
    switch (this.location) {
      case RebarLocation.CENTER:
        return "중앙부";
      case RebarLocation.SIDE:
        return "단부";
    }
  }
}

/**
 * 기울기 조사 값
 *
 * TODO : 특별한 방법으로 렌더링하기
 */
export class SlopeValue extends SafetyInspectionBasicValue {
  type = safetyInspection.SlopeValue;

  isLeft: Boolean = false; //변위 방향 : left, right
  value: number = 0; // 변위량, 정수 mm

  get writeonly__value() {
    return this.value;
  }
  set writeonly__value(_val) {
    this.value = _val;
    this.computedSlope();
  }

  height: number = 0; // 측정 높이, 정수 m

  get writeonly__height() {
    return this.height;
  }
  set writeonly__height(_val) {
    this.height = _val;
    this.computedSlope();
  }

  slope: number = 0; // 기울기 : 높이/ 변 ( computed)

  getDirectionString() {
    return this.isLeft ? "좌측" : "우측";
  }
  changeDirection() {
    this.isLeft = !this.isLeft;
  }
  protected computedSlope() {
    this.slope = this.value / (this.height * 1000);
  }

  validCheck_value(): boolean {
    return this.value != 0;
  }

  validCheck_height(): boolean {
    return this.height != 0;
  }

  getSlope() {
    return Math.round(this.slope);
  }
  getValueString(): string {
    return `기울기 값 : ${this.value}/ ${this.height * 1000}mm`;
  }

  getName() {
    return `기울기 측정 - ${this.getDirectionString()}`;
  }
  getGrade() {
    const matchA = 1 / 750;
    const matchB = 1 / 500;
    const matchC = 1 / 250;
    const matchDE = 1 / 150;

    if (this.getSlope() <= matchA) {
      return grade.A;
    } else if (this.getSlope() <= matchB) {
      return grade.B;
    } else if (this.getSlope() <= matchC) {
      return grade.C;
    } else if (this.getSlope() <= matchDE) {
      return grade.D;
    } else {
      return grade.E;
    }
  }
  getGradeString() {
    const matchA = 1 / 750;
    const matchB = 1 / 500;
    const matchC = 1 / 250;
    const matchDE = 1 / 150;

    if (this.getSlope() <= matchA) {
      return gradeTransformString[grade.A];
    } else if (this.getSlope() <= matchB) {
      return gradeTransformString[grade.B];
    } else if (this.getSlope() <= matchC) {
      return gradeTransformString[grade.C];
    } else if (this.getSlope() <= matchDE) {
      return gradeTransformString[grade.D];
    } else {
      return gradeTransformString[grade.E];
    }
  }
}

/**
 * 침하 조사 값
 *
 */
export class SubsidenceValue extends SafetyInspectionBasicValue {
  type = safetyInspection.SubsidenceValue;

  outside: number[] = [0, 0]; // 단부1, 단부2, 정수 mm

  get writeonly__outside(): number[] {
    return this.outside;
  }
  set writeonly__outside(value) {
    this.outside = value;
    this.computedValue();
  }

  center: number = 0; // 중앙부, 정수 mm

  get writeonly__center(): number {
    return this.center;
  }
  set writeonly__center(value) {
    this.center = value;
    this.computedValue();
  }

  length: number = 0; // 측정길이 , 정수 m
  get writeonly__length(): number {
    return this.length;
  }
  set writeonly__length(value) {
    this.length = value;
  }

  value: number = 0; //변위량 : 단부 평균 - 중앙부, mm 반올림 (computed)

  computedValue() {
    const avg = (this.outside[0] + this.outside[1]) / 2;
    this.value = avg - this.center;
  }

  getValueString(): string {
    return `변위량 : ${this.value}mm / ${this.length}m`;
  }

  getValue() {
    return this.value;
  }
  validCheck_outside(): boolean {
    return this.outside[0] != 0 && this.outside[1] != 0;
  }

  validCheck_center(): boolean {
    return this.center != 0;
  }

  validCheck_length(): boolean {
    return this.length != 0;
  }

  getName() {
    return "침하 측정";
  }
  getGrade() {
    let score = 0;
    const matchA = 1 / 750;
    const matchB = 1 / 500;
    const matchC = 1 / 250;
    const matchDE = 1 / 150;

    if (this.value != 0) {
      score = Math.abs(this.value / (this.length * 1000));
    }
    if (score <= matchA) {
      return grade.A;
    } else if (score <= matchB) {
      return grade.B;
    } else if (score <= matchC) {
      return grade.C;
    } else if (score <= matchDE) {
      return grade.D;
    } else {
      return grade.E;
    }
  }

  getGradeString() {
    let score = 0;
    const matchA = 1 / 750;
    const matchB = 1 / 500;
    const matchC = 1 / 250;
    const matchDE = 1 / 150;

    if (this.value != 0) {
      score = Math.abs(this.value / (this.length * 1000));
    }
    if (score <= matchA) {
      return gradeTransformString[grade.A];
    } else if (score <= matchB) {
      return gradeTransformString[grade.B];
    } else if (score <= matchC) {
      return gradeTransformString[grade.C];
    } else if (score <= matchDE) {
      return gradeTransformString[grade.D];
    } else {
      return gradeTransformString[grade.E];
    }
  }
}

/**
 * 부재 실측표
 *
 * ex: 벽 근접, 슬래브 근접 등 접근 불가함
 *
 * @param width - 폭, 정수 mm
 * @param height - 너비, 정수 mm
 */
export class MeasurementValue extends SafetyInspectionBasicValue {
  type = safetyInspection.MeasurementValue;
  width: number = 0;
  height: number = 0;
  thickness: number = 0;

  // 설계된
  designed_width: number = 0;
  designed_height: number = 0;
  designed_thickness: number = 0;

  value: string = ""; // 기둥 이름 등 부재 명

  // 추가 옵션

  overlappedWithSlab: boolean = false;
  overlappedWithMaterials: boolean = false;

  validCheck_width(): boolean {
    return this.width != 0;
  }

  validCheck_height(): boolean {
    return this.height != 0;
  }

  validCheck_designed_width(): boolean {
    return this.designed_width != 0;
  }

  validCheck_designed_height(): boolean {
    return this.designed_height != 0;
  }

  validCheck_thickness(): boolean {
    return this.thickness != 0;
  }

  validCheck_designed_thickness(): boolean {
    return this.designed_thickness != 0;
  }
  changeOverlappedWithSlab() {
    this.overlappedWithSlab = !this.overlappedWithSlab;
  }
  changeOverlappedWithMaterials() {
    this.overlappedWithMaterials = !this.overlappedWithMaterials;
  }

  getOverlapSlabString() {
    return this.overlappedWithSlab ? "간섭됨" : "간섭 안됨";
  }
  getOverlapMaterialsString() {
    return this.overlappedWithMaterials ? "포함됨" : "포함 안됨";
  }

  getDesignedValueString() {
    if (this.site == FixedSite.Column || this.site == FixedSite.Beam || this.site == FixedSite.Girder) {
      return `${this.designed_width}*${this.designed_height}`;
    } else {
      return `T-${this.designed_thickness}`;
    }
  }
  getValueString() {
    if (this.site == FixedSite.Column || this.site == FixedSite.Beam || this.site == FixedSite.Girder) {
      return `${this.width}*${this.height}`;
    } else {
      return `T-${this.thickness}`;
    }
  }
  getCaptionString() {
    if (this.site == FixedSite.Beam || this.site == FixedSite.Girder) {
      if (this.overlappedWithSlab && this.overlappedWithMaterials) {
        return "슬래브 및 마감 간섭";
      } else if (this.overlappedWithSlab && !this.overlappedWithMaterials) {
        return "슬래브 간섭";
      } else if (!this.overlappedWithSlab && this.overlappedWithSlab) {
        return "마감재 간섭";
      } else {
        return "-";
      }
    } else {
      return this.overlappedWithMaterials ? "마감재 포함" : "-";
    }
  }

  getName() {
    return "부재 실측 측정";
  }
}
