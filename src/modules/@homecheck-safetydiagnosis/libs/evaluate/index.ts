import {ref, onMounted} from "vue";
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
  StandardFloor,
  SchmidtValue,
  CrackValue,
  SafetydiagnosisDatas,
  SafetydiagnosisFloorplansType,
} from "@/modules/@homecheck-safetydiagnosis/models";
import type { buildingScoreType, ScoreStringType, applySchdmitFormula, EvaluateResult} from "./types"
import { calcGrade, getFloorInfo, findMainValue } from './functions'


// 표본층 Array
// 슈미트해머 저강도, 고강도
// computedData
// targetBuilding_id

  const sites = {c: 0, w: 0, g: 0, b: 0, s: 0};
// 정밀 안전 점검 상태평가
export const buildEvaluateData = (datas: SafetydiagnosisDatas, targetBuilding: SafetydiagnosisFloorplansType ,schdmitMethod: applySchdmitFormula) : EvaluateResult => {
    const StandardFloor = datas.getStandardFloor(targetBuilding);

  const CalculatedFloors = getCalculatedFromFloors(datas, targetBuilding, StandardFloor, schdmitMethod);

  const BI = getBuildingInspection(CalculatedFloors);

 const ScoreInfo = getScoreString(datas, StandardFloor, BI);
    

    for (const f of CalculatedFloors) {
        for (const bi_f of BI.floorArray) {
        if (f.floor == bi_f.floor) {
            f.main = {...sites};
            f.grade = {...sites};

            f.main[FixedSite.Slab] = findMainValue(FixedSite.Slab, bi_f.main_table);
            f.main[FixedSite.Girder] = findMainValue(FixedSite.Girder, bi_f.main_table);
            f.main[FixedSite.Beam] = findMainValue(FixedSite.Beam, bi_f.main_table);
            f.main[FixedSite.Column] = findMainValue(FixedSite.Column, bi_f.main_table);
            f.main[FixedSite.Wall] = findMainValue(FixedSite.Wall, bi_f.main_table);

            f.grade[FixedSite.Slab] = calcGrade(f.main[FixedSite.Slab]);
            f.grade[FixedSite.Girder] = calcGrade(f.main[FixedSite.Girder]);
            f.grade[FixedSite.Beam] = calcGrade(f.main[FixedSite.Beam]);
            f.grade[FixedSite.Column] = calcGrade(f.main[FixedSite.Column]);
            f.grade[FixedSite.Wall] = calcGrade(f.main[FixedSite.Wall]);

            f.score = bi_f.score.toFixed(2);
            f.score_grade = calcGrade(bi_f.score);
        }
        }
    }

    return {
    header : ScoreInfo,
      floors :  CalculatedFloors
    };
};

function getScoreString(datas : SafetydiagnosisDatas, standardFloor:StandardFloor, bi : BuildingInspection) {
    const bi_result = {
        score: bi.score,
        tsValue: bi.tsValue,
        inspection_score : bi.inspection_score
    };
    const output: buildingScoreType = {
        slope: {
        max: 0,
        value: "",
        string: "",
        },
        subsidence: {
        max: 0,
        value: "",
        string: "",
        },
        ssScore: {
        score: "0.0",
        gradeString: "",
        },
        inspection: {
        score: "0.0",
        gradeString: "",
        },
        totalScore: {
        score: "0.0",
        gradeString: "",
        },
    };

    // StandardFloor 루프
    for (let _standardFloor of standardFloor.values) {
        const slope_data = datas.safety_getSlope(_standardFloor._id);
        for (const sl of slope_data) {
            for (const slv of sl.values) {
                const grade = (slv as SlopeValue).getGrade();
                const score = gradeScore[grade];

                if (output.slope.max < score) {
                    output.slope.string = gradeTransformDesc[grade];
                    output.slope.value = gradeTransformAngle[grade];
                }
            }
        }

        const sub_data = datas.safety_getSubsidence(_standardFloor._id);
        for (const su of sub_data) {
            for (const suv of su.values) {
                const grade = (suv as SubsidenceValue).getGrade();
                const score = gradeScore[grade];

                if (output.subsidence.max < score) {
                    output.subsidence.string = gradeTransformDesc[grade];
                    output.subsidence.value = gradeTransformAngle[grade];
                }
            }
        }
    }

    //
    
    
    
    
    
  if (output.slope.max == -999) {
    output.slope.string = gradeTransformDesc["A"];
    output.slope.value = gradeTransformAngle["A"];
    output.slope.max = 1;
  }

  if (output.subsidence.max == -999) {
    output.subsidence.string = gradeTransformDesc["A"];
    output.subsidence.value = gradeTransformAngle["A"];
    output.subsidence.max = 1;
  }

  output.totalScore.score = bi_result.score.toFixed(2);
  output.totalScore.gradeString = calcGrade(bi_result.score);
  output.inspection.score = bi_result.inspection_score.toFixed(2);
  output.inspection.gradeString = calcGrade(bi_result.inspection_score);
  output.ssScore.score = `${bi_result.tsValue.toFixed(2)}`;
    output.ssScore.gradeString = calcGrade(bi_result.tsValue);
    
    return output
}

function getCalculatedFromFloors(
  datas: SafetydiagnosisDatas,
targetBuilding: SafetydiagnosisFloorplansType,
  standardFloor: StandardFloor,
  schdmitMethod: applySchdmitFormula
) {
  const output = [];
  let totalFloorCount = 0;
  for (let _floor of standardFloor.values) {
    totalFloorCount += _floor.includedFloor.length + 1;
  }

  for (let _standardFloor of standardFloor.values) {
    let formula = new InspectionFormula();

    let floorList = [_standardFloor._id];
    for (const f of _standardFloor.includedFloor) {
      floorList.push(f._id);
    }

    // 층 이름과 층 수 처리
    let min = 999;
    let min_name = "";
    let max = -999;
    let max_name = "";

    if (_standardFloor.floor < min) {
      min = _standardFloor.floor;
      min_name = _standardFloor.name;
    }
    if (_standardFloor.floor < max) {
      max = _standardFloor.floor;
      max_name = _standardFloor.name;
    }

    for (const f of _standardFloor.includedFloor) {
      if (f.floor == 0) continue;

      if (f.floor < min) {
        min = f.floor;
        min_name = f.name;
      }

      if (f.floor > max) {
        max = f.floor;
        max_name = f.name;
      }
    }

    const schdmit_data = datas.safety_getSchdmit(_standardFloor._id);
    let schdmit = [];
    let schdmit_index = 1;
    let schdmit_site_index = {...sites};

    for (const s of schdmit_data) {
      for (const sv of (s.values as SchmidtValue[])) {
        if (!sv.getSite()) continue;

        if (schdmit_site_index[sv.getSite()] > schdmit.length - 1) {
          let value = {...sites};
          let designed = {...sites};

          value[sv.getSite()] = sv.getCalculateWithMethod(schdmitMethod);
          designed[sv.getSite()] = sv.designedStrength;

          schdmit_site_index[sv.getSite()]++;

          schdmit.push({
            value: value,
            designed: designed,
            index: schdmit_index++,
          });
        } else {
          schdmit[schdmit_site_index[sv.getSite()]].value[sv.getSite()] = sv.getCalculateWithMethod(schdmitMethod);
          schdmit[schdmit_site_index[sv.getSite()]].designed[sv.getSite()] = sv.designedStrength;
          schdmit_site_index[sv.getSite()]++;
        }
      }
    }

    // console.log(crack_data)

    let crack_result = {
      A: {...sites},
      B: {...sites},
      C: {...sites},
      D: {...sites},
      E: {...sites},
      l20: {...sites},
      o20: {...sites},
    };

    for (const floorID of floorList) {
      const crack_data = safetydiagnosisApp.value.currentProjectDatas.safety_getCracks(floorID);
      for (const c of crack_data) {
        for (const cv of (c.values as CrackValue[])) {
          if (!cv.fixedSite) continue;
          if (cv.grade) {
            crack_result[cv.grade][cv.fixedSite] += cv.quantity;
          }

          if (cv.area) {
            crack_result[cv.area][cv.fixedSite] += cv.quantity;
          }
        }
      }
      formula.Parser(crack_data);
    }

    // console.log(crack_result)

    const carbon_data = safetydiagnosisApp.value.currentProjectDatas.safety_getCarbonation(_standardFloor._id);

    let carbon = [];
    let carbon_index = 1;
    let carbon_site_index = {...sites};

    for (const c of carbon_data) {
      for (const cv of c.values) {
        if (!cv.site) continue;

        if (carbon_site_index[cv.site] > carbon.length - 1) {
          let depth = {...sites};
          let designed = {...sites};
          depth[cv.site] = cv.depth;
          designed[cv.site] = cv.rebar.thickness;

          carbon_site_index[cv.site]++;

          carbon.push({
            depth: depth,
            designed: designed,
            index: carbon_index++,
          });
        } else {
          carbon[carbon_site_index[cv.site]].depth[cv.site] = cv.depth;
          carbon[carbon_site_index[cv.site]].designed[cv.site] = cv.rebar.thickness;
          carbon_site_index[cv.site]++;
        }
      }
    }

    // 표면노후

    let Exfoliation_result = {
      A: {...sites},
      B: {...sites},
      C: {...sites},
      D: {...sites},
      E: {...sites},
      l10: {...sites},
      o10: {...sites},
    };

    let Spalling_result = {
      A: {...sites},
      B: {...sites},
      C: {...sites},
      D: {...sites},
      E: {...sites},
      l20: {...sites},
      o20: {...sites},
    };

    let Leak_result = {
      A: {...sites},
      B: {...sites},
      C: {...sites},
      D: {...sites},
      E: {...sites},
    };

    let Exposure_result = {
      A: {...sites},
      B: {...sites},
      C: {...sites},
      D: {...sites},
      E: {...sites},
    };

    for (const floorID of floorList) {
      const area_data = datas.safety_getAreas(floorID);

      for (const a of area_data) {
        for (const av of a.values) {
          if (!av.fixedSite) continue;

          if (av.value == "박리") {
            Exfoliation_result[av.grade][av.fixedSite] += av.quantity;

            if (av.area) {
              Exfoliation_result[av.grade][av.area] += av.quantity;
            }
          }

          if (av.value == "박락, 층분리") {
            Spalling_result[av.grade][av.fixedSite] += av.quantity;

            if (av.area) {
              Exfoliation_result[av.grade][av.area] += av.quantity;
            }
          }

          if (av.value == "누수, 백태") {
            Leak_result[av.grade][av.fixedSite] += av.quantity;
          }

          if (av.value == "철근 노출") {
            Exposure_result[av.grade][av.fixedSite] += av.quantity;
          }
        }
      }

      formula.Parser(area_data);
    }

    const slope_data = datas.safety_getSlope(_standardFloor._id);

    const sub_data = datas.safety_getSubsidence(_standardFloor._id);

    formula.Parser(schdmit_data, schdmitMethod.low, schdmitMethod.high);
    formula.Parser(carbon_data);
    formula.Parser(slope_data);
    formula.Parser(sub_data);

    const formula_result = formula.toObject();
    // console.log(formula_result)

    output.push({
      floor: _standardFloor.floor,
      name: _standardFloor.name,
      min_name,
      max_name,
      min,
      max,
      schdmit: schdmit,
      crack: crack_result,
      carbon: carbon,
      exfoliation: Exfoliation_result,
      spalling: Spalling_result,
      leak: Leak_result,
      exposure: Exposure_result,
      floorInfo: {
        ...getFloorInfo(targetBuilding),
        totalFloor: totalFloorCount,
      },
      data: formula_result,
    });
  }

  return output.sort((a, b) => a.floor - b.floor);
}

function getBuildingInspection(data : object[]): BuildingInspection {
    const bi = new BuildingInspection();
    bi.TotalParser(data)
    return bi
}



