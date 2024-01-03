import _ from "lodash";

import { _data } from "@/modules/@homecheck/models/common";

import type { SafetydiagnosisFloorplanType, SafetydiagnosisFloorplansType, SafetydiagnosisProjectType, SafetydiagnosisSpaceType } from "./types";
import { ProjectCategoryString } from "./enum";

/**
 * 건축물 군집 단위
 */
export class SafetydiagnosisSpace extends _data {
  _id: string = "";
  user_id: string = "";
  floorplans: SafetydiagnosisFloorplansType[] = [];
  hidden: boolean = false;
  name: string = "";
  projects: SafetydiagnosisProjectType[] = []; // schedule_id 배열

  addFloorplans(input: SafetydiagnosisFloorplansType) {
    this.floorplans.unshift(input);
  }

  hasUsableFloorplan(): boolean {
    return this.getFloorplans().filter((_item) => _item.data.filter((__item) => __item.__deleted__ < 1)).length > 0;
  }

  getProjectCategories() {
    return ProjectCategoryString;
  }

  getFloorplans(): SafetydiagnosisFloorplansType[] {
    return this.floorplans.filter((_item) => (_item.__deleted__ < 1 || _item.__deleted__ == null) && _item.data.filter((__item) => __item.__deleted__ < 1).length != 0);
  }

  getFloorplansWithEmpty(): SafetydiagnosisFloorplansType[] {
    return this.floorplans.filter((_item) => _item.__deleted__ < 1 || _item.__deleted__ == null);
  }

  getFloorplansNameById() {
    const output = {};
    this.getFloorplans().map((_floorplan) => {
      output[_floorplan._id] = _floorplan.name;
      _floorplan.data.map((__floorplan) => {
        output[__floorplan._id] = __floorplan.name;
      });
    });
    return output;
  }
  getFloorplansValueSheetById() {
    const output = {};
    this.getFloorplans().map((_floorplan) => {
      output[_floorplan._id] = _floorplan;
      _floorplan.data.map((__floorplan) => {
        output[__floorplan._id] = __floorplan;
      });
    });
    return output;
  }
  getFloorplanNameById() {
    const output = {};
    this.projects.map((_project) => {
      output[_project._id] = _project.name;
    });
    return output;
  }

  getFloorplan(index: number): SafetydiagnosisFloorplansType {
    return this.getFloorplans()[index];
  }
  getFloorplanSorted() {}
  getFloorplanById(id: string): SafetydiagnosisFloorplansType {
    return this.floorplans.find((_floorplan) => _floorplan._id == id)!;
  }
  getBuildingById(id: string): SafetydiagnosisFloorplansType {
    return this.getFloorplanById(id);
  }
  getBuildingFloorsById(buildingId: string) : SafetydiagnosisFloorplanType[] {
    return this.getBuildingById(buildingId).data.filter((floor)=> floor.__deleted__ < 1)
  }


  getFloors(index: number) {
    return this.getFloorplans()[index].data.filter((_item) => _item.__deleted__ < 1);
  }
  getFloorsSorted(index: number) {
    return this.getFloorplans()
      [index].data.filter((_item) => _item.__deleted__ < 1)
      .sort((a, b) => {
        return a.floor - b.floor;
      });
  }
  getFloorsSortedById(id: string) {
    return this.getFloorplanById(id)
      .data.filter((_item) => _item.__deleted__ < 1)
      .sort((a, b) => {
        return a.floor - b.floor;
      });
  }
  getFloor(index: number, floorIndex: number) {
    return this.getFloors(index)[floorIndex];
  }
  getFloorById(building_id: string, floor_id: string) {
    return this.getFloorplanById(building_id).data.find((floor) => floor._id == floor_id);
  }

  getFloorInfoById(id: string) {
    // 지하 n층
    // 지상 n층
    // 총 n층
    const { gfa, data } = this.getFloorplanById(id);
    const floors = data.filter((_floor) => _floor.__deleted__ < 1).map((_floor) => _floor.floor);

    return {
      area: gfa,
      underground: _.min(floors),
      foreground: _.max(floors),
      total: floors.length,
    };
  }

  getProjectsNameById() {
    const output = {};
    this.projects.map((_project) => {
      output[_project._id] = _project.name;
    });
    return output;
  }

  changeFloorplansDataById(id: string, property: string, value: string) {
    const findIndex = this.floorplans.findIndex((_floorplan) => _floorplan._id == id);
    this.floorplans[findIndex] = {
      ...this.floorplans[findIndex],
      data: this.floorplans[findIndex].data.map((_item) => {
        return {
          ..._item,
          [property]: value,
        };
      }),
    };
  }

  getProjects(): SafetydiagnosisProjectType[] {
    // 삭제된 항목만 제외
    return this.projects.filter((_item) => _item.__deleted__ < 1);
  }
  getProject(index: number): SafetydiagnosisProjectType {
    return this.getProjects()[index];
  }

  getProjectById(id: string): SafetydiagnosisProjectType {
    return this.projects.filter((_item) => _item._id == id)[0];
  }

  static Parse(input: SafetydiagnosisSpaceType): SafetydiagnosisSpace {
    const output = new SafetydiagnosisSpace();
    Object.assign(output, input);
    return output;
  }
}
