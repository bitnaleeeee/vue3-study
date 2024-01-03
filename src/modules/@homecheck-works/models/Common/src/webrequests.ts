import { WebRequests } from '@/modules/@homecheck/libs'

export const getProjects = async (isApp: boolean): Promise<never[]> => {
  const res = await WebRequests.get(`https://homecheck.kr/api/v2/works/getProjects?mode=${isApp ? "app" : "all"}`);
  return res.data.data
};

export const addProject = async (project: any): Promise<string> => {
  const res = await WebRequests.post(`https://homecheck.kr/api/v2/works/addProject`, project);
  return res.data.data;
};

export const setProject = async (project: any) => {
  const res = await WebRequests.post(`https://homecheck.kr/api/v2/works/setProject?id=${project._id}`, project);
  return res.data.data;
};
