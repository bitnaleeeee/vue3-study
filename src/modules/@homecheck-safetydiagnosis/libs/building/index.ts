import { WebRequests, getUnixtime } from "@/modules/@homecheck";
import {SafetydiagnosisSpace} from "@/modules/@homecheck-safetydiagnosis/models";

export const updateBuildings = async (space : SafetydiagnosisSpace) => {
  return await WebRequests.post(`https://homecheck.kr/api/v2/safetydiagnosis/updateSpace?id=${space._id}`, {
    floorplans: space.floorplans.map((building) => {
      return {
        ...building,
        data: building.data.filter((floor) => !floor.new),
      };
    }),
  });
};
