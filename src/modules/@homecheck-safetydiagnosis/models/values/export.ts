import { appearenceInspectionString } from "./appearence";
import { safetyInspectionString } from "./inspection";

export const inspectionString = {
  ...appearenceInspectionString,
  ...safetyInspectionString,
};
