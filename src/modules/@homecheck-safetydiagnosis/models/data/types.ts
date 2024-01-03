import { _data } from "@/modules/@homecheck/models/common";
import type { _dataType } from "@/modules/@homecheck/models/common";

import type { SafetydiagnosisData } from "./SafetydiagnosisData";
import type { ProjectCategory, BuildingFacility, BuildingMaterialType, BuildingStructureType, SafetydiagnosisChecklistDataType } from "./enum";


import type {
  AreaValue,CarbonationValue,CrackValue,EtcValue,LengthValue,MeasurementValue,MultiValue,RebarValue,SchmidtValue,SlopeValue,SubsidenceValue,AppearenceInspection,SafetyInspectionBasicValue,
  StaticValues, appearenceInspection, ScoreSupports, Environments
} from "../values";
import type { _basic } from "../values/common";
export type AvailableValue =
  | AreaValue
  | CarbonationValue
  | CrackValue
  | EtcValue
  | LengthValue
  | MeasurementValue
  | MultiValue
  | RebarValue
  | SchmidtValue
  | SlopeValue
  | SubsidenceValue
  | AppearenceInspection
  | SafetyInspectionBasicValue
  | StaticValues
  | ScoreSupports
  | Environments;

export type notUploadedImg = {
  url: string;
  data_id: string;
  value_id: string;
};

export type UploadedImg = {
  to: string;
} & notUploadedImg;

export type SafetydiagnosisSpaceType = {
  _id: string;
  user_id?: string;
  floorplans: SafetydiagnosisFloorplansType[];
  hidden: boolean;
  name: string;
  projects: SafetydiagnosisProjectType[];
} & _dataType;

/**
 * 기존 Schedule의 모델
 */
export type SafetydiagnosisProjectType = {
  _id: string;
  name: string;
  previous: string;
  user_id?: string;
  data_id: string;
  category: ProjectCategory;
} & _dataType;

/**
 * 평면도 그룹 모델
 *
 * */
export type SafetydiagnosisFloorplansType = {
  name: string;
  fac: BuildingFacility; // 시설물 종류
  gfa: number; // gross-floor-area : 연면적
  data: SafetydiagnosisFloorplanType[];
} & _dataType;

/**
 * 평면도 모델
 */
export type SafetydiagnosisFloorplanType = {
  floor: number; // 층 수
  img: string; // 이미지 이름
  name: string; // 이름
  width: number; // 너비
  height: number; // 높이
  area?: number; // 면적 - 연면적 계산시 사용
  material?: BuildingMaterialType; // 건축물 종류
  struct?: BuildingStructureType;
  new?: boolean;
} & _dataType;

export type SafetydiagnosisDatasType = {
  _id: string;
  previous: string;
  data: SafetydiagnosisData[];
  floorSheet: {
    [key: string]: SafetydiagnosisFloorplanType | SafetydiagnosisFloorplansType;
  };
};

export type safetydiagnosisChecklist = {
  _id: string;
  data: safetydiagnosisChecklistDataType[];
};

export type safetydiagnosisChecklistDataType = SafetydiagnosisRepairs | SafetydiagnosisSites | SafetydiagnosisAppearences;

export type SafetydiagnosisRepairs = {
  _id: string;
  name: string;
  type: SafetydiagnosisChecklistDataType;
  ppu: number; // price per unit 단위당 (물량당) 보수 금액
};
export type SafetydiagnosisSites = {
  _id: string;
  name: string;
  type: SafetydiagnosisChecklistDataType;
};
export type SafetydiagnosisAppearences = {
  _id: string;
  type: SafetydiagnosisChecklistDataType;
  category: appearenceInspection;
  name: string;
  repair_id: string;
  formula?: string;

  // 보수 물량 산정 방식
};
