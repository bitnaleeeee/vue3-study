import _ from "lodash";
import moment_tz from "moment-timezone";
import { CacheStorageDB } from "@/modules/@homecheck/libs/CacheStorage";
import {WebRequests} from "@/modules/@homecheck";







export const getExportOption = async (space_id: string, project_id: string) => {
  let result = await WebRequests.get(`https://homecheck.kr/api/v2/safetydiagnosis/getExportOption?id=${space_id}_${project_id}`);
  return result.data.data;
};

export const setExportOption = async (space_id: string, project_id: string, value: any) => {
  let result = await WebRequests.post(`https://homecheck.kr/api/v2/safetydiagnosis/setExportOption?id=${space_id}_${project_id}`, value);
  return result.data.data;
};














export const loadLastRefreshTime = async (account: string): Promise<moment_tz.Moment | undefined> => {
  const dbtime = await CacheStorageDB.get(`${account}-last-refresh-time`);
  if (dbtime == undefined) {
    return undefined;
  }

  return moment_tz(dbtime);
};


export const resetRefreshTime = async (account : string, isLocalMode : boolean): Promise<moment_tz.Moment> => {
    const output = moment_tz().tz("asia/seoul");
    if (isLocalMode) {
          await CacheStorageDB.set(`${account}-last-refresh-time`, output);        
    }
    return output
};

export const getRefreshTimeString = (time : moment_tz.Moment): String => {
  if (time == undefined) return "미진행";

  const current = moment_tz().tz("asia/seoul");

  const duration = moment_tz.duration(current.diff(time));

  if (duration.asMonths() >= 1) return `${Math.floor(duration.asMonths())}개월 전`;
  else if (duration.asDays() >= 1) return `${Math.floor(duration.asDays())}일 전`;
  else if (duration.asHours() >= 1) return `${Math.floor(duration.asHours())}시간 전`;
  else if (duration.asMinutes() >= 1) return `${Math.floor(duration.asMinutes())}분 전`;

  return "방금 전";
};
