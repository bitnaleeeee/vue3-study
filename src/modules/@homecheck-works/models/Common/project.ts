
import {HyundaiQAudit} from '../QAudit'
import {ProjectType} from '../enum'

export class workProject {
  _id: string = "";
  type: ProjectType = ProjectType.QAudit;
  name: string = "";
  description: string = "";
  hidden: boolean = false;
  __deleted__: number = 0;



  getLocalImages() : string[]{
    return []
  }
  static Parse(value: Partial<workProject>) {
    switch(value.type){
      case ProjectType.QAudit :
        return HyundaiQAudit.Parse(value)
      break;
    }
  }
}