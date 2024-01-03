import { Lib } from "@/modules/@homecheck";
import { HyundaiQAudit } from "../QAudit";
import { WebRequests, getImageSize, getUnixtime } from "@/modules/@homecheck/libs";

import { CacheStorageDB } from "@/modules/@homecheck/libs/CacheStorage";

import { getProjects, addProject, setProject } from './src/webrequests'
import { getLocalProjects, setLocalProjects } from './src/local'

import { ProjectType } from '../enum'
import { workProject } from './project'

type workAppEventList = 'onSelectProject' | 'onRefreshProjects' | 'local:onDownloadRefreshImage'
export class WorkApp {
  isApp: boolean = false;
  user: string = "";

  projects: workProject[] = [];
  currentProject?: workProject;
  selectedProjectId: string = "";
  currentProjectType: ProjectType = ProjectType.QAudit;

  eventList: {
    [key in ProjectType]?: {
      [eventname in workAppEventList]?: (delegator : any) => {};
    };
  } = {};

  addEventListener(type: ProjectType, eventName: workAppEventList, action: () => {}) {
    if (!this.eventList[type]) {
      this.eventList[type] = {};
    }
    this.eventList[type]![eventName] = action;
    }
    doEvent(eventName : workAppEventList, delegator : any) {
        if (!this.currentProjectType) return;
        if (!this.eventList[this.currentProjectType]) return;
        
        if (!this.eventList[this.currentProjectType]![eventName]) return;

        this.eventList[this.currentProjectType]![eventName]!(delegator)
    }

  async init(): Promise<WorkApp> {
    console.log(`[@homecheck-projectManager] loaded, ${Lib.storagePath}`);
    this.isApp = Lib.storagePath == "local";
    if (Lib.storagePath == "local") {
      await this.reload();
    } else {
      // web 모드
      await this.refresh();
    }

    return this;
  }

  // 유저 정보 가져오기
  async reload() {
    this.user = await CacheStorageDB.get("account");
    if (!this.user) return;
    this.projects = await getLocalProjects(this.user);
  }
  // 목록 새로고침
  async refresh() {
    await this.refreshProjects();
  }

  // 수동 새로고침
  async refreshProjects() {
    const projects = await getProjects(this.isApp);
    this.projects = projects;
    if (this.isApp) {
      await setLocalProjects(this.user, projects, (current, total)=> {
        console.log(current)
      });
    }
    this.doEvent("onRefreshProjects", projects);
  }

  async addProject(value : HyundaiQAudit) {
    const result = await addProject(value);
    await this.refreshProjects();
  }

  getProjects() {
    return this.projects.filter((project) => project.__deleted__ == 0);
  }

  selectProject(id: string) {
    this.currentProject = this.projects.find((project) => project._id == id)!;
      this.selectedProjectId = id;
      this.currentProjectType = this.currentProject.type;
      // 이벤트 리스너 발동
      this.doEvent("onSelectProject", this.currentProject)
  }
  releaseProject() {
    this.selectedProjectId = "";
  }
  async deleteProject(value: HyundaiQAudit) {
     const itemIndex = this.projects.findIndex(project => project._id == value._id)
    if (itemIndex == -1) return;

    this.projects[itemIndex].__deleted__ = getUnixtime();
    await setProject(value);
    this.releaseProject();
  }

  async saveProject(value : HyundaiQAudit) {
    await setProject(value);
    this.projectChanged(value)
  }

  async projectChanged(value : HyundaiQAudit) {
    const itemIndex = this.projects.findIndex(project => project._id == value._id)
    if (itemIndex != -1) {
      this.projects[itemIndex] = value
    }
  }

  async projectPropertyChanged(id : string, property : string, value : any) {
     const itemIndex = this.projects.findIndex(project => project._id == id)
    if (itemIndex != -1) {
      this.projects[itemIndex]![property] = value
    }
  }
}
