import {
  FixedSite,
  grade,
  SchdmitCalculateMethod,
  HardSchdmitCalculateMethod,
  gradeScore,
  gradeTransformDesc,
  gradeTransformAngle,
  InspectionFormula,
  BuildingInspection,
  SubsidenceValue,
  SlopeValue,
} from "@/modules/@homecheck-safetydiagnosis/models";

export type buildingScoreType = {
  slope: {
    max: number;
    value: string;
    string: string;
  };

  subsidence: {
    max: number;
    value: string;
    string: string;
  };

  ssScore: ScoreStringType;
  inspection: ScoreStringType;
  totalScore: ScoreStringType;
};

export type ScoreStringType = {
  score: string;
  gradeString: string;
};

export type applySchdmitFormula = {
    high: HardSchdmitCalculateMethod;
    low : SchdmitCalculateMethod
}

export type EvaluateResult = {
  floors: {
    floor: number;
    name: string;
    min_name: string;
    max_name: string;
    max: number;
    min: number;
    score: string;
    score_grade: string;
    schdmit: evaluateSchdmitValue[];
    carbon: evaluateCarbonationValue[];
    
    main: siteValue;
    grade: siteValue;
    floorInfo: floorInfo
    leak: any;
  };

  header: buildingScoreType;
};


type evaluateSchdmitValue = {
  designed: siteValue
  index: number;
  value : siteValue
}

type evaluateCarbonationValue = {
  designed: siteValue;
  index: number;
  depth: siteValue;
};

type siteValue = {
  c: number | string;
  w: number | string;
  g: number | string;
  b: number | string;
  s: number | string;
};

type floorInfo = {
  area: number | undefined;
  foreground: number;
  total: number;
  totalFloor: number;
  underground: number;
}