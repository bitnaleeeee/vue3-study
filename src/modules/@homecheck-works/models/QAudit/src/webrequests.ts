import { HyundaiQAudit } from '../index'
import { HyundaiQAuditTemplate } from '../templates'
import { HyundaiQAuditRecord, HyundaiQAuditRecordData } from '../record'
import {WorksNotice} from "../../Common/notice";
import { WebRequests } from '@/modules/@homecheck/libs'


export const setTemplates = async (project_id: string, templates: HyundaiQAuditTemplate[]) => {
  const res = await WebRequests.post(`https://homecheck.kr/api/v2/works/hyundaiqaudit/setTemplates?id=${project_id}`, templates);
  return res.data.data;
};


export const setRecords = async (project_id: string, records: HyundaiQAuditRecord[]) => {
  const res = await WebRequests.post(`https://homecheck.kr/api/v2/works/hyundaiqaudit/setRecords?id=${project_id}`, records);
  return res.data.data;
};

export const setNotices = async (project_id: string, notices: WorksNotice[]) => {
  const res = await WebRequests.post(`https://homecheck.kr/api/v2/works/hyundaiqaudit/setNotices?id=${project_id}`, notices);
  return res.data.data;
};

export const setPermissions = async (project_id: string, records: HyundaiQAuditRecord[]) => {
  const res = await WebRequests.post(`https://homecheck.kr/api/v2/works/hyundaiqaudit/setRecords?id=${project_id}`, records);
  return res.data.data;
};


export const getRecordData = async (data_id: string) => {
    const res = await WebRequests.get(`https://homecheck.kr/api/v2/works/getData?_id=${data_id}`);
    return res.data.data
}

export const setRecordData = async (data_id: string, data: {data: HyundaiQAuditRecordData[]}) => {
    const res = await WebRequests.post(`https://homecheck.kr/api/v2/works/setData?_id=${data_id}`, data);
    return res.data
};


