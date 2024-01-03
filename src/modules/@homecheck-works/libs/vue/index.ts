import { ref } from 'vue'
import {HyundaiQAuditApp} from '../../models/QAudit/index'
import { WorkApp} from '../../models/Common/index'

export const hyundaiQAuditApp = ref<HyundaiQAuditApp>(new HyundaiQAuditApp());
export const workApp = ref<WorkApp>(new WorkApp())