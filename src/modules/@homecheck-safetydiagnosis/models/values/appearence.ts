import { getUnixtime } from "@/modules/@homecheck/libs/min";

import { _basic, _static } from "./common"
import { FixedSiteString, type FixedSite, grade } from "./inspection";
// @Exceptions
// 3) 외관조사 => 일반 커스터마이징 부재, 재료조사 => 고정 부재, 환경요소 => 없음
// 4) 외관조사만 포함, 보수 방안

export enum appearenceInspection {
    CrackValue = 'c',
    AreaValue = 'a',
    LengthValue = 'l',
    MultiValue = 'm',
    EtcValue = 'e'
}

export const appearenceInspectionString: { [key in appearenceInspection]: string } = {
  [appearenceInspection.AreaValue]: "면적 손상",
  [appearenceInspection.CrackValue]: "균열 손상",
  [appearenceInspection.LengthValue]: "길이 손상",
  [appearenceInspection.MultiValue]: "개수 손상",
  [appearenceInspection.EtcValue]: "기타 손상",
};

export type appearenceType = CrackValueType | LengthValueType | AreaValueType | MultiValueType | EtcValueType



/**
 * 외관 조사 기본 항목
 * 
 */
export class AppearenceInspection extends _basic {
  type: appearenceInspection = appearenceInspection.EtcValue;

  get writeonly__type() {
    return this.type;
  }
  set writeonly__type(val) {
    this.type = val;
    this.whenTypeChanged();
  }
  value: string = "";
  isInternal: boolean = true;
  repaired: boolean = false; // 보수됨, 만약 previous 가 schedule_id와 다를시에만
  repair_id: string = ""; // repair 값의 id
  site: string = "";

  quantity: number = 1; // 수량

  whenTypeChanged() {}
  includedToInspections(): boolean {
    return false;
  }
  validCheck_Values(): boolean {
    return false;
  }
  getTypeString() {
    return appearenceInspectionString[this.type];
  }
  getType(): appearenceInspection {
    return this.type;
  }
  setType(input: appearenceInspection): void {
    this.writeonly__type = input;
  }

  getSite(): string {
    return this.site;
  }
  getSiteUIString(): string {
    return this.site ? this.site : "선택되지 않음";
  }

  setSite(input: string) {
    this.site = input;
  }
  getTotalValueWithUnit() {
    return "-";
  }
  getTotalValueArray(): string[] {
    return [``, ``];
  }
  getInternal() {
    return this.isInternal;
  }
  getInternalUIString() {
    return this.isInternal ? "내부에 있음" : "외부에 있음";
  }

  setInternal(input: boolean) {
    this.isInternal = input;
  }
  changeInternal() {
    this.isInternal = !this.isInternal;
  }

  getRepaired() {
    return this.repaired;
  }

  setRepaired(input: boolean) {
    this.repaired = input;
  }

  changeRepaired() {
    this.repaired = !this.repaired;
  }

  getRepairedUIString() {
    return this.repaired ? "보수 완료" : "보수 안됨";
  }

  getValueUIString() {
    return this.value ? this.value : "선택되지 않음";
  }
  getValue() {
    return this.value;
  }
  setValue(input: string): void {
    this.value = input;
  }

  getRepairId() {
    return this.repair_id;
  }
  getRepairIdString() {}
  getRepairIdUIString() {}
  setRepairId(id: string) {
    this.repair_id = id;
  }

  getName() {
    return this.value;
  }
  delete() {
    this.__deleted__ = getUnixtime();
  }
  getValueString(): string {
    return "-";
  }
  getValueString2(): string {
    return "-";
  }
  getValueArray(): string[] {
    return ["", ``, ``, ``, ``, ``];
  }

  getVolume() {
    return 0;
  }
  getVolumeUnit() {
    return "";
  }
  getGradeTitle() {
    return "";
  }
  getAllGrades() {
    return {}
  }
  getAllAreas() {
    return {}
  }

  getQuantity(): number {
    return this.toNumber(this.quantity);
  }
  getValuesUIArray(): any[] {
    return [];
  }
  getFixedSites() {
    return FixedSiteString;
  }
  validCheck_quantity(): boolean {
    return this.quantity != 0;
  }

  protected toNumber(val: string | number): number {
    switch (typeof val) {
      case "number":
        return val;
      case "string":
        return parseFloat(val);
    }
  }
  static Parser(input: appearenceType): CrackValue | AreaValue | LengthValue | EtcValue | MultiValue {
    let output;

    switch (input.type) {
      case appearenceInspection.CrackValue:
        output = new CrackValue();
        break;
      case appearenceInspection.AreaValue:
        output = new AreaValue();
        break;
      case appearenceInspection.LengthValue:
        output = new LengthValue();
        break;
      case appearenceInspection.MultiValue:
        output = new MultiValue();
        break;
      case appearenceInspection.EtcValue:
        output = new EtcValue();
        break;
      default:
        output = new CrackValue();
        break;
    }
    Object.assign(output, input);
    return output;
  }
}


// # 값 종류
// 3) 균열
// 4) 면적
// 5) 길이(이격)
// 6) 갯수
// 7) 기타?
type CrackValueType = {
    value : string,
    width: number,
  length: number,
    isInspections : boolean
} & AppearenceInspection



enum CrackGrade {
  LESS_THEN_01mm = grade.A,
  LESS_THEN_02mm = grade.B,
  LESS_THEN_03mm = grade.C,
  LESS_THEN_05mm = grade.D,
  OVER_05mm = grade.E,
}
export const CrackGradeString: { [key in CrackGrade]: string } = {
  [CrackGrade.LESS_THEN_01mm]: "0.1mm 미만",
  [CrackGrade.LESS_THEN_02mm]: "0.1mm 이상, 0.2mm 미만",
  [CrackGrade.LESS_THEN_03mm]: "0.2mm 이상, 0.3mm 미만",
  [CrackGrade.LESS_THEN_05mm]: "0.3mm 이상, 0.5mm 미만",
  [CrackGrade.OVER_05mm]: "0.5mm 이상",
};

export enum AreaPercent {
  LESS_THEN_20 = "l20",
  OVER_THEN_20 = "o20",
  LESS_THEN_10 = "l10",
  OVER_THEN_10 = "o10",
}


export const AreaPercentString: { [key in AreaPercent]: string } = {
  [AreaPercent.LESS_THEN_20]: "면적율 20% 미만",
  [AreaPercent.OVER_THEN_20]: "면적율 20% 이상",
  [AreaPercent.LESS_THEN_10]: "면적율 10% 미만",
  [AreaPercent.OVER_THEN_10]: "면적율 10% 이상",
};


export class CrackValue extends AppearenceInspection {
  value: string = "";
  length: number = 0; // 길이

  // 상태 평가용
  grade?: CrackGrade | grade = CrackGrade.LESS_THEN_01mm;
  area?: AreaPercent = undefined;
  width: number = 0; // 폭

  get writeonly__width() {
    return this.width;
  }
  set writeonly__width(value: number) {
    this.width = value;
    this.checkCrackSize();
  }
  isInspections: boolean = false;

  fixedSite?: FixedSite;

  getValueString(): string {
    return `폭 : ${this.width}mm * 길이 : ${this.length}m `;
  }
  getValueString2(): string {
    return `cw = ${this.width} mm / ${this.length} m `;
  }

  getValueArray(): string[]{
    return ["cw=", `${this.width}`, `mm`, `/`, `${this.length}`, `m`]
  }


  getTotalValueWithUnit() {
    return `${(this.toNumber(this.length) * this.toNumber(this.quantity)).toFixed(2)}m`;
  }

  
  getTotalValueArray() : string[] {
    return [`${(this.toNumber(this.length) * this.toNumber(this.quantity)).toFixed(2)}`, `m`];
    
  }
  getVolume() {
    return this.toNumber(this.length) * this.toNumber(this.quantity);
  }
  getVolumeUnit() {
    return "m";
  }
  getFixedSite() {
    return this.fixedSite;
  }

  whenTypeChanged(): void {
    this.value = "";
  }
  setFixedSite(value: FixedSite) {
    this.fixedSite = value;
    this.value = "구조체 균열";
    this.grade = CrackGrade.LESS_THEN_01mm;
    this.area = undefined;
  }
  getSiteUIString(): string {
    const output = this.isInspections ? FixedSiteString[this.fixedSite!] : this.site;

    return output ? output : "선택되지 않음";
  }

  changeInspections() {
    this.isInspections = !this.isInspections;
  }
  includedToInspections(): boolean {
    return true;
  }
  validCheck_Values(): boolean {
    return this.width != 0 && this.length != 0 && this.quantity != 0;
  }
  validCheck_writeonly__width() {
    return this.width != 0;
  }
  validCheck_length() {
    return this.length != 0;
  }

  getInspectionsUIString() {
    return this.isInspections ? "포함" : "미포함";
  }
  getValuesUIArray(): any[] {
    return [
      {
        name: "폭",
        property: "writeonly__width",
      },
      {
        name: "길이",
        property: "length",
      },
    ];
  }

  getValuesArray() {
    return ["구조체 균열"];
  }

  setGrade(grade: CrackGrade) {
    this.grade = grade;
    if (this.grade == CrackGrade.LESS_THEN_01mm) {
      this.area = undefined;
    }
  }

  setArea(area: AreaPercent) {
    this.area = area;
  }

  getGrade() {
    return this.grade;
  }
  getArea() {
    return this.area;
  }
  getAreaString() {
    return this.area ? AreaPercentString[this.area] : "";
  }
  getGradeString() {
    return CrackGradeString[this.grade!];
  }

  getAllAreas() {
    return {
      [AreaPercent.LESS_THEN_20]: AreaPercentString[AreaPercent.LESS_THEN_20],
      [AreaPercent.OVER_THEN_20]: AreaPercentString[AreaPercent.OVER_THEN_20],
    };
  }
  getAllGrades() {
    return CrackGradeString;
  }

  getGradeTitle() {
    return "폭 범위";
  }
  protected checkCrackSize() {
    if (this.width < 0.1) {
      this.grade = CrackGrade.LESS_THEN_01mm;
      this.area = undefined;
    } else if (this.width < 0.2) {
      this.grade = CrackGrade.LESS_THEN_02mm;
    } else if (this.width < 0.3) {
      this.grade = CrackGrade.LESS_THEN_03mm;
    } else if (this.width < 0.5) {
      this.grade = CrackGrade.LESS_THEN_05mm;
    } else {
      this.grade = CrackGrade.OVER_05mm;
    }
  }

  static Parse(input: CrackValueType): CrackValue {
    const output = new CrackValue();
    Object.assign(output, input);
    return output;
  }
}

type AreaValueType = {
  value: string;
  width: number;
  height: number;
  isInspections: boolean;
} & AppearenceInspection;


const AreaGradeString = {
  '박리': {
    [grade.A]: "발생하지 않음",
    [grade.B]: "0.5mm미만의 박리",
    [grade.C]: "0.5mm이상 1.0mm미만 박리",
    [grade.D]: "1.0mm이상 2.5mm미만 박리",
    [grade.E]: "2.5mm이상 박리",
  },
  "박락, 층분리": {
    [grade.A]: "발생하지 않음",
    [grade.B]: "15mm미만의 박락",
    [grade.C]: "15mm이상 20mm미만 박락",
    [grade.D]: "20mm이상 25mm미만 박락",
    [grade.E]: "25mm이상 박락",
  },
  "누수, 백태": {
    [grade.A]: "누수 및 백태 없음",
    [grade.B]: "경미한 누수흔적 또는 백태 5% 미만",
    [grade.C]: "현저한 누수흔적 또는 백태 10% 미만",
    [grade.D]: "누수진행 관찰 가능 또는 백태 20% 미만",
    [grade.E]: "누수진행 확연 또는 백태 20% 이상",
  },
  "철근 노출": {
    [grade.A]: "발생하지 않음",
    [grade.B]: "철근노출 면적율 1%미만",
    [grade.C]: "철근노출 면적율 3%미만",
    [grade.D]: "철근노출 면적율 5%미만",
    [grade.E]: "철근노출 면적율 5%이상",
  },
};







// 박리, [박락, 층분리], [누수,백태], 철근 노출
export class AreaValue extends AppearenceInspection {
  width: number = 0;
  height: number = 0;

  // 상태 평가용
  isInspections: boolean = false;
  grade: grade = grade.A;
  area?: AreaPercent = undefined;
  fixedSite?: FixedSite;

  whenTypeChanged(): void {
    this.value = "박리";
    this.grade = grade.A;
    this.area = undefined;
  }
  includedToInspections(): boolean {
    return true;
  }
  setValue(input: string): void {
    this.value = input;
    if (this.isInspections) {
      switch (this.value) {
        case "박리":
          this.area = AreaPercent.LESS_THEN_10;
          break;
        case "박락, 층분리":
          this.area = AreaPercent.LESS_THEN_20;
          break;
        default:
          this.area = undefined;
      }
    }
  }

  getSiteUIString(): string {
    const output = this.isInspections ? FixedSiteString[this.fixedSite!] : this.site;

    return output ? output : "선택되지 않음";
  }

  getInspectionsUIString() {
    return this.isInspections ? "포함" : "미포함";
  }
  changeInspections() {
    this.isInspections = !this.isInspections;
    if (this.isInspections) {
      this.value = "박리";
    }
  }

  getFixedSite() {
    return this.fixedSite;
  }
  setFixedSite(value: FixedSite) {
    this.fixedSite = value;
  }

  getValueString(): string {
    return `너비 : ${this.width}m * 높이 : ${this.height}m `;
  }
  getValueString2(): string {
    return `A= ${this.width}m x ${this.height}m `;
  }
  getValueArray(): string[] {
    return ["A=", `${this.width}`, `m`, `/`, `${this.height}`, `m`];
  }

  getTotalValueWithUnit() {
    return `${(this.toNumber(this.width * this.height) * this.toNumber(this.quantity)).toFixed(2)}m²`;
  }
  getTotalValueArray(): string[] {
    return [
      `${(this.toNumber(this.width * this.height) * this.toNumber(this.quantity))
        .toFixed(2)}`,
      `m²`,
    ];
  }
  getVolumeUnit() {
    return "m²";
  }

  getVolume() {
    return this.toNumber(this.width * this.height) * this.toNumber(this.quantity);
  }
  getValuesUIArray(): any[] {
    return [
      {
        name: "너비",
        property: "width",
      },
      {
        name: "높이",
        property: "height",
      },
    ];
  }

  getValuesArray() {
    return ["박리", "박락, 층분리", "누수, 백태", "철근 노출"];
  }

  setGrade(_grade: grade) {
    this.grade = _grade;
    if (this.grade == grade.A) {
      this.area = undefined;
    }
  }

  setArea(area: AreaPercent) {
    this.area = area;
  }

  getGrade() {
    return this.grade;
  }
  getArea() {
    return this.area;
  }
  getAreaString() {
    return this.area ? AreaPercentString[this.area] : "";
  }
  getGradeString() {
    return AreaGradeString[this.value][this.grade!];
  }

  getAllAreas() {
    switch (this.value) {
      case "박리":
        return {
          [AreaPercent.LESS_THEN_10]: AreaPercentString[AreaPercent.LESS_THEN_10],
          [AreaPercent.OVER_THEN_10]: AreaPercentString[AreaPercent.OVER_THEN_10],
        };
        break;
      case "박락, 층분리":
        return {
          [AreaPercent.LESS_THEN_20]: AreaPercentString[AreaPercent.LESS_THEN_20],
          [AreaPercent.OVER_THEN_20]: AreaPercentString[AreaPercent.OVER_THEN_20],
        };
        break;
      default:
        return null;
    }
  }

  getAllGrades() {
    return AreaGradeString[this.value];
  }

  getGradeTitle() {
    return "";
  }

  validCheck_Values(): boolean {
    return this.width != 0 && this.height != 0 && this.quantity != 0;
  }
  validCheck_width() {
    return this.width != 0;
  }
  validCheck_height() {
    return this.height != 0;
  }

  static Parse(input: AreaValueType): AreaValue {
    const output = new AreaValue();
    Object.assign(output, input);
    return output;
  }
}


type LengthValueType = {
  value: string;
  length: number;
} & AppearenceInspection;

export class LengthValue extends AppearenceInspection {
  value: string = "";
  length: number = 0;

  getValueString(): string {
    return `길이 : ${this.length}m`;
  }
  getValueString2(): string {
    return `L= ${this.length}m`;
  }
  getValueArray(): string[] {
    return ["L=", `${this.length}`, `m`, ``, ``, ``];
  }

  getTotalValueWithUnit() {
    return `${(this.toNumber(this.length) * this.toNumber(this.quantity)).toFixed(2)}m`;
  }

  getTotalValueArray(): string[] {
    return [`${(this.toNumber(this.length) * this.toNumber(this.quantity)).toFixed(2)}`, `m`];
  }
  getVolumeUnit() {
    return "m";
  }
  getVolume() {
    return this.toNumber(this.length) * this.toNumber(this.quantity);
  }
  getValuesUIArray(): any[] {
    return [
      {
        name: "길이",
        property: "length",
      },
    ];
  }
  validCheck_Values(): boolean {
    return this.length != 0;
  }
  validCheck_length() {
    return this.length != 0;
  }
  static Parse(input: LengthValueType): LengthValue {
    const output = new LengthValue();
    Object.assign(output, input);
    return output;
  }
}

type MultiValueType = {
  value: string;
} & AppearenceInspection;
export class MultiValue extends AppearenceInspection {
  value: string = "";

  getValueString(): string {
    return `개수 : ${this.quantity}`;
  }
  getValueString2(): string {
    return `-`;
  }
  getValueArray(): string[] {
    return ["", ``, ``, ``, ``, ``];
  }

  validCheck_Values(): boolean {
    return this.quantity != 0;
  }
  getVolume() {
    return this.toNumber(this.quantity);
  }
  getVolumeUnit() {
    return "개소";
  }
  static Parse(input: MultiValueType): MultiValue {
    const output = new MultiValue();
    Object.assign(output, input);
    return output;
  }
}

type EtcValueType = {
  value: string;
} & AppearenceInspection;

export class EtcValue extends AppearenceInspection {
  value: string = "";
  static Parse(input: EtcValueType): EtcValue {
    const output = new EtcValue();
    Object.assign(output, input);
    return output;
  }
  validCheck_Values(): boolean {
    return this.quantity != 0;
  }
  getValueArray(): string[] {
    return ["", ``, ``, ``, ``, ``];
  }
}


