import {WebRequests} from "@/modules/@homecheck";

export const refreshCredit = async () => {
 const result = await WebRequests.get("https://homecheck.kr/api/v2/safetydiagnosis/getCredit")
return result.data.data;
};

export const getPurchaseInfo = async (space_id: string, project_id: string) => {
  //만약 결제해야할 금액이 0원이라면, 넘어가기
  const result = await WebRequests.get(`https://homecheck.kr/api/v2/safetydiagnosis/getPurchaseInfo?space_id=${space_id}&project_id=${project_id}`)
  //  exportView.value.data = result.data.data;
  console.log(result.data)
    return result.data.data
};



export const purchaseProject = async (space_id: string, project_id: string) => {
  
  const result = await WebRequests.get(`https://homecheck.kr/api/v2/safetydiagnosis/purchaseProject?space_id=${space_id}&project_id=${project_id}`);
  // 만약 성공적인 경우, Credit 다시 받아오기
  if (result.data.data == "success") {
    await refreshCredit();
  }
  return  await getPurchaseInfo(space_id, project_id);
};


