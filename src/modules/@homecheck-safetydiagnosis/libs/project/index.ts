import _ from "lodash";
import { WebRequests, includeCDN, base64ToFile, base64FromUrl, getUnixtime } from "@/modules/@homecheck";
import type {  SafetydiagnosisProjectType, SafetydiagnosisDataType } from "@/modules/@homecheck-safetydiagnosis/models";
import { SafetydiagnosisDatas, SafetydiagnosisData, SafetydiagnosisSpace, ProjectCategory } from "@/modules/@homecheck-safetydiagnosis/models";
import  type { UploadedImg } from '@/modules/@homecheck-safetydiagnosis/models'
import { CacheStorageDB, CacheImage } from "@/modules/@homecheck/libs/CacheStorage";
import { Process } from '@/modules/@homecheck/libs/Process'

export const updateProjects = async (space : SafetydiagnosisSpace) => {
  return await WebRequests.post(`https://homecheck.kr/api/v2/safetydiagnosis/updateProject?id=${space._id}`, {
    projects: space.projects,
  });
};



export const addProjectItem = async (space : SafetydiagnosisSpace, name: string, previous: string, category: ProjectCategory) => {
  const ProjectName = name ? `${name}` : "새 점검";
  const insertValue: SafetydiagnosisProjectType = {
    __created__: getUnixtime(),
    __modified__: getUnixtime(),
    __deleted__: 0,
    data_id: "",
    _id: "",
    previous: previous,
    category: category,
    memo: "메모",
    name: ProjectName,
  };
  let res = await WebRequests.post(`https://homecheck.kr/api/v2/safetydiagnosis/addProject?space_id=${space._id}`, insertValue);
  return {
    ...insertValue,
    _id: res.data.data._id,
    data_id: res.data.data.data_id,
  };
};


export const getSafetydiagnosisDatas= (space : SafetydiagnosisSpace, project: SafetydiagnosisProjectType, isLocalMode : boolean = false): Promise<SafetydiagnosisDatas> => {
    return new Promise(async (resolve, reject) => {
      // project 먼저 가져오기
    const LoadedDatas = await getSafetydiagnosisDatasParsed(space, project, isLocalMode);

      if (typeof LoadedDatas == "string") {
      return reject();
    }

    // 만약 전 회차가 있다면, 가져오기.
    if (project.previous) {
      const previousProject = space.getProjectById(project.previous);
      const previousData = await getSafetydiagnosisDatasRaw(previousProject, isLocalMode);
      if (typeof previousData == "string") {
        return reject();
      }
      LoadedDatas.concatPrevious(previousData);
    }
    resolve(LoadedDatas);
  });
}

async function getSafetydiagnosisDatasParsed(space: SafetydiagnosisSpace, project: SafetydiagnosisProjectType, isLocalMode: boolean = false): Promise<SafetydiagnosisDatas> {
  

  
    const _data = await getSafetydiagnosisDatasRaw(project, isLocalMode);
    // 만약 ex.message를 발생 시킨 거라면
    if (typeof _data == "string") {
      return _data;
    }
    return SafetydiagnosisDatas.Parse({
      _id: project.data_id,
      previous: project.previous,
      data: _data,
      floorSheet: space.getFloorplansValueSheetById(),
    });

}


export const getSafetydiagnosisDatasRaw = async (project: SafetydiagnosisProjectType, isLocalMode: boolean = false): Promise<SafetydiagnosisData[] | string> => {
  let outputData
  // 만약 로컬모드 라면, CacheStorageDB에서 데이터 가져오기
  if (isLocalMode) {
      outputData = (await CacheStorageDB.get(project.data_id)) as SafetydiagnosisDataType[];
    }
  
  // 로컬모드가 아니거나, 불러온 항목이 없다면.
    if (!isLocalMode || !outputData) {
      // 다운로드 받아오기
      let downloaded = await downloadProjectData(project.data_id);

      // 만약 ex.message를 뱉는다면,
      if (typeof downloaded == "string") {
        return downloaded;
      } else {
        // 아니라면 정상 로직
        if (isLocalMode) {
          // 로컬모드인 경우, CacheStorage에 다운로드 된 항목을 넣고, 반환
          await CacheStorageDB.set(project.data_id, downloaded);
          return await getSafetydiagnosisDatasRaw(project);  
        }
        else {
          outputData = downloaded
        }
      }
    }
  
  return outputData.map((_item: SafetydiagnosisDataType) => {
    return SafetydiagnosisData.Parse(_item);
  });
};


async function downloadProjectData(dataId: string) {
  try {
    const res = await WebRequests.get(`https://homecheck.kr/api/v2/safetydiagnosis/getProjectData?_id=${dataId}`);
    return res.data.data;
  } catch (ex) {
    return ex.message;
  }
}







/**
 * ㅁㄴ애ㅔㅂㅈㄷㄹ
 * @param space space에 대한 설명
 * @param project 
 * @param isLocalMode 
 * @param progress 
 * @returns 
 */
export const uploadProjectData = async (space: SafetydiagnosisSpace, project: SafetydiagnosisProjectType, isLocalMode: boolean = false,
  progress: (progress: number, message: string, total: number) => void,
datas : SafetydiagnosisDatas

) => {

  return new Promise(async (resolve, reject) => {


    // #1) 업로드 할 대상
    const dataId = project.data_id;
    const DownloadedProjectData = await downloadProjectData(dataId);
    if (typeof DownloadedProjectData == "string") {
      reject("인터넷을 다시 확인해주세요")
      return;
    }

    // #2) 서버상의 데이터 가져오기
    let serverData = SafetydiagnosisDatas.Parse({
      _id: project.data_id,
      previous: project.previous,
      floorSheet: {},
      data: DownloadedProjectData.map((_item: SafetydiagnosisDataType) => {
        return SafetydiagnosisData.Parse(_item);
      }),
    });

    // #3) 로컬 데이터 불러오기
    let localData
    if (isLocalMode) {
     localData =  await getSafetydiagnosisDatasParsed(space, project, isLocalMode);
    }
    else {
      localData = datas
    }
    console.log("[#4] 결합된 데이터 : ", localData);
    // #4) 서버 데이터와 로컬 데이터 합치기
    localData.combineData(serverData).then(async () => {
      if (isLocalMode) {
            console.log("[#5] 만약 업데이트 해야할 것이 있다면,");

              // #5) [로컬 전용] 업로드 안된 이미지들 가져오기
            const NotUploaded = localData.getNotUploadedFiles();
      
                console.log("[#5] 업로드 되지 않은 항목들 : ", NotUploaded);
              // #6) [로컬 전용] 이미지 업로드하기
          
              setTimeout(() => {
                progress(0, `이미지를 업로드 하고 있습니다.`, NotUploaded.length);
              })
              const UploadedImgs = <UploadedImg[]>[];
               for await (let _img of NotUploaded) {
               console.log("[#5] tryToUpload : ", _img.url)
               const getCdnExist =  await WebRequests.checkFile(_img.url)
               const localURL = `http://localhost/${_img.url}`;
               let CDN_Key
              let UploadedToCDN = false
                 // 만약 CDN에 해당 파일이 있는 경우,
               if(getCdnExist){
              //  CDN_Key = getCdnExist
                UploadedToCDN = true
               }
               else {
                 CDN_Key = await CacheImage.webpUpload(localURL);

                 /*
                  const InsertedResult = await CacheImage.FindWithInserted(localURL, UploadedFiles)
                
                 if (InsertedResult == 'webp')
                 {
                   console.log("is in .")
                   CDN_Key = await CacheImage.webpUpload(localURL);
                 }
                 else {
                  
                   CDN_Key = await receiveCDNKey({
                     InsertedResult,
                     localURL
                   })
                 }
                 */
                 }
                 if (typeof CDN_Key == 'object' || CDN_Key == "")
                 {
                   console.log(CDN_Key)
                   continue;
                 }
                   
                   
                  const cdnURL = `https://homecheck.kr/cdn/?f=${CDN_Key}`;
                 console.log("[#5] CDN_URL : ", cdnURL);        
                 
                 // 만약 CDN_KEY가 정상적일때만
               
                /*
                 if (!CDN_Key) {
                      localData.deleteUploadFile({
                        ..._img,
                        to : ""
                      });
                     continue;
                 }
                 */
                 const to = cdnURL;
                 const updateModel = {
                   ..._img,
                   to,
                 };
                  UploadedImgs.push(updateModel);
                  localData.updateUploadFile(updateModel);
                  setTimeout(() => {
                    progress(UploadedImgs.length, `이미지를 업로드 하고 있습니다.`, NotUploaded.length);
                  });

                  //  #7) [로컬 전용] 업로드 된 이미지 반영하기
                  await CacheStorageDB.set(localData._id, localData.toJSON().data);
                  if(!UploadedToCDN){
                    await CacheImage.changeURL(localURL, cdnURL)
                  }
              }
        
              // #7) [로컬 전용] 업로드 된 이미지 반영하기
             // localData.updateUploadFiles(UploadedImgs);

              // #8 ) [로컬 전용] 모두 업로드 됬는지 재확인
              if (localData.getNotUploadedFiles().length > 0) {
                  return reject("업로드 되지 않은 항목이 있습니다.");
              }
          }

  
      // Compress된 JSON 화
      const localDataJson = localData.toJSON().data;

      WebRequests.post(`https://homecheck.kr/api/v2/safetydiagnosis/updateProjectData?_id=${project.data_id}`, {
        data: localDataJson,
      }).then(async (res) => {
        console.log(res)
        if (res.data.code == "0" || res.data.code == 0) {
          // 만약 성공한 경우, 성공 결과를 저장 및 upload 완료 표시
          resolve(true);
          //notuploadedList에서 해당 항목 지워야함
           await CacheStorageDB.set(localData._id, localDataJson);
        } else {
          reject('업로드에 실패했습니다.');
        }
      });
    });
  });
};
