import _ from "lodash";
import axios from "axios";

import { CacheStorageDB, CacheImage } from "@/modules/@homecheck/libs/CacheStorage";
import { WebRequests, getUnixtime } from "@/modules/@homecheck";
import { SafetydiagnosisSpace } from "@/modules/@homecheck-safetydiagnosis/models";


export const addSpaceItem = async (name: string, length : number) => {
  const spaceName = name ? `${name}` : `새 점검 ${length}`;

  const newItem = new SafetydiagnosisSpace();
  newItem.name = spaceName;
  let res = await WebRequests.post("https://homecheck.kr/api/v2/safetydiagnosis/addSpace", newItem);

  return res.data.data;
};

export const deleteSpaceItem = async (space: SafetydiagnosisSpace) => {

  space.__deleted__ = getUnixtime();
  let res = await WebRequests.post(`https://homecheck.kr/api/v2/safetydiagnosis/updateSpace?id=${space._id}`, {
    __deleted__: getUnixtime(),
  });
  return res;

};

export const updateSpaceItem = async (space: SafetydiagnosisSpace) => {

  return await WebRequests.post(`https://homecheck.kr/api/v2/safetydiagnosis/updateSpace?id=${space._id}`, {
    name: space.name,
    memo: space.memo,
    address: space.address,
    hidden: space.hidden,
  });
};



export const getSpaces = async (isApp : boolean): Promise<unknown> => {
  return await WebRequests.get(`https://homecheck.kr/api/v2/safetydiagnosis/getSpaces?mode=${isApp ? 'app' : 'all'}`);
};

// reloadSpaces
export const getLocalSpaces = async (account: string): Promise<SafetydiagnosisSpace[]> => {
  const StoredSpace = await CacheStorageDB.get(`${account}-spaces`);
  return toSpaces(StoredSpace);
};

export const refreshSpaces = async (account: string, isApp: boolean, onSpacePhotoDownloading: (progress: number, total: number) => {}): Promise<SafetydiagnosisSpace[]> => {
  return new Promise((resolve, reject) => {
    getSpaces(isApp)
      .then(async (res) => {
        if (!res.data.data) {
          reject("res.data.data is undefined");
        }
        const _Spaces = res.data.data;
        
        if (isApp) {
          /*
          var totalDownload = 0;
          for (var i = 0; i < _Spaces.length; i++) {
            for (const floorplan_group of _Spaces[i].floorplans) {
              totalDownload = totalDownload + floorplan_group.data.length;
            }
          }

          let downloaded = 0;

          for (var i = 0; i < _Spaces.length; i++) {
            // 평면도 사진파일 받아서 저장하기
            if (_Spaces[i].floorplans) {
              for await (const floorplan_group of _Spaces[i].floorplans) {
                for await (const floorplan of floorplan_group.data) {
                  downloaded++;

                  // 평면도 파일 경우 삭제를 방지하기 위해, 해당 특수문자 부착
                  const cdnURL = `https://homecheck.kr/cdn/?f=${floorplan.img}`;

                  if (onSpacePhotoDownloading) {
                    onSpacePhotoDownloading(downloaded, totalDownload);
                  }
                  // 파일 이있는경우, 컨티뉴
                  if (await CacheImage.isExist(cdnURL)) continue;

                  await CacheImage.set(cdnURL);
                  
                    const img_res = await axios.get(`https://homecheck.kr/cdn/?f=${floorplan.img}`, {
                      responseType: "arraybuffer",
                    });
                    var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(img_res.data)));
                    //const base64String = await base64FromUrl(`https://homecheck.kr/cdn/?f=${floorplan.img}`);
                    await Files.setFile(fileKey, base64String);
                
                  
                }
              }
            }
          }
          */
          await CacheStorageDB.set(`${account}-spaces`, _Spaces);
        }

        
        const result = toSpaces(_Spaces);
        resolve(result);
      })
      .catch((reason: any) => {
        reject(reason);
      });
  });
};

function toSpaces(arr: never[]): SafetydiagnosisSpace[] {
  return (arr ? arr : []).map((_item) => {
    return SafetydiagnosisSpace.Parse(_item);
  });
}
