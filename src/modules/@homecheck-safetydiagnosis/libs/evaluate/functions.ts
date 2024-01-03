import {
  FixedSite,
  grade,
  SchdmitCalculateMethod,
  gradeScore,
  gradeTransformDesc,
  gradeTransformAngle,
  InspectionFormula,
  BuildingInspection,
  SubsidenceValue,
  SlopeValue,
  SafetydiagnosisFloorplansType,
} from "@/modules/@homecheck-safetydiagnosis/models";
import _ from 'lodash'

export const getFloorInfo = (targetBuilding: SafetydiagnosisFloorplansType) => {
  const {gfa, data} = targetBuilding;
  const floors = data.filter((_floor) => _floor.__deleted__ < 1).map((_floor) => _floor.floor);

  return {
    area: gfa,
    underground: _.min(floors),
    foreground: _.max(floors),
    total: floors.length,
  };
};


export const calcGrade = (score: number) => {
  if (score >= 8) return grade.E;
  else if (score >= 6) return grade.E;
  else if (score >= 4) return grade.C;
  else if (score >= 2) return grade.B;

  return grade.A;
};

export const findMainValue = (site : FixedSite, main_table : {t : FixedSite, p : number, m: number}[]) => {
for (const item of main_table) {
    if (item.t == site) {
        return item.m.toFixed(2);
    }
    }

    return 0;
};
