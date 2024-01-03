import {Lib} from "@/modules/@homecheck";
import { WebRequests, getImageSize , getUnixtime} from '@/modules/@homecheck/libs'
import { CacheStorageDB } from "@/modules/@homecheck/libs/CacheStorage";

import { InputType, ConditionNumber, RecordDataStatus } from './enum'
import {ProjectType } from "../enum";
import {WorksNotice} from "../Common/notice";
import {HyundaiQAuditTemplate, HyundaiQAuditTemplatesSequence, HyundaiQAuditTemplatesSequenceGroup} from "./templates";
import { HyundaiQAuditRecord } from "./record";

import {setTemplates, setRecords, setNotices, setPermissions, getRecordData, setRecordData} from "./src/webrequests"
import { getLocalData, saveLocalData } from './src/local'

import { WorkApp} from '../Common'
import { workProject } from '../Common/project'

//HyundaiQAudit > Record > RecordData
export class HyundaiQAudit extends workProject {
  period: string = "기간 설정되지 않음";

  /*
    templates :: 
    각 세대(점검 대상의 유형)을 등록 가능함. 
    기존에 사용된 체크리스트를 불러와서 편집할 수 있음. (체크리스트들은 building 과 비슷 ) 

    점검 진행 도중, 체크리스트가 변경될 수 있음. 실시간보다 수동으로 버튼눌러서 체크리스트 확인하는게 빠를듯.
    */
  templates: HyundaiQAuditTemplate[] = [];

  // template._id를 포함
  records: HyundaiQAuditRecord[] = [];

  // 작업 지시 및 전달 사항
  notices: WorksNotice[] = [];

  permissions: string[] = [];

  getNotices() {
    return this.notices.filter((notice) => notice.__deleted__ == 0);
  }

  getRecords() {
    return this.records.filter((record) => record.__deleted__ == 0);
  }

  getTemplates() {
    return this.templates.filter((template) => template.__deleted__ == 0);
  }

  getLocalImages(): string[] {
    return this.getTemplates().map(template => template.img)
  }

  static Parse(value: Partial<HyundaiQAudit>) {
    const output = new HyundaiQAudit();
    Object.assign(output, value);
    output.notices = output.notices.map((obj) => WorksNotice.Parse(obj));
    output.templates = output.templates.map((obj) => HyundaiQAuditTemplate.Parse(obj));
    output.records = output.records.map((obj) => HyundaiQAuditRecord.Parse(obj));

    return output;
  }
}

export class HyundaiQAuditApp {
  isApp: boolean = false;

  user: string = "";

  projects: HyundaiQAudit[] = [];
  currentProject: HyundaiQAudit = new HyundaiQAudit();
  selectedProjectId: string = "";

  records: HyundaiQAuditRecord[] = [];
  currentRecord: HyundaiQAuditRecord = new HyundaiQAuditRecord();
  selectedRecordId: string = "";

  currentTemplate: HyundaiQAuditTemplate = new HyundaiQAuditTemplate();
  selectedTemplateId: string = "";

  currentSequence: HyundaiQAuditTemplatesSequence = new HyundaiQAuditTemplatesSequence();
  selectedSequenceId: string = "";

  currentSequenceGroup: HyundaiQAuditTemplatesSequenceGroup = new HyundaiQAuditTemplatesSequenceGroup();
  selectedSequenceGroupId: string = "";

  workApp: WorkApp = new WorkApp();

  async init(workApp : WorkApp) {
    console.log(`[@homecheck-hyundaiQAudit] init`);
    this.isApp = Lib.storagePath == "local";
    this.workApp = workApp

    // 1) 현대 앱을 선택했을 때,
    workApp.addEventListener(ProjectType.QAudit, "onSelectProject", (project) => {
      console.log('selected HyundaiQProject')
      this.currentProject = HyundaiQAudit.Parse(project)
      this.selectedProjectId = this.currentProject._id
    })
    

    // 2) 현대 앱의 프로젝트들만 가져오기
    workApp.addEventListener(ProjectType.QAudit, "onRefreshProjects", (projects) => { 
      console.log("get HyundaiProjects");
      this.parseProjects(projects)
    });

    this.parseProjects(workApp.projects);
  }


  parseProjects(projects) {
    this.projects = projects.map((project) => HyundaiQAudit.Parse(project));
  }



  addProject() {
    const insertValue = new HyundaiQAudit();
    insertValue.name = "새 현장 명";
    insertValue.description = "설명 없음";
    this.workApp.addProject(insertValue)
  }

  releaseProject() {
    this.selectedProjectId = "";
    this.workApp.releaseProject();
  }

  saveProject() {
    this.workApp.saveProject(this.currentProject);
  }

  deleteProject() {
    this.workApp.deleteProject(this.currentProject)
  }




  async mergeRecordData(record_id : string){

    const currentRecord = this.currentProject.records.find((record) => record._id == record_id)!;
    currentRecord.data = await this.loadRecordData(currentRecord.data_id);
    
    let oldRecordDatas = await getRecordData(currentRecord.data_id);
    console.log(this.currentRecord)

    currentRecord.merge(oldRecordDatas)

    // 모든 이미지들 업로드



    



    // 업로드.
    setRecordData(currentRecord.data_id, {
      data : currentRecord.data 
    })



    if(this.isApp){
      saveLocalData(currentRecord.data_id, currentRecord.data)
    }
  }


  async selectRecord(id: string) {
    this.currentRecord = this.currentProject.records.find((record) => record._id == id)!;
    this.selectedRecordId = id;

    this.selectTemplate(this.currentRecord.template_id)
    

    // 첫 레코드 액티브시 템플릿 기반으로 rule 설정하기
    this.fillRecordRules();
    this.currentRecord.data  = await this.loadRecordData( this.currentRecord.data_id);
    this.fillRecordData();
    
    console.log(this.currentRecord)
    
  }

  fillRecordRules(){
    for(let group of this.currentTemplate.getSequenceGroups()){
      for(let sequence of this.currentTemplate.getSequences()){
        const found = this.currentRecord.findRule(group._id, sequence._id)
        const templateRule = group.getRule(sequence._id)
        // 만약 관련된 룰이 없다면
        if(!found) {
          this.currentRecord.addRule({
            ...templateRule,
            group_id : group._id
          })
        }
      }
    }
  }

  fillRecordData(){
    for(let group of this.currentTemplate.getSequenceGroups()){
      for(let sequence of this.currentTemplate.getSequences()){
        const found = this.currentRecord.findData(group._id, sequence._id)
        
        const changeStatus = this.currentRecord.findRule(group._id, sequence._id)!.status
  

        // 만약 관련 데이터가 없다면
        if(!found) {
          this.currentRecord.addData(group._id, sequence._id, changeStatus)
        }
        else if(
          found.status == RecordDataStatus.Default 
          && found.imgs.length == 0 
          && found.value.length == 0
          && found.memo == ''){
          found.status = changeStatus
        }
        
      }
    }
  }

  async downloadRecordData(data_id: string){
    await saveLocalData(data_id, await getRecordData(data_id))
  }

  async loadRecordData(data_id : string){
    let loaded;
    if(this.isApp) {
       loaded =  await getLocalData(data_id)
      if(loaded){
        return loaded;
      }
    }
    
    loaded = await getRecordData(data_id)
    if(this.isApp){
      saveLocalData(data_id, loaded)
    }
    return loaded;
  }

  saveLocalData(){
   saveLocalData(this.currentRecord.data_id, this.currentRecord.data) 
  }







  selectTemplate(id: string) {
    this.currentTemplate = this.currentProject.templates.find((template) => template._id == id)!;
    this.selectedTemplateId = id;
  }
  selectSequence(id: string) {
    this.currentSequence = this.currentTemplate.sequences.find((seq) => seq._id == id)!;
    this.selectedSequenceId = id;
  }
  selectSequenceGroup(id: string) {
    this.currentSequenceGroup = this.currentTemplate.sequenceGroups.find((group) => group._id == id)!;
    this.selectedSequenceGroupId = id;
  }



  addNotice() {
    this.currentProject.notices.unshift(new WorksNotice());
  }
  async saveNotices() {
    await setNotices(this.selectedProjectId, this.currentProject.notices);
    this.workApp.projectPropertyChanged(this.selectedProjectId, "notices", this.currentProject.notices)
  }

  addRecord() {
    this.currentProject.records.push(new HyundaiQAuditRecord());
  }
  async saveRecords() {
    await setRecords(this.selectedProjectId, this.currentProject.records);
    this.workApp.projectPropertyChanged(this.selectedProjectId, "records", this.currentProject.records)
  }

  addTemplate() {
    const template = new HyundaiQAuditTemplate();
    template.name = "새 템플릿";
    this.currentProject.templates.push(template);
  }
  async saveTemplates() {
    for await (const template of this.currentProject.templates) {
       if (template.width == 0 && template.height == 0 && template.img != "") {
         const {width, height} = await getImageSize(template.img);
         const key = await WebRequests.uploadBase64(template.img, `${template._id}_img.webp`);
         template.img = key;
         template.width = width;
         template.height = height;
       }
    }

    await setTemplates(this.selectedProjectId, this.currentProject.templates);
    this.workApp.projectPropertyChanged(this.selectedProjectId, "templates", this.currentProject.templates)
  }
  cloneTemplate(target: HyundaiQAuditTemplate) {
    const insert = HyundaiQAuditTemplate.Parse(target);

    insert.refreshId();
    this.currentProject.templates.push(insert);
  }

  deleteTemplate() {
    this.currentTemplate.__deleted__ = getUnixtime();
    this.selectedTemplateId = "";
  }

  addSequence() {
    const insert = new HyundaiQAuditTemplatesSequence();
    insert.name = "새 점검 요소";

    this.currentTemplate.sequences.push(insert);
  }

  cloneSequence(target: HyundaiQAuditTemplatesSequence) {
    const insert = HyundaiQAuditTemplatesSequence.Parse(target);

    insert.refreshId();
    this.currentTemplate.sequences.push(insert);
  }

  swapSequence(direction: "up" | "down", index: number) {
    const output = [];
    for (let i = 0; i < this.currentTemplate.sequences.length; i++) {
      if (i == index) {
        if (direction == "up" && i != 0) {
          output[i - 1] = this.currentTemplate.sequences[i];
          output[i] = this.currentTemplate.sequences[i - 1];
        } else if (direction == "down" && i != this.currentTemplate.sequences.length) {
          output[i + 1] = this.currentTemplate.sequences[i];
          output[i] = this.currentTemplate.sequences[i + 1];
        }
      } else if (!output[i]) {
        output[i] = this.currentTemplate.sequences[i];
      }
    }
    this.currentTemplate.sequences = output;
  }

  addSequenceGroup() {
    const insert = new HyundaiQAuditTemplatesSequenceGroup();
    insert.name = "새 점검 요소 그룹";

    this.currentTemplate.sequenceGroups.push(insert);
  }
  cloneSequenceGroup(target: HyundaiQAuditTemplatesSequenceGroup) {
    const insert = HyundaiQAuditTemplatesSequenceGroup.Parse(target);

    insert.refreshId();
    this.currentTemplate.sequenceGroups.push(insert);
  }

  swapSequenceGroup(direction: "up" | "down", index: number) {
    const output = [];
    for (let i = 0; i < this.currentTemplate.sequenceGroups.length; i++) {
      if (i == index) {
        if (direction == "up" && i != 0) {
          output[i - 1] = this.currentTemplate.sequenceGroups[i];
          output[i] = this.currentTemplate.sequenceGroups[i - 1];
        } else if (direction == "down" && i != this.currentTemplate.sequenceGroups.length) {
          output[i + 1] = this.currentTemplate.sequenceGroups[i];
          output[i] = this.currentTemplate.sequenceGroups[i + 1];
        }
      } else if (!output[i]) {
        output[i] = this.currentTemplate.sequenceGroups[i];
      }
    }
    this.currentTemplate.sequenceGroups = output;
  }

  addSequenceInput() {
    this.currentSequence.inputs.push({
      type: InputType.Number,
      name: "",
      value_default_boolean: true,
      value_default_number: 0,
      value_default_string: "",

      value_number_conditions: [],
      value_number_unit: "",

      value_boolean_false: "거짓",
      value_boolean_true: "참",
    });
  }

  deleteSequenceInput(index: number) {
    this.currentSequence.inputs.splice(index, 1);
  }

  addSequenceInputCondition(index: number) {
    this.currentSequence.inputs[index].value_number_conditions.push({
      condition: ConditionNumber.Equal,
      value: 0,
    });
  }
  deleteSequenceInputCondition(index: number, targetIndex: number) {
    this.currentSequence.inputs[index].value_number_conditions.splice(index, 1);
  }

  getAllTemplates() {
    const output = [];
    for (let project of this.projects) {
      output.push(...project.getTemplates());
    }
    return output;
  }
}
