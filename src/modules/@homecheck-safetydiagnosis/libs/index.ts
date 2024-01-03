import _ from "lodash";
import { Process } from '@/modules/@homecheck/libs/Process'
import { CacheImage } from "@/modules/@homecheck/libs/CacheStorage";
import { Lib } from "@/modules/@homecheck";
import { SafetydiagnosisSpace, ProjectCategory, SafetydiagnosisDatas, SafetydiagnosisChecklist, ProjectCategoryString } from "@/modules/@homecheck-safetydiagnosis/models";
import type { AvailableValue, FixedEnvironment, SafetydiagnosisProjectType, safetyInspection } from "@/modules/@homecheck-safetydiagnosis/models";
import { CacheStorageDB } from "@/modules/@homecheck/libs/CacheStorage";
import { updateBuildings } from "./building";
import { addSpaceItem, deleteSpaceItem, updateSpaceItem, getLocalSpaces, refreshSpaces } from "./space";
import { getLocalChecklist, refreshChecklist } from "./settings";
import { getSafetydiagnosisDatas, getSafetydiagnosisDatasRaw, uploadProjectData, addProjectItem, updateProjects } from "./project";
import { loadLastRefreshTime, resetRefreshTime, getRefreshTimeString, getExportOption, setExportOption } from "./etc";
import { getPurchaseHistory } from "./history";
import { refreshCredit, getPurchaseInfo, purchaseProject } from "./purchase";
import { ProcessPolicy } from "@/modules/@homecheck/libs/Process/types";

export { reversePath, calculatePath } from "./functions";

type eventName =
  "onErrorEditEnd" |
  "onSaveLocalData" |
  "onSpacePhotoDownloading" |
  "onRefresh" | "onRefreshed" 
  | "onUpload" | "onUploadProgress" | "onUploadEnd" | "onUploadException"
  |"onAccountUnvalid";

export class SafetydiagnosisApp {
  eventList: { [key in eventName]: any } = {
    onErrorEditEnd: () => {},
    onSaveLocalData: () => {},
    onSpacePhotoDownloading: (progress: number, total: number) => {},
    onRefresh: () => {},
    onRefreshed: () => {},
    onUpload: () => {},
    onUploadProgress: (progress: number, message: string, total: number) => {},
    onUploadEnd: (arg: any) => {},
    onUploadException: (message: string) => {},
    onAccountUnvalid: () => {},
  };

  addEventListener(eventName: eventName, action: () => void) {
    this.eventList[eventName] = action;
  }
  mode: "local" | "none" = "none";
  //기존의 Account
  account: string = "";

  // 기존의 Settings
  checklist: SafetydiagnosisChecklist = new SafetydiagnosisChecklist();

  credit: number = 0;

  //// Datas

  //____Spaces
  spaces: SafetydiagnosisSpace[] = [];

  // ____computedSpace
  currentSpace: SafetydiagnosisSpace = new SafetydiagnosisSpace();

  // ____computedProject
  currentProject: SafetydiagnosisProjectType = {
    _id: "",
    __created__: 0,
    __deleted__: 0,
    __modified__: 0,
    data_id: "",
    previous: "",
    category: ProjectCategory.Routine,
    name: "",
    memo: "",
  };
  currentProjectDatas: SafetydiagnosisDatas = new SafetydiagnosisDatas();

  //// Datas 정보

  //computedProjectCategory
  currentProjectCategory: ProjectCategory = ProjectCategory.Routine;

  getCurrentProjectCategoryString() {
    return ProjectCategoryString[this.currentProjectCategory];
  }

  // computedIsInspectionProject
  isInspectionProject(): Boolean {
    return this.currentProjectCategory == ProjectCategory.Inspection;
  }

  //// Selected 시리즈

  // 대체 BuildingIndex
  selectedSpaceId: string = "";

  // ScheduleIndex 대체
  selectedProjectId: string = "";

  // 기존의 SelectedErrorId
  selectedErrorId: string = "";

  // 기존의 SelectedValueId
  selectedErrorValueId: string = "";

  // 기존의 SelectedFloorplanIndex
  // 기존의 SelectedFloorplan

  selectedBuildingId: string = "";
  selectedFloorId: string = "";

  ///// 현재 앱 진행 상황

  // 기존의 _new
  isAddingNewValue: boolean = false;

  // CaptureEnvironment :: 현재 촬영하려는 environmentKey
  captureEnvironmentKey: string = "";

  local_cachedProjectData: string[] = [];
  local_notUploadedDataId: { [key: string]: boolean } = {};

  isLocalMode: boolean = false;

  //

  purchaseInfo: any | string = "";

  async refreshPurchaseInfo() {
    this.purchaseInfo = await getPurchaseInfo(this.currentSpace._id, this.currentProject._id);
  }

  async purchaseProject() {
    /*
  await changeLoading({
    title: "서비스 구매",
    message: "구매를 진행하는 중입니다.",
    progress: 0,
    view: true,
  });
  */

    this.purchaseInfo = await purchaseProject(this.currentSpace._id, this.currentProject._id);
    /*
    await changeLoading({
      title: "서비스 구매",
      message: "구매가 완료되었습니다.",
      progress: 100,
    });
    */
    /*
    await changeLoading({
      title: "서비스 구매 실패",
      message: "금액을 확인 후 다시 시도해주세요",
      progress: -1,
    });
    */
    console.log(this.purchaseInfo);
  }

  async init() {
    console.log(`[@homecheck-safetydiagnosis] loaded, ${Lib.storagePath}`);
    this.mode = Lib.storagePath;
    this.account = Lib.account;
    this.isLocalMode = this.mode == "local";
    // 1회에 한하여 로드 또는 리프레시 정하기
    this.isLocalMode ? await this.reload() : await this.refresh();
  }

  async CheckFloorplanFiles(): Promise<Boolean> {
    if (!this.isLocalMode) return false;

    let bool: boolean = true;
    for await (const fp of this.currentSpace.getFloorplans()) {
      if (fp.__deleted__ > 1) continue;
      for await (const f of fp.data) {
        if (f.__deleted__ > 1) continue;
        const cdnURL = `https://homecheck.kr/cdn/?f=${f.img}`;
        const isExist = await CacheImage.isExist(cdnURL);
        if (isExist) continue;
        try {
          await CacheImage.set(cdnURL);
        } catch (ex) {
          bool = false;
        }
      }
    }

    console.log(bool);

    return bool;
  }

  // 로컬 전용, 로컬 파일 읽어오기
  async reload() {
    this.account = await CacheStorageDB.get("account");
    console.log(this.account);
    if (!this.account) {
      this.eventList.onAccountUnvalid();
      return;
    }

    this.spaces = await getLocalSpaces(this.account);
    this.checklist = await getLocalChecklist(this.account);
    this.local_notUploadedDataId = await this.getNotUploadedList();
  }

  // 일반적으로 모든 데이터들 새로 고침
  async refresh() {
    this.eventList.onRefresh();
    await this.refreshSpaceList();
    this.checklist = await this.refreshAccountChecklist();
    this.credit = await refreshCredit();
    this.eventList.onRefreshed();
  }
  async refreshAccountChecklist() {
    return await refreshChecklist(this.account, this.isLocalMode); // this.isLocalMode
  }

  async refreshSpaceList() {
    this.spaces.length = 0;
    this.spaces.push(...(await refreshSpaces(this.account, this.isLocalMode, this.eventList.onSpacePhotoDownloading))); // this.isLocalMode
  }

  async selectSpace(id: string) {
    this.selectedSpaceId = id;
    if (id == "") {
      this.currentSpace = new SafetydiagnosisSpace();
      return;
    }
    this.currentSpace = this.spaces.find((space) => space._id == id)!;

    if (this.currentSpace.getFloorplansWithEmpty().length > 0) {
      this.selectedBuildingId = this.currentSpace.getFloorplan(0)._id;
      this.selectedFloorId = this.currentSpace.getBuildingFloorsById(this.selectedBuildingId)[0]._id;
    }
    if (this.isLocalMode) {
      await this.loadCachedProjects();
    }
  }
  selectBuilding(id: string) {
    this.selectedBuildingId = id;
    const floors = this.currentSpace.getBuildingFloorsById(this.selectedBuildingId);
    if (floors.length > 0) {
      this.selectedFloorId = floors[0]._id;
      
    }
  }

  selectFloor(id: string) {
    this.selectedFloorId = id;
  }

  selectError(id: string) {
    if (!(this.selectedErrorId == id) && !id) {
      this._onErrorEditEnd();
    }
    this.selectErrorValue("");
    this.selectedErrorId = id;
  }
  getSelectedError() {
    return this.currentProjectDatas.getItem(this.selectedErrorId);
  }

  selectErrorValue(id: string) {
    this.selectedErrorValueId = id;
    if (!id) {
      this.currentErrorValue = undefined;
    } else {
      this.currentErrorValue = this.getSelectedErrorValue();
    }
  }

  async addSpace(name: string) {
    const addedSpaceId = await addSpaceItem(name, this.spaces.length);
    await this.refreshSpaceList();
    this.selectSpace(addedSpaceId);
  }

  async deleteSpace() {
    /*
      changeLoading({
    title: "삭제하는 중",
    view: true,
  });

    */
    await deleteSpaceItem(this.currentSpace);

    this.selectProject("");
    this.selectSpace("");
    await this.refreshSpaceList();

    /*
        changeLoading({
      title: "삭제 완료",
      progress: 100,
    });
    */
  }

  async updateSpace() {
    if (!this.selectedSpaceId) return null;

    return await updateSpaceItem(this.currentSpace);
  }

  async updateBuilding() {
    return await updateBuildings(this.currentSpace);
  }

  async addProject(name: string, previous: string, category: ProjectCategory) {
    const addedProject = await addProjectItem(this.currentSpace, name, previous, category);
    this.currentSpace.projects.unshift(addedProject);

    this.selectProject(addedProject._id);
  }

  async updateProject() {
    return await updateProjects(this.currentSpace);
  }

  getSelectedErrorValue() {
    return this.getSelectedError().getValueById(this.selectedErrorValueId);
  }

  currentErrorValue?: AvailableValue = undefined;

  getSelectedBuildings() {
    return this.currentSpace.getFloorplans();
  }
  getSelectedBuilding() {
    return this.currentSpace.getBuildingById(this.selectedBuildingId);
  }
  getSelectedFloors() {
    return this.currentSpace.getBuildingFloorsById(this.selectedBuildingId);
  }
  getSelectedFloor() {
    return this.currentSpace.getFloorById(this.selectedBuildingId, this.selectedFloorId);
  }

  async getExportOption() {
    return await getExportOption(this.currentSpace._id, this.currentProject._id);
  }
  async setExportOption(value: any) {
    return await setExportOption(this.currentSpace._id, this.currentProject._id, value);
  }

  releaseSpace() {
    this.selectedSpaceId = "";
  }

  async selectProject(id: string) {
    this.selectedProjectId = id;
    if (id == "") {
      return;
    }

    this.currentProject = this.currentSpace.getProjectById(this.selectedProjectId);
    console.log("[@homecheck-safetydiagnosis] selectProject : ", this.currentProject);
    this.currentProjectCategory = this.currentProject.category ? this.currentProject.category : ProjectCategory.Routine;
    this.currentProjectDatas = await getSafetydiagnosisDatas(this.currentSpace, this.currentProject, this.isLocalMode);
  }

  async uploadProjectData(project?: SafetydiagnosisProjectType ) {
    const targetProject = project ? project : this.currentProject;
    // 업로드 시작할 때,
    this.eventList.onUpload();
    uploadProjectData(this.currentSpace, 
      targetProject, 
      this.isLocalMode, 
      this.eventList.onUploadProgress,
    this.currentProjectDatas
    ).then(async result => {
          // 업로드 끝났을 때,
          this.eventList.onUploadEnd(result);
          if ((result == true) && project!) {
                this.local_notUploadedDataId = {
                  ...this.local_notUploadedDataId,
                  [`${project.data_id}`]: false,
            };
            // 업로드 해야할목록에서 삭제
            await this.removeNotUploadedList(targetProject.data_id);

          }
      }).catch(ex => {
        this.eventList.onUploadException(ex)
      });
  }

  async loadCachedProjects() {
    const output = [];
    for await (let _item of this.currentSpace.getProjects()) {
      output.push(await CacheStorageDB.get(_item.data_id));
    }
    this.local_cachedProjectData = output;
  }
  async getPurchaseHistory() {
    return await getPurchaseHistory();
  }

  getProjectCheatsheet() {
    return this.currentSpace.getProjectsNameById();
  }

  getMarks() {
    return this.currentProjectDatas.getViewData(this.selectedFloorId);
  }

  getStandardFloor() {
    return this.currentProjectDatas.getStandardFloor(this.getSelectedBuilding(), this.currentProjectCategory);
  }

  getAppearenceLength(target: string) {
    return this.currentProjectDatas.todo_getAppearences(target).length;
  }

  getAppearenceNoImgLength(target: string) {
    return this.currentProjectDatas.todo_getAppearences_noimg(target).length;
  }

  getInspectionLength(target: string, key: safetyInspection) {
    return this.currentProjectDatas.todo_getInspections_types(target, key).length;
  }

  getEnvironmentLength(target: string, key: FixedEnvironment) {
    return this.currentProjectDatas.getEnvironments(target, key).length;
  }

  getNotUploadedLength = () => {
    return _.toArray(this.local_notUploadedDataId).filter((item) => item).length;
  };

  protected getNotUploadedList = async (): Promise<{ [key: string]: boolean }> => {
    const uploadList = await CacheStorageDB.get(this.DataId_Upload_List);
    return uploadList ? uploadList : {};
  };

  protected removeNotUploadedList = async (data_id: string): Promise<void> => {
    const uploadList = await this.getNotUploadedList();
    await CacheStorageDB.set(this.DataId_Upload_List, {
      ...uploadList,
      [`${data_id}`]: false,
    });
  };

  async saveCurrentData() {
    this.local_notUploadedDataId = {
      ...this.local_notUploadedDataId,
      [`${this.currentProjectDatas._id}`]: true,
    };
    await CacheStorageDB.set(this.DataId_Upload_List, this.local_notUploadedDataId);

    // 업로드 가능한 항목 관리를 별도 관리 하나 파기
    await CacheStorageDB.set(this.currentProjectDatas._id, this.currentProjectDatas.toJSON().data);
    this.eventList.onSaveLocalData();
  }

  protected DataId_Upload_List = "dataId-Upload-List";
  protected async _onErrorEditEnd() {
    if (this.isLocalMode) {
      await this.saveCurrentData();
    }
    this.eventList.onErrorEditEnd();
  }

  async addImageToValue(file: File): Promise<string> {
    if (file.size == 0) return "";

    const now = Date.now();
    const path = this.captureEnvironmentKey ? `${this.selectedBuildingId}_${this.captureEnvironmentKey}_${now}.webp` : `${this.selectedErrorId}_${this.selectedErrorValueId}_${now}.webp`;

    const insertFile = new File([file], path, { type: file.type });

    const insertResult = await CacheImage.insertFile(`http://localhost/${path}`, insertFile, "insertFile");
    if (!insertResult) return "";

    const Img = {
      url: path,
      __deleted__: 0,
      force: false,
    };

    if (!this.captureEnvironmentKey) {
      this.getSelectedErrorValue()!.pushImg(Img);
    } else {
      this.currentProjectDatas.getEnvironments(this.selectedBuildingId, this.selectedFloorId, this.selectedBuildingId, this.selectedProjectId, this.captureEnvironmentKey).pushImg(Img);
    }

    await this.saveCurrentData();

    this.captureEnvironmentKey = "";
    return path;
  }
}

export const safetydiagnosisApp = new SafetydiagnosisApp();
