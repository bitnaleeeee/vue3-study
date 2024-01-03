import _ from 'lodash'
import { CacheStorageDB } from "@/modules/@homecheck/libs/CacheStorage";
import { WebRequests } from "@/modules/@homecheck";
import { SafetydiagnosisChecklist } from "@/modules/@homecheck-safetydiagnosis/models";

export const getChecklist = async (): Promise<unknown> => {
  return await WebRequests.get(`https://homecheck.kr/api/v2/safetydiagnosis/getChecklist`);
};

// reloadSettings
export const getLocalChecklist = async (account: string): Promise<SafetydiagnosisChecklist> => {
  const localChecklist = await CacheStorageDB.get(`${account}-settings_data`);
  return SafetydiagnosisChecklist.Parse(localChecklist);
};

// refreshSettings
export const refreshChecklist = async (account: string, cacheFile: boolean = false): Promise<SafetydiagnosisChecklist | any> => {
  return new Promise((resolve, reject) => {
    getChecklist()
      .then(async (res) => {
        if (res.data.code != "0" || res.data.code != 0) {
          reject("error");
          return;
        }
        const inputData = res.data.data;

        console.log(res.data)
        // 임시 마이그레이션
        if (!_.isArray(inputData.data)) {
          inputData.data = _.toArray(inputData.data);
        }
        if (cacheFile) {
          await CacheStorageDB.set(`${account}-settings_data`, inputData);
        }
        resolve(SafetydiagnosisChecklist.Parse(inputData));
      })
      .catch((error) => {
        reject(error);
      });
  });
};
