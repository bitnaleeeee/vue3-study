import _ from "lodash";


import { _data } from "@/modules/@homecheck/models/common";
import type { _dataType } from "@/modules/@homecheck/models/common";
import { getUnixtime, includeCDN } from "@/modules/@homecheck/libs/min";

import { SafetydiagnosisData } from "./SafetydiagnosisData";
import type { AvailableValue, SafetydiagnosisDatasType, SafetydiagnosisFloorplanType, UploadedImg, notUploadedImg } from "./types";
import { DataTypes, ProjectCategory, FloorplanViewMode, FloorplanViewModeString } from "./enum";
import type {  img } from '../values/common'
import { safetyInspection, appearenceInspection, FixedEnvironment, staticValue, ScoreSupports, Environments, FixedSite, AreaValue, CrackValue, StandardFloor } from "../values";

export class SafetydiagnosisDatas {
  _id: string = "";
  data: SafetydiagnosisData[] = [];
  previous: string = "";
  floorSheet: {
    [floor_id: string]: SafetydiagnosisFloorplanType;
  } = {};

  protected checkPrevious = (item: SafetydiagnosisData, schedule_id: string): Boolean => {
    // 만약 전회차 보이기인 경우, 무조건 true
    if (this.previous) {
      return item.schedule_id != this.previous || item.schedule_id == schedule_id;
    } else {
      return item.schedule_id == schedule_id;
    }
  };

  refresh() {
    const output = [];
    for (let data of this.data) {
      output.push(SafetydiagnosisData.Parse(data));
    }
    this.data = output;
  }

  async combineData(input: SafetydiagnosisDatas) {
    console.time("combineData");
    return new Promise((resolve) => {
      const inputData = input.data;

      // ## SafetydiagnosisData StaticValue 는 별도 처리
      /*
      const INPUT_STATIC = inputData.find((item) => item.type == DataTypes.SAFETYDIAGNOSIS_STATIC);
      const THIS_STATIC = this.data.find((item) => item.type == DataTypes.SAFETYDIAGNOSIS_STATIC);
      if (INPUT_STATIC && THIS_STATIC) {
        // ## 둘다 있는 경우, - 둘을 merge해야함
        // 1) 둘의 값을 비교
      } else if (INPUT_STATIC && !THIS_STATIC) {
        // INPUT만 있는 경우 - INPUT을 this.data에 넣어야함
        this.data.push(INPUT_STATIC);
      } else if (!INPUT_STATIC && THIS_STATIC) {
        // THIS만 있는 경우 - 조치할 필요 없음
      } else if (!INPUT_STATIC && THIS_STATIC) {
        // 둘다 없는 경우 - 조치할 필요 없음
      }
*/
      // ## 서로에게 포함 안된 항목들 - 일방적으로 추가된 항목들
      // 1) 겹치는 항목들의 아이디들
      const intersectionIds = _.intersectionBy(this.data, inputData, "_id").map((_item) => _item._id);
      const differences = inputData.filter((_item) => !intersectionIds.includes(_item._id));

      // ## SafetydiagnosisData를 직렬로 순회하며 전부다 비교하기
      // ( STATIC 타입을 제외하고 )

      //.filter((item) => item.type != DataTypes.SAFETYDIAGNOSIS_STATIC)
      this.data
        .map((item) => {
          // 겹치는 항목이 아니라면 위에서 처리 되었음
          if (!intersectionIds.includes(item._id)) return;

          const compareItem = inputData.find((_item) => _item._id == item._id);

          // SafetydiagnosisData 자체 항목 수정
          const compareKeys = ["memo", "path", "render", "schedule_id", "__log__", "__skip__"];
          const Modified = item.__modified__ >= compareItem!.__modified__;

          for (let key of compareKeys) {
            // 둘의 값이 다른 경우에만 변경사항 적용
            // modified가 남용되는 것을 방지
            if (item[key] != compareItem[key]) {
              item[key] = Modified ? item[key] : compareItem[key];
            }
          }

          // ## SafetydiagnosisData.values 값 비교하기

          // 1) 서로 다른 항목 있다면 그대로 포함,
          const newValues = [];
          const intersectionValueIds = _.intersectionBy(item.values, compareItem!.values, "_id").map((_item) => _item._id);

          const ValueDiff1 = item.values.filter((_item) => !intersectionValueIds.includes(_item._id));
          const ValueDiff2 = compareItem!.values.filter((_item) => !intersectionValueIds.includes(_item._id));

          const ValueDifferences = ValueDiff1.concat(ValueDiff2);

          // 2) 같은 값이 있다면, __modified__를 이용해서 값 엎어 씌우기
          for (let valueItem of item.values) {
            if (!intersectionValueIds.includes(valueItem._id)) continue;

            const valueCompareItem = compareItem!.values.find((_item) => _item._id == valueItem._id)!;
            const valueModified = valueItem.__modified__ >= valueCompareItem.__modified__;
            newValues.push(valueModified ? valueItem : valueCompareItem);
          }

          const concatedValues = newValues.concat(ValueDifferences);
          //console.log(concatedValues)
          if (concatedValues.length > newValues.length) {
            console.log(concatedValues);
          }
          item.values = concatedValues;
        })
        .concat(differences);

      this.data = this.data.concat(differences);
      resolve(null);
      console.timeEnd("combineData");

      //Data 자체에서는 modified 를 통해서 ,memo, path, render, schedule_id, type,
      // __log__ , __skip__
    });
  }

  toJSON() {
    console.time("toJSON");
    const data = JSON.parse(JSON.stringify(this.data)).map((_item: any) => {
      delete _item.__event__;
      delete _item.__event_list__;
      delete _item.__logDebounceTime__;
      delete _item.__logLimit__;
      _item.values = _item.values.map((__item: any) => {
        delete __item.__event__;
        delete __item.__event_list__;
        delete __item.__logDebounceTime__;
        delete __item.__logLimit__;
        return __item;
      });
      return _item;
    });

    const output = {
      data,
      _id: this._id,
      previous: this.previous,
    };
    console.timeEnd("toJSON");
    return output;
  }

  getNotUploadedFiles(): notUploadedImg[] {
    const output = <notUploadedImg[]>[];
    this.data.map((_data) => {
      _data.values
        .filter((_value) => _value.__deleted__ == 0)
        .map((_value) => {
          _value.imgs
            .filter((_img) => _img.__deleted__ == 0)
            .map((_img) => {
              if (!includeCDN(_img.url)) {
                output.push({
                  url: _img.url,
                  data_id: _data._id,
                  value_id: _value._id,
                });
              }
            });
        });
    });

    return output;
  }
  getUploadedFiles(): img[] {
    const debug = [];
    this.data.map((_data) => {
      _data.values
        .filter((_value) => _value.__deleted__ == 0)
        .map((_value) => {
          _value.imgs
            .filter((_img) => _img.__deleted__ == 0)
            .map((_img) => {
              if (includeCDN(_img.url)) {
                debug.push(_img);
              }
            });
        });
    });
    return debug;
  }

  updateUploadFile(img: UploadedImg) {
    this.getItem(img.data_id)
      .getValueByIdWithDeleted(img.value_id)!
      .imgs.find((_img) => _img.url == img.url)!.local = img.url;
    this.getItem(img.data_id)
      .getValueByIdWithDeleted(img.value_id)!
      .imgs.find((_img) => _img.url == img.url)!.url = img.to;
  }

  deleteUploadFile(img: UploadedImg) {
    this.getItem(img.data_id)
      .getValueByIdWithDeleted(img.value_id)!
      .imgs.find((_img) => _img.url == img.url)!.__deleted__ = getUnixtime();
  }

  updateUploadFiles(input: UploadedImg[]) {
    for (let img of input) {
      this.getItem(img.data_id)
        .getValueByIdWithDeleted(img.value_id)!
        .imgs.find((_img) => _img.url == img.url)!.local = img.url;
      this.getItem(img.data_id)
        .getValueByIdWithDeleted(img.value_id)!
        .imgs.find((_img) => _img.url == img.url)!.url = img.to;
    }
  }

  getExcelData() {
    return this.data.filter(
      (_item) => _item.type != DataTypes.SAFETYDIAGNOSIS_STATIC && _item.type != DataTypes.SAFETYDIAGNOSIS_INSPECTION && _item.__deleted__ < 1 //&& // 삭제되지 않은
      //(showPrevious ? true : this.checkPrevious(_item, schedule_id))
    );
  }

  /*
  getViewData(currentFloorplanId: string, schedule_id: string, showPrevious: boolean): SafetydiagnosisData[] {
    // _item.type != environmentInspection.EnvironmentValue &&
    const output = this.data.filter(
      (_item) =>
        _item.type != DataTypes.SAFETYDIAGNOSIS_STATIC &&
        _item.floorplan_id == currentFloorplanId && // 같은 층의 하자
        _item.__deleted__ < 1 //&& // 삭제되지 않은
      //(showPrevious ? true : this.checkPrevious(_item, schedule_id))
    );
    return output;
  }
*/
  getViewData(currentFloorplanId: string): SafetydiagnosisData[] {
    // _item.type != environmentInspection.EnvironmentValue &&
    const output = this.data.filter(
      (_item) =>
        _item.type != DataTypes.SAFETYDIAGNOSIS_STATIC &&
        _item.floorplan_id == currentFloorplanId && // 같은 층의 하자
        _item.__deleted__ < 1 //&& // 삭제되지 않은
      //(showPrevious ? true : this.checkPrevious(_item, schedule_id))
    );
    return output;
  }
  getFilteredViewData(currentFloorplanId: string, viewmode: FloorplanViewMode) {
    const output = this.data.filter((_item) => {
      switch (viewmode) {
        case FloorplanViewMode.Appearences:
          return _item.type == DataTypes.SAFETYDIAGNOSIS_APPEARENCE && _item.floorplan_id == currentFloorplanId && _item.__deleted__ < 1;

        case FloorplanViewMode.Inspections:
          return (
            _item.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION &&
            _item.floorplan_id == currentFloorplanId &&
            _item.__deleted__ < 1 &&
            (_item.values.find((val) => val.type == safetyInspection.SchmidtValue) ||
              _item.values.find((val) => val.type == safetyInspection.CarbonationValue) ||
              _item.values.find((val) => val.type == safetyInspection.RebarValue))
          );

        case FloorplanViewMode.Slope:
          return (
            _item.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION &&
            _item.floorplan_id == currentFloorplanId &&
            _item.__deleted__ < 1 &&
            _item.values.find((val) => val.type == safetyInspection.SlopeValue)
          );

        case FloorplanViewMode.Subsidence:
          return (
            _item.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION &&
            _item.floorplan_id == currentFloorplanId &&
            _item.__deleted__ < 1 &&
            _item.values.find((val) => val.type == safetyInspection.SubsidenceValue)
          );

        case FloorplanViewMode.Measurements:
          return (
            _item.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION &&
            _item.floorplan_id == currentFloorplanId &&
            _item.__deleted__ < 1 &&
            _item.values.find((val) => val.type == safetyInspection.MeasurementValue)
          );

        default:
          return false;
      }
    });
    return output;
  }

  getFilteredViewValue(currentFloorplanId: string, viewmode: FloorplanViewMode) {
    const output = {}
    for (const Data of this.getFilteredViewData(currentFloorplanId, viewmode)) {
       output[Data._id]= Data.getValues()
    }
    
    return output
  }

  concatPrevious(items: SafetydiagnosisData[]): void {
    const previousId = this.previous;
    const concated = this.data.concat(
      items.map((_previous) => {
        _previous.schedule_id = previousId;
        return _previous;
      })
    );
    this.data = _.uniqBy(concated, "_id");
  }

  addItem(): SafetydiagnosisData {
    const output = new SafetydiagnosisData();

    this.data.push(output);
    return output;
  }
  getItem(itemId: string): SafetydiagnosisData {
    return this.data.find((_item) => _item._id == itemId)!;
  }

  getFilteredData(target: string) {
    return this.data.filter((_item) => _item.__deleted__ < 1 && (target == "" ? true : _item.floorplan_id == target || _item.floorplans_id == target));
  }

  getFilteredDataWithSorted(target: string) {
    return this.data
      .filter((_item) => _item.__deleted__ < 1 && (target == "" ? true : _item.floorplan_id == target || _item.floorplans_id == target))
      .sort((a, b) => {
        if (
          this.floorSheet[a.floorplan_id] == undefined ||
          this.floorSheet[b.floorplan_id] == undefined ||
          this.floorSheet[a.floorplan_id].floor == undefined ||
          this.floorSheet[b.floorplan_id].floor == undefined
        ) {
          return -100;
        } else {
          return this.floorSheet[b.floorplan_id].floor - this.floorSheet[a.floorplan_id].floor;
        }
      })
      .reverse();
  }

  protected getDataWithoutDeleted() {
    return this.data.filter((_item) => _item.__deleted__ < 1);
  }

  // 외관 조사 항목 수
  todo_getAppearences(target: string = "") {
    return this.getFilteredDataWithSorted(target).filter((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS_APPEARENCE);
  }

  // 외관 조사 이미지 없음
  todo_getAppearences_noimg(target: string = "") {
    return this.todo_getAppearences(target).filter(
      (_item) =>
        // value들 중에서
        _item.values.filter(
          (__item) =>
            // 이미지가 0인 항목들만 가져오기
            __item.getImgs().length == 0
        ).length > 0
    );
  }

  // 값이 0인 항목

  // 재료 조사 항목 수
  todo_getInspections(target: string = "") {
    return this.getFilteredDataWithSorted(target).filter((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION);
  }

  todo_getInspections_types(target: string = "", inspections?: safetyInspection) {
    let output: AvailableValue[] = [];

    this.todo_getInspections(target).map((_item) => {
      const insertValue = _item.values.filter((__item) => __item.type == inspections);
      output = output.concat.apply(output, insertValue);
    });
    return output;
  }

  // 전역 항목
  getStatics(target: string) {
    return this.getFilteredData(target).filter((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS_STATIC);
  }
  // environment 항목들만 가져오기
  getAllEnvironments(target: string): SafetydiagnosisData[] {
    // 모든 Statics 가져온 후,
    // 그 안에서 value 일치하는 값 가져오기

    const EnvironmentItems = this.getStatics(target).filter((_item) =>
      // Environments 들만 가져오기
      (_item.values as Environments[]).find((__item) => __item.type == staticValue.Environments)
    );

    return EnvironmentItems;
  }

  // environment 항목들만 가져오기
  getEnvironments(target: string, floorplanId: string, floorplansId: string, projectId: string, value: FixedEnvironment): Environments {
    // 모든 Statics 가져온 후,
    // 그 안에서 value 일치하는 값 가져오기

    const EnvironmentItem = this.getStatics(target).find((_item) =>
      // Environments 들만 가져오기
      (_item.values as Environments[]).find((__item) => __item.type == staticValue.Environments && __item.value == value)
    );

    if (!EnvironmentItem) {
      const InsertData = this.addItem();
      InsertData.type = DataTypes.SAFETYDIAGNOSIS_STATIC;
      InsertData.setFloorplanId(floorplanId);
      InsertData.setFloorplansId(floorplansId);
      InsertData.schedule_id = projectId;

      const InsertValue = new Environments();
      InsertValue.floorplan_id = floorplanId;
      InsertValue.floorplans_id = floorplansId;
      InsertValue.schedule_id = projectId;
      InsertValue.value = value;

      InsertData.pushItem(InsertValue);
      return this.getEnvironments(target, floorplanId, floorplansId, projectId, value);
    }

    return EnvironmentItem.getValues()[0] as Environments;
  }

  // 안전진단 A항목들만 따로
  getScoreSupports(target: string): SafetydiagnosisData[] {
    return this.getStatics(target).filter((_item) => {
      //ScoreSupports들만 가져오기
      return (_item.values as ScoreSupports[]).filter((__item) => __item.type == staticValue.ScoreSupports).length > 0;
    });
  }

  getTranslatedScoreSupport(target: string, value_type: appearenceInspection.CrackValue | appearenceInspection.AreaValue): any[] {
    return this.getScoreSupports(target).map((_item) => {
      return {
        ..._item,
        type: DataTypes.SAFETYDIAGNOSIS_APPEARENCE,
        values: (_item.values as ScoreSupports[])
          .filter((__item) => __item.value_type == value_type)
          .map((__item) => {
            return {
              value: __item.value,
              fixedSite: __item.fixedSite,
              grade: __item.grade,
              area: __item.area,
              type: __item.value_type,
              quantity: __item.quantity,
            };
          }),
      };
    });
  }

  getScoreSupport_Appearence(
    target: string,
    floorplanId: string,
    floorplansId: string,
    projectId: string,
    fixedSite: FixedSite,
    value: "구조체 균열" | "박리" | "박락, 층분리" | "누수, 백태" | "철근 노출" = "구조체 균열",
    value_type: appearenceInspection.CrackValue | appearenceInspection.AreaValue
  ): ScoreSupports {
    const FindScoreSupport = this.getScoreSupports(target).find((_item) =>
      (_item.values as ScoreSupports[]).find(
        (__item) => __item.data_type == DataTypes.SAFETYDIAGNOSIS_APPEARENCE && __item.fixedSite == fixedSite && __item.value == value && __item.value_type == value_type
      )
    );

    if (!FindScoreSupport) {
      const InsertData = this.addItem();
      InsertData.type = DataTypes.SAFETYDIAGNOSIS_STATIC;
      InsertData.setFloorplanId(floorplanId);
      InsertData.setFloorplansId(floorplansId);
      InsertData.schedule_id = projectId;

      const InsertValue = new ScoreSupports();
      InsertValue.floorplan_id = floorplanId;
      InsertValue.floorplans_id = floorplansId;
      InsertValue.schedule_id = projectId;
      InsertValue.fixedSite = fixedSite;
      InsertValue.data_type = DataTypes.SAFETYDIAGNOSIS_APPEARENCE;
      InsertValue.value = value;
      InsertValue.value_type = value_type;

      InsertData.pushItem(InsertValue);
      return this.getScoreSupport_Appearence(target, floorplanId, floorplansId, projectId, fixedSite, value, value_type);
    }
    const output = FindScoreSupport!.values[0] as ScoreSupports;
    return output;
  }

  getScoreSupport(target: string) {
    return this.getScoreSupports(target);
  }
  getStandardFloor(floorplans: SafetydiagnosisFloorplansType, category: ProjectCategory = ProjectCategory.Inspection): StandardFloor {
    const findItem = this.getDataWithoutDeleted().find(
      (_item) => _item.floorplans_id == floorplans._id && _item.type == DataTypes.SAFETYDIAGNOSIS_STATIC && _item.values.filter((__item) => __item.type == staticValue.StandardFloor).length > 0
    );
    if (!findItem) {
      const insertData = this.addItem();
      const insertValue = new StandardFloor();
      insertData.type = DataTypes.SAFETYDIAGNOSIS_STATIC;
      insertData.floorplans_id = floorplans._id;
      insertValue.min = this._calculateStandardFloor(floorplans, category);
      insertValue.init(); // generate By min length

      insertData.pushItem(insertValue);
      return this.getStandardFloor(floorplans, category);
    }

    return findItem!.getValueByType(staticValue.StandardFloor) as StandardFloor;
  }
  protected _calculateStandardFloor(floorplans: SafetydiagnosisFloorplansType, category: ProjectCategory): number {
    let area = 0;
    let floors = 0;
    let floorsLength = floorplans.data.filter((_floor) => _floor.__deleted__ < 1).length;
    switch (category) {
      case ProjectCategory.Inspection:
        if (floorplans.gfa < 25000) {
          area = 2;
        } else if (floorplans.gfa < 50000) {
          area = 3;
        } else if (floorplans.gfa <= 75000) {
          area = 4;
        } else {
          area = Math.ceil(floorplans.gfa / 25000) + 1;
        }

        // 1~10층, 11~20층, 21~30층, 이후 + 10층씩
        if (floorsLength < 11) {
          floors = 2;
        } else if (floorsLength < 21) {
          floors = 3;
        } else if (floorsLength < 31) {
          floors = 4;
        } else {
          floors = Math.ceil(floorsLength / 10) + 1;
        }

        break;
      case ProjectCategory.Diagnosis:

      case ProjectCategory.Routine:
      default:
        return 0;
    }

    // 더 높은 쪽 출고
    return area > floors ? area : floors;
  }

  // 비어있는 항목
  todo_getETC(target: string = "") {
    return this.getFilteredData(target).filter((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS);
  }

  //콘크리트 강도
  safety_getMeasurement(target: string) {
    return this.getFilteredDataWithSorted(target)
      .filter((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION)
      .map((_item) => {
        return SafetydiagnosisData.Parse({
          ..._item,
          values: _item.values.filter((__item) => __item.__deleted__ < 1 && __item.type == safetyInspection.MeasurementValue),
        });
      })
      .filter((_item) => _item.values.length != 0);
  }

  //콘크리트 강도
  safety_getSchdmit(target: string) {
    return this.getFilteredDataWithSorted(target)
      .filter((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION)
      .map((_item) => {
        return SafetydiagnosisData.Parse({
          ..._item,
          values: _item.values.filter((__item) => __item.__deleted__ < 1 && __item.type == safetyInspection.SchmidtValue),
        });
      })
      .filter((_item) => _item.values.length != 0);
  }

  //콘크리트 탄산화
  safety_getCarbonation(target: string) {
    return this.getFilteredDataWithSorted(target)
      .filter((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION)
      .map((_item) => {
        return SafetydiagnosisData.Parse({
          ..._item,
          values: _item.values.filter((__item) => __item.__deleted__ < 1 && __item.type == safetyInspection.CarbonationValue),
        });
      })
      .filter((_item) => _item.values.length != 0);
  }

  // 기울기 항목 전부 가져오기
  safety_getSlope(target: string) {
    return this.getFilteredDataWithSorted(target)
      .filter((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION)
      .map((_item) => {
        return SafetydiagnosisData.Parse({
          ..._item,
          values: _item.values.filter((__item) => __item.type == safetyInspection.SlopeValue),
        });
      })
      .filter((_item) => _item.values.length != 0);
  }

  // 부동침하 항목 전부 가져오기
  safety_getSubsidence(target: string) {
    return this.getFilteredDataWithSorted(target)
      .filter((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION)
      .map((_item) => {
        return SafetydiagnosisData.Parse({
          ..._item,
          values: _item.values.filter((__item) => __item.type == safetyInspection.SubsidenceValue),
        });
      })
      .filter((_item) => _item.values.length != 0);
  }

  safety_getCracks_pure(target: string) {
    return this.getFilteredDataWithSorted(target)
      .filter((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS_APPEARENCE)
      .map((_item) => {
        return SafetydiagnosisData.Parse({
          ..._item,
          values: _item.values.filter((__item) => __item.__deleted__ < 1 && __item.type == appearenceInspection.CrackValue && (__item as CrackValue).isInspections),
        });
      })
      .filter((_item) => _item.values.length != 0);
  }

  // 상태평가에 포함되는 크랙
  safety_getCracks(target: string) {
    return this.safety_getCracks_pure(target).concat(this.getTranslatedScoreSupport(target, appearenceInspection.CrackValue));
  }

  safety_getAreas_pure(target: string) {
    return this.getFilteredDataWithSorted(target)
      .filter((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS_APPEARENCE)
      .map((_item) => {
        return SafetydiagnosisData.Parse({
          ..._item,
          values: _item.values.filter((__item) => __item.__deleted__ < 1 && __item.type == appearenceInspection.AreaValue && (__item as AreaValue).isInspections),
        });
      })
      .filter((_item) => _item.values.length != 0);
  }
  // 상태평가에 포함되는 박리 박락
  safety_getAreas(target: string) {
    return this.safety_getAreas_pure(target).concat(this.getTranslatedScoreSupport(target, appearenceInspection.AreaValue));
  }

  safety_getDataList(target: string, value: safetyInspection | appearenceInspection) {
    switch (value) {
      case safetyInspection.CarbonationValue:
        return this.safety_getCarbonation(target);
      case safetyInspection.SchmidtValue:
        return this.safety_getSchdmit(target);
      case safetyInspection.SlopeValue:
        return this.safety_getSlope(target);
      case safetyInspection.SubsidenceValue:
        return this.safety_getSubsidence(target);
      case appearenceInspection.AreaValue:
        return this.safety_getAreas_pure(target);
      case appearenceInspection.CrackValue:
        return this.safety_getCracks_pure(target);
    }
  }

  static Parse(input: SafetydiagnosisDatasType): SafetydiagnosisDatas {
    const output = new SafetydiagnosisDatas();
    output._id = input._id;
    output.data = input.data;
    output.previous = input.previous;
    output.floorSheet = input.floorSheet;
    return output;
  }
}

/*


  protected ____getStatics(floorplanId: string, floorplansId: string, projectId: string): SafetydiagnosisData {
    const staticData = this.data.find((_item) => _item.type == DataTypes.SAFETYDIAGNOSIS_STATIC);
    if (!staticData) {
      const initStaticData = new SafetydiagnosisData();
      initStaticData.type = DataTypes.SAFETYDIAGNOSIS_STATIC;
      initStaticData.setFloorplanId(floorplanId);
      initStaticData.setFloorplansId(floorplansId);
      initStaticData.schedule_id = projectId;
      this.data.push(initStaticData);
      return this.getStatics(floorplanId, floorplansId, projectId);
    }

    return staticData;
  }

  ____getStaticScoreSupports(floorplanId: string, floorplansId: string, projectId: string): ScoreSupports {
    const scoreSupports = this.getStatics(floorplanId, floorplansId, projectId).values.find(
      (_item) => _item.type == staticValue.ScoreSupports
    ) as ScoreSupports;
    if (!scoreSupports) {
      const initScoreData = new ScoreSupports();
      this.getStatics(floorplanId, floorplansId, projectId).pushItem(initScoreData);
      return this.getStaticScoreSupports(floorplanId, floorplansId, projectId);
    }

    return scoreSupports;
  }

  ____getStaticEnvironments(floorplanId: string, floorplansId: string, projectId: string): Environments {
    const environments = this.getStatics(floorplanId, floorplansId, projectId).values.find((_item) => _item.type == staticValue.Environments) as Environments;
    if (!environments) {
      const initScoreData = new Environments();
      this.getStatics(floorplanId, floorplansId, projectId).pushItem(initScoreData);
      return this.getStaticEnvironments(floorplanId, floorplansId, projectId);
    }

    return environments;
  }

*/
