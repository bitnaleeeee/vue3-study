export enum DataTypes {
  NONE = "",
  SAFETYDIAGNOSIS = "Sa", // 안전 진단
  SAFETYDIAGNOSIS_APPEARENCE = "Saa", // 외관 조사
  SAFETYDIAGNOSIS_INSPECTION = "Sam", // 정밀 안전 점검
  SAFETYDIAGNOSIS_DIAGNOSIS = "Sad", // 정밀 안전 점검
  SAFETYDIAGNOSIS_STATIC = "SS", // 안전진단 정적
}

export const DataTypesString: { [key in DataTypes]: string } = {
  [DataTypes.NONE]: "",
  [DataTypes.SAFETYDIAGNOSIS]: "안전 진단",
  [DataTypes.SAFETYDIAGNOSIS_APPEARENCE]: "외관 조사",
  [DataTypes.SAFETYDIAGNOSIS_INSPECTION]: "정밀 안전 점검",
  [DataTypes.SAFETYDIAGNOSIS_DIAGNOSIS]: "정밀 안전 진단",
  [DataTypes.SAFETYDIAGNOSIS_STATIC]: "기타",
};

export enum FloorplanViewMode {
  Appearences = "appearences",
  Inspections = "materials",
  Subsidence = "subsidence",
  Slope = "slope",
  Measurements = "measurements",
}

export const FloorplanViewModeString = {
  [FloorplanViewMode.Appearences]: "외관 조사",
  [FloorplanViewMode.Inspections]: "재료 조사",
  [FloorplanViewMode.Subsidence]: "부동 침하 조사",
  [FloorplanViewMode.Slope]: "기울기 조사",
  [FloorplanViewMode.Measurements]: "부재 측정",
};

export enum SafetydiagnosisChecklistDataType {
  Repairs = "r",
  Sites = "s",
  Appearences = "a",
}

/**
 * 정기 안전 점검,
 */
export enum ProjectCategory {
  Routine = "r", //정기 안전 점검
  Inspection = "i", // 정밀 안전 점검
  Diagnosis = "d", // 정밀 안전 진단
}

export const ProjectCategoryString: { [key in ProjectCategory]: string } = {
  [ProjectCategory.Routine]: "정기 안전 점검",
  [ProjectCategory.Inspection]: "정밀 안전 점검",
  [ProjectCategory.Diagnosis]: "정밀 안전 진단",
};

export enum BuildingFacility {
  Type1 = "1", // 1종 시설물
  Type2 = "2", // 2종 시설물
  Type3 = "3", // 3종 시설물
  Apartment = "a",
}

export const ProjectFacilityString: { [key in BuildingFacility]: string } = {
  [BuildingFacility.Type1]: "1종 시설물",
  [BuildingFacility.Type2]: "2종 시설물",
  [BuildingFacility.Type3]: "3종 시설물",
  [BuildingFacility.Apartment]: "아파트",
};

export enum BuildingStructureType {
  Rahmen = "R",
  Wall = "W",
  FlatSlab = "FS",
}
export const BuildingStructureTypeString: { [key in BuildingStructureType]: string } = {
  [BuildingStructureType.Rahmen]: "라멘",
  [BuildingStructureType.Wall]: "벽식",
  [BuildingStructureType.FlatSlab]: "무량판",
};

export enum BuildingMaterialType {
  RC = "R",
  STEEL = "S",
  //SRC = 'SRC'
}
export const BuildingMaterialTypeString = {
  [BuildingMaterialType.RC]: "RC",
  [BuildingMaterialType.STEEL]: "철골조",
};

export const safetydiagnosisChecklistString: { [key in SafetydiagnosisChecklistDataType]: string } = {
  [SafetydiagnosisChecklistDataType.Repairs]: "보수 방안",
  [SafetydiagnosisChecklistDataType.Appearences]: "외관 조사",
  [SafetydiagnosisChecklistDataType.Sites]: "부재",
};
