import { WebRequests } from "@/modules/@homecheck";

export const getPurchaseHistory = async () => {
  const res = await WebRequests.get("https://homecheck.kr/api/v2/safetydiagnosis/getPurchaseHistory");
  return res.data.data;
};
